// ======================================================
// CONFIGURACIÓN SUPABASE
// ======================================================

const SUPABASE_URL =
    "https://aoyzlskorbbloxppwmhs.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_0zwj4FTrsrvMaosuHpuGaQ_XNiZc8Df";


// ======================================================
// ELEMENTOS DE LA PÁGINA
// ======================================================

const dniInput = document.getElementById("dni");
const trabajadorInfo = document.getElementById("trabajadorInfo");
const mensaje = document.getElementById("mensaje");

const btnEntrada = document.getElementById("btnEntrada");
const btnSalida = document.getElementById("btnSalida");


// ======================================================
// TEMPORIZADOR DE LIMPIEZA
// ======================================================

let temporizadorLimpieza = null;


// ======================================================
// RELOJ
// ======================================================

function actualizarReloj() {

    const ahora = new Date();

    const horas =
        String(ahora.getHours()).padStart(2, "0");

    const minutos =
        String(ahora.getMinutes()).padStart(2, "0");

    const segundos =
        String(ahora.getSeconds()).padStart(2, "0");

    document.getElementById("reloj").textContent =
        `${horas}:${minutos}:${segundos}`;

    document.getElementById("fecha").textContent =
        ahora.toLocaleDateString(
            "es-PE",
            {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
            }
        );
}

actualizarReloj();

setInterval(actualizarReloj, 1000);


// ======================================================
// LIMPIAR PANTALLA
// ======================================================

function limpiarPantalla() {

    console.log("Limpiando pantalla...");

    dniInput.value = "";

    trabajadorInfo.innerHTML = "";

    mensaje.textContent = "";

    btnEntrada.disabled = false;
    btnSalida.disabled = false;

}


// ======================================================
// PROGRAMAR LIMPIEZA AUTOMÁTICA
// ======================================================

function programarLimpieza() {

    // Cancelar temporizador anterior
    if (temporizadorLimpieza !== null) {

        clearTimeout(temporizadorLimpieza);

    }

    console.log("La pantalla se limpiará en 3 segundos...");

    temporizadorLimpieza = setTimeout(function () {

        limpiarPantalla();

        temporizadorLimpieza = null;

        console.log("Pantalla limpia. Lista para el siguiente trabajador.");

    }, 3000);

}


// ======================================================
// TECLADO TÁCTIL
// ======================================================

document.querySelectorAll(".numero").forEach(function (boton) {

    boton.addEventListener("click", function () {

        const numero = boton.dataset.numero;

        if (dniInput.value.length < 8) {

            dniInput.value += numero;

            // Cuando completa los 8 dígitos
            if (dniInput.value.length === 8) {

                consultarTrabajador();

            }

        }

    });

});


// ======================================================
// BOTÓN BORRAR
// ======================================================

document
    .getElementById("btnBorrar")
    .addEventListener("click", function () {

        dniInput.value =
            dniInput.value.slice(0, -1);

        trabajadorInfo.innerHTML = "";

        mensaje.textContent = "";

    });


// ======================================================
// BOTÓN LIMPIAR
// ======================================================

document
    .getElementById("btnLimpiar")
    .addEventListener("click", function () {

        if (temporizadorLimpieza !== null) {

            clearTimeout(temporizadorLimpieza);

            temporizadorLimpieza = null;

        }

        limpiarPantalla();

    });


// ======================================================
// CONSULTAR TRABAJADOR
// ======================================================

