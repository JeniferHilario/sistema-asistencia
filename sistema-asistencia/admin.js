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
// TEMPORIZADOR
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

    mensaje.innerHTML = "";

    btnEntrada.disabled = false;
    btnSalida.disabled = false;

}


// ======================================================
// PROGRAMAR LIMPIEZA — 6 SEGUNDOS
// ======================================================

function programarLimpieza() {

    if (temporizadorLimpieza !== null) {

        clearTimeout(temporizadorLimpieza);

    }

    console.log(
        "La pantalla se limpiará en 6 segundos..."
    );

    temporizadorLimpieza =
        setTimeout(function () {

            limpiarPantalla();

            temporizadorLimpieza = null;

            console.log(
                "Pantalla limpia."
            );

        }, 6000);

}


// ======================================================
// TECLADO TÁCTIL
// ======================================================

document
    .querySelectorAll(".numero")
    .forEach(function (boton) {

        boton.addEventListener(
            "click",
            function () {

                const numero =
                    boton.dataset.numero;

                if (dniInput.value.length < 8) {

                    dniInput.value += numero;

                    if (
                        dniInput.value.length === 8
                    ) {

                        consultarTrabajador();

                    }

                }

            }
        );

    });


// ======================================================
// BOTÓN BORRAR
// ======================================================

document
    .getElementById("btnBorrar")
    .addEventListener(
        "click",
        function () {

            dniInput.value =
                dniInput.value.slice(0, -1);

            trabajadorInfo.innerHTML = "";

            mensaje.innerHTML = "";

        }
    );


// ======================================================
// BOTÓN LIMPIAR
// ======================================================

document
    .getElementById("btnLimpiar")
    .addEventListener(
        "click",
        function () {

            if (
                temporizadorLimpieza !== null
            ) {

                clearTimeout(
                    temporizadorLimpieza
                );

                temporizadorLimpieza = null;

            }

            limpiarPantalla();

        }
    );


// ======================================================
// CONSULTAR TRABAJADOR
// ======================================================

async function consultarTrabajador() {

    const dni =
        dniInput.value.trim();

    trabajadorInfo.innerHTML =
        "⏳ Buscando trabajador...";

    try {

        const respuesta =
            await fetch(
                `${SUPABASE_URL}/rest/v1/rpc/consultar_trabajador`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "apikey":
                            SUPABASE_KEY,

                        "Authorization":
                            `Bearer ${SUPABASE_KEY}`
                    },

                    body: JSON.stringify({
                        p_dni: dni
                    })
                }
            );

        const resultado =
            await respuesta.json();

        console.log(
            "Consulta:",
            resultado
        );


        // ==================================================
        // ERROR
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
        // SIN HORARIO
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
// OBTENER UBICACIÓN
// ======================================================

function obtenerUbicacion() {

    return new Promise(
        function (resolve, reject) {

            if (
                !navigator.geolocation
            ) {

                reject(
                    new Error(
                        "Ubicación no disponible."
                    )
                );

                return;

            }

            navigator.geolocation.getCurrentPosition(

                function (posicion) {

                    resolve({

                        latitud:
                            posicion.coords.latitude,

                        longitud:
                            posicion.coords.longitude,

                        precision:
                            posicion.coords.accuracy

                    });

                },

                function (error) {

                    console.error(
                        "Error ubicación:",
                        error
                    );

                    reject(error);

                },

                {
                    enableHighAccuracy: true,

                    timeout: 10000,

                    maximumAge: 0
                }

            );

        }
    );

}


// ======================================================
// FORMATEAR HORA
// ======================================================

function formatearHora(hora) {

    if (!hora) {

        return "--:--";

    }

    const partes =
        hora.substring(0, 5).split(":");

    let horas =
        parseInt(partes[0]);

    const minutos =
        partes[1];

    const periodo =
        horas >= 12
            ? "PM"
            : "AM";

    horas =
        horas % 12 || 12;

    return `${horas}:${minutos} ${periodo}`;

}


// ======================================================
// REGISTRAR MARCACIÓN
// ======================================================