async function consultarTrabajador() {

    const dni =
        dniInput.value.trim();

    trabajadorInfo.innerHTML =
        "⏳ Buscando trabajador...";

    try {

        const respuesta = await fetch(
            `${SUPABASE_URL}/rest/v1/rpc/consultar_trabajador`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "apikey": SUPABASE_KEY,
                    "Authorization": `Bearer ${SUPABASE_KEY}`
                },

                body: JSON.stringify({
                    p_dni: dni
                })
            }
        );

        const resultado =
            await respuesta.json();

        console.log("Consulta:", resultado);


        // ==================================================
        // ERROR DE SUPABASE
        // ==================================================

        if (!respuesta.ok) {

            trabajadorInfo.innerHTML =
                "❌ Error al consultar trabajador.";

            programarLimpieza();

            return;

        }


        // ==================================================
        // DNI NO ENCONTRADO
        // ==================================================

        if (!resultado.ok) {

            trabajadorInfo.innerHTML =
                `⚠️ ${resultado.mensaje}`;

            programarLimpieza();

            return;

        }


        // ==================================================
        // TRABAJADOR CON HORARIO
        // ==================================================

        if (resultado.tiene_horario) {

            trabajadorInfo.innerHTML = `

                <div class="nombre-trabajador">

                    👤 ${resultado.nombre}
                    ${resultado.apellidos}

                </div>

                <div class="datos-trabajador">

                    <p>
                        <strong>Área:</strong>
                        ${resultado.area}
                    </p>

                    <p>
                        <strong>Cargo:</strong>
                        ${resultado.cargo}
                    </p>

                    <p>
                        <strong>Horario:</strong>
                        ${resultado.hora_entrada.substring(0,5)}
                        -
                        ${resultado.hora_salida.substring(0,5)}
                    </p>

                </div>

            `;

        }


        // ==================================================
        // TRABAJADOR SIN HORARIO
        // ==================================================

        else {

            trabajadorInfo.innerHTML = `

                <div class="nombre-trabajador">

                    👤 ${resultado.nombre}
                    ${resultado.apellidos}

                </div>

                <div class="datos-trabajador">

                    <p>
                        <strong>Área:</strong>
                        ${resultado.area}
                    </p>

                    <p>
                        <strong>Cargo:</strong>
                        ${resultado.cargo}
                    </p>

                    <p class="sin-horario">

                        ⚠️ ${resultado.mensaje}

                    </p>

                </div>

            `;

            programarLimpieza();

        }

    }

    catch (error) {

        console.error(error);

        trabajadorInfo.innerHTML =
            "❌ No se pudo conectar con el sistema.";

        programarLimpieza();

    }

}


// ======================================================
// REGISTRAR MARCACIÓN
// ======================================================

async function registrarMarcacion(tipo) {

    const dni =
        dniInput.value.trim();


    // ==================================================
    // VALIDAR DNI VACÍO
    // ==================================================

    if (dni === "") {

        mensaje.textContent =
            "⚠️ Ingrese su DNI";

        programarLimpieza();

        return;

    }


    // ==================================================
    // VALIDAR 8 DÍGITOS
    // ==================================================

    if (!/^\d{8}$/.test(dni)) {

        mensaje.textContent =
            "⚠️ Complete los 8 dígitos del DNI";

        programarLimpieza();

        return;

    }


    // ==================================================
    // DESACTIVAR BOTONES
    // ==================================================

    btnEntrada.disabled = true;
    btnSalida.disabled = true;


    mensaje.textContent =
        "⏳ Registrando...";


    try {

        const respuesta = await fetch(
            `${SUPABASE_URL}/rest/v1/rpc/registrar_marcacion`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "apikey": SUPABASE_KEY,
                    "Authorization": `Bearer ${SUPABASE_KEY}`
                },

                body: JSON.stringify({
                    p_dni: dni,
                    p_tipo: tipo
                })
            }
        );


        const resultado =
            await respuesta.json();


        console.log(
            "Resultado de marcación:",
            resultado
        );


        // ==================================================
        // ERROR DE SUPABASE
        // ==================================================

        if (!respuesta.ok) {

            mensaje.textContent =
                "❌ Error al registrar.";

            programarLimpieza();

            return;

        }


        // ==================================================
        // MARCACIÓN CORRECTA
        // ==================================================

        if (resultado.ok) {

            if (tipo === "ENTRADA") {

                mensaje.textContent =
                    `✅ ${resultado.mensaje}`;

            }

            else {

                mensaje.textContent =
                    `✅ ${resultado.mensaje}`;

            }

            // Limpiar automáticamente
            programarLimpieza();

        }


        // ==================================================
        // MARCACIÓN NO PERMITIDA
        // ==================================================

        else {

            mensaje.textContent =
                `⚠️ ${resultado.mensaje}`;

            // También limpiar automáticamente
            programarLimpieza();

        }

    }

    catch (error) {

        console.error(error);

        mensaje.textContent =
            "❌ No se pudo conectar con el sistema.";

        programarLimpieza();

    }

}


// ======================================================
// BOTÓN ENTRADA
// ======================================================

btnEntrada.addEventListener(
    "click",
    function () {

        registrarMarcacion("ENTRADA");

    }
);


// ======================================================
// BOTÓN SALIDA
// ======================================================

btnSalida.addEventListener(
    "click",
    function () {

        registrarMarcacion("SALIDA");

    }
);