async function registrarMarcacion(tipo) {

    const dni =
        dniInput.value.trim();


    // ==================================================
    // VALIDAR DNI
    // ==================================================

    if (dni === "") {

        mensaje.innerHTML = `
            <div class="mensaje-grande">
                ⚠️ INGRESE SU DNI
            </div>
        `;

        programarLimpieza();

        return;

    }


    // ==================================================
    // VALIDAR 8 DÍGITOS
    // ==================================================

    if (!/^\d{8}$/.test(dni)) {

        mensaje.innerHTML = `
            <div class="mensaje-grande">
                ⚠️ COMPLETE LOS 8 DÍGITOS
            </div>
        `;

        programarLimpieza();

        return;

    }


    // ==================================================
    // DESACTIVAR BOTONES
    // ==================================================

    btnEntrada.disabled = true;

    btnSalida.disabled = true;


    mensaje.innerHTML = `
        <div class="mensaje-grande">
            📍 OBTENIENDO UBICACIÓN...
        </div>
    `;


    try {

        // ==================================================
        // OBTENER UBICACIÓN
        // ==================================================

        const ubicacion =
            await obtenerUbicacion();


        console.log(
            "Ubicación:",
            ubicacion
        );


        mensaje.innerHTML = `
            <div class="mensaje-grande">
                ⏳ REGISTRANDO...
            </div>
        `;


        // ==================================================
        // ENVIAR A SUPABASE
        // ==================================================

        const respuesta =
            await fetch(
                `${SUPABASE_URL}/rest/v1/rpc/registrar_marcacion_con_ubicacion`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "apikey":
                            SUPABASE_KEY,

                        "Authorization":
                            `Bearer ${SUPABASE_KEY}`
                    },

                    body: JSON.stringify({

                        p_dni:
                            dni,

                        p_tipo:
                            tipo,

                        p_latitud:
                            ubicacion.latitud,

                        p_longitud:
                            ubicacion.longitud,

                        p_precision:
                            ubicacion.precision

                    })
                }
            );


        const resultado =
            await respuesta.json();


        console.log(
            "Resultado:",
            resultado
        );


        // ==================================================
        // ERROR
        // ==================================================

        if (!respuesta.ok) {

            console.error(
                "Error:",
                resultado
            );

            mensaje.innerHTML = `
                <div class="mensaje-grande">
                    ❌ ERROR AL REGISTRAR
                </div>
            `;

            btnEntrada.disabled = false;
            btnSalida.disabled = false;

            programarLimpieza();

            return;

        }


        // ==================================================
        // MARCACIÓN CORRECTA
        // ==================================================

        if (resultado.ok) {


            // ==============================================
            // ENTRADA
            // ==============================================

            if (tipo === "ENTRADA") {

                const hora =
                    formatearHora(
                        resultado.hora_entrada
                    );

                const tardanza =
                    Number(
                        resultado.minutos_tardanza || 0
                    );


                if (tardanza > 0) {

                    mensaje.innerHTML = `

                        <div class="mensaje-grande mensaje-tarde">

                            🔴

                            <div>
                                ENTRADA REGISTRADA
                            </div>

                            <div class="hora-marcacion">
                                ${hora}
                            </div>

                            <div>
                                LLEGÓ TARDE
                            </div>

                            <div class="minutos-tarde">
                                ${tardanza} MINUTO${tardanza === 1 ? "" : "S"}
                            </div>

                        </div>

                    `;

                }

                else {

                    mensaje.innerHTML = `

                        <div class="mensaje-grande mensaje-tiempo">

                            🟢

                            <div>
                                ENTRADA REGISTRADA
                            </div>

                            <div class="hora-marcacion">
                                ${hora}
                            </div>

                            <div>
                                A TIEMPO
                            </div>

                        </div>

                    `;

                }

            }


            // ==============================================
            // SALIDA
            // ==============================================

            else {

                const hora =
                    formatearHora(
                        resultado.hora_salida
                    );

                const horasTrabajadas =
                    resultado.horas_trabajadas || 0;

                const horasExtras =
                    Number(
                        resultado.horas_extras || 0
                    );


                mensaje.innerHTML = `

                    <div class="mensaje-grande mensaje-salida">

                        🔵

                        <div>
                            SALIDA REGISTRADA
                        </div>

                        <div class="hora-marcacion">
                            ${hora}
                        </div>

                        <div class="detalle-horas">

                            HORAS TRABAJADAS:
                            ${horasTrabajadas}

                        </div>

                        <div class="detalle-extras">

                            ⭐ HORAS EXTRAS:
                            ${horasExtras}

                        </div>

                    </div>

                `;

            }


            // Limpiar después de 6 segundos
            programarLimpieza();

        }


        // ==================================================
        // MARCACIÓN NO PERMITIDA
        // ==================================================

        else {

            mensaje.innerHTML = `

                <div class="mensaje-grande">

                    ⚠️

                    <div>
                        ${resultado.mensaje}
                    </div>

                </div>

            `;

            btnEntrada.disabled = false;
            btnSalida.disabled = false;

            programarLimpieza();

        }

    }


    // ==================================================
    // ERROR
    // ==================================================

    catch (error) {

        console.error(error);


        if (error.code === 1) {

            mensaje.innerHTML = `

                <div class="mensaje-grande">

                    📍

                    <div>
                        DEBE PERMITIR LA UBICACIÓN
                    </div>

                    <div class="texto-pequeno">
                        Active el permiso de ubicación
                        para poder marcar.
                    </div>

                </div>

            `;

        }

        else if (error.code === 2) {

            mensaje.innerHTML = `

                <div class="mensaje-grande">

                    📍

                    <div>
                        NO SE PUDO OBTENER LA UBICACIÓN
                    </div>

                </div>

            `;

        }

        else if (error.code === 3) {

            mensaje.innerHTML = `

                <div class="mensaje-grande">

                    📍

                    <div>
                        LA UBICACIÓN TARDÓ DEMASIADO
                    </div>

                </div>

            `;

        }

        else {

            mensaje.innerHTML = `

                <div class="mensaje-grande">

                    ❌

                    <div>
                        NO SE PUDO REGISTRAR
                    </div>

                </div>

            `;

        }


        btnEntrada.disabled = false;
        btnSalida.disabled = false;

        programarLimpieza();

    }

}


// ======================================================
// BOTÓN ENTRADA
// ======================================================

btnEntrada.addEventListener(
    "click",
    function () {

        registrarMarcacion(
            "ENTRADA"
        );

    }
);


// ======================================================
// BOTÓN SALIDA
// ======================================================

btnSalida.addEventListener(
    "click",
    function () {

        registrarMarcacion(
            "SALIDA"
        );

    }
);
