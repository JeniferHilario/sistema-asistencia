// ==========================================
// CONFIGURACIÓN SUPABASE
// ==========================================

const SUPABASE_URL = "https://aoyzlskorbbloxppwmhs.supabase.co";

const SUPABASE_KEY = "sb_publishable_0zwj4FTrsrvMaosuHpuGaQ_XNiZc8Df";


// ==========================================
// ELEMENTOS
// ==========================================

const dniInput = document.getElementById("dni");

const btnEntrada = document.getElementById("btnEntrada");
const btnSalida = document.getElementById("btnSalida");

const btnBorrar = document.getElementById("btnBorrar");
const btnLimpiar = document.getElementById("btnLimpiar");

const trabajadorInfo = document.getElementById("trabajadorInfo");

const mensaje = document.getElementById("mensaje");

const reloj = document.getElementById("reloj");
const fecha = document.getElementById("fecha");


// ==========================================
// FUNCIÓN PARA LLAMAR SUPABASE
// ==========================================

async function llamarSupabase(nombreFuncion, parametros) {

    const respuesta = await fetch(
        `${SUPABASE_URL}/rest/v1/rpc/${nombreFuncion}`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "apikey": SUPABASE_KEY,
                "Authorization": `Bearer ${SUPABASE_KEY}`
            },

            body: JSON.stringify(parametros)
        }
    );

    if (!respuesta.ok) {

        const errorTexto = await respuesta.text();

        throw new Error(errorTexto);
    }

    return await respuesta.json();
}


// ==========================================
// TECLADO
// ==========================================

function agregarNumero(numero) {

    if (dniInput.value.length >= 8) {
        return;
    }

    dniInput.value += numero;

    if (dniInput.value.length === 8) {
        buscarTrabajador();
    }
}


function borrarNumero() {

    dniInput.value = dniInput.value.slice(0, -1);

    trabajadorInfo.innerHTML = "";
    mensaje.innerHTML = "";
}


function limpiarDni() {

    dniInput.value = "";

    trabajadorInfo.innerHTML = "";

    mensaje.innerHTML = "";
}


// ==========================================
// BOTÓN BORRAR
// ==========================================

if (btnBorrar) {

    btnBorrar.addEventListener("click", function () {

        borrarNumero();

    });

}


// ==========================================
// BOTÓN LIMPIAR
// ==========================================

if (btnLimpiar) {

    btnLimpiar.addEventListener("click", function () {

        limpiarDni();

    });

}


// ==========================================
// BOTONES NUMÉRICOS
// ==========================================

document.querySelectorAll(".numero").forEach(function (boton) {

    boton.addEventListener("click", function () {

        const numero = boton.dataset.numero;

        agregarNumero(numero);

    });

});


// ==========================================
// BUSCAR TRABAJADOR
// ==========================================

async function buscarTrabajador() {

    const dni = dniInput.value.trim();

    if (dni.length !== 8) {
        return;
    }

    trabajadorInfo.innerHTML = "Buscando trabajador...";

    try {

        const resultado = await llamarSupabase(
            "consultar_trabajador",
            {
                p_dni: dni
            }
        );


        // ----------------------------------
        // VALIDAR RESULTADO
        // ----------------------------------

        if (!resultado) {

            trabajadorInfo.innerHTML =
                "Trabajador no encontrado.";

            return;
        }


        if (resultado.ok === false) {

            trabajadorInfo.innerHTML =
                resultado.mensaje || "Trabajador no encontrado.";

            return;
        }


        // ----------------------------------
        // OBTENER DATOS
        // ----------------------------------

        const nombre =
            resultado.nombre ||
            "";

        const apellidos =
            resultado.apellidos ||
            "";

        const dniTrabajador =
            resultado.dni ||
            dni;

        const area =
            resultado.area ||
            "No registrado";

        const cargo =
            resultado.cargo ||
            "No registrado";

        const horaEntrada =
            resultado.hora_entrada ||
            "No registrado";

        const horaSalida =
            resultado.hora_salida ||
            "No registrado";


        // ----------------------------------
        // MOSTRAR DATOS
        // SIN EMOJIS
        // TODO AL MISMO TAMAÑO
        // TODO ALINEADO A LA IZQUIERDA
        // ----------------------------------

        trabajadorInfo.innerHTML = `

            <div>Nombre: ${nombre} ${apellidos}</div>

            <div>DNI: ${dniTrabajador}</div>

            <div>Área: ${area}</div>

            <div>Cargo: ${cargo}</div>

            <div>Horario: ${horaEntrada} - ${horaSalida}</div>

        `;


    } catch (error) {

        console.error(error);

        trabajadorInfo.innerHTML =
            "No se pudo consultar al trabajador.";

    }

}


// ==========================================
// OBTENER UBICACIÓN
// ==========================================

function obtenerUbicacion() {

    return new Promise(function (resolve, reject) {

        if (!navigator.geolocation) {

            reject(
                new Error(
                    "Este dispositivo no permite obtener ubicación."
                )
            );

            return;
        }


        navigator.geolocation.getCurrentPosition(

            function (position) {

                resolve({

                    latitud: position.coords.latitude,

                    longitud: position.coords.longitude,

                    precision: position.coords.accuracy

                });

            },

            function (error) {

                reject(error);

            },

            {
                enableHighAccuracy: true,

                timeout: 10000,

                maximumAge: 0

            }

        );

    });

}


// ==========================================
// REGISTRAR MARCACIÓN
// ==========================================

async function registrarMarcacion(tipo) {

    const dni = dniInput.value.trim();


    if (dni.length !== 8) {

        mensaje.innerHTML =
            "Ingrese un DNI válido de 8 dígitos.";

        return;

    }


    mensaje.innerHTML =
        "Obteniendo ubicación...";


    try {

        const ubicacion = await obtenerUbicacion();


        mensaje.innerHTML =
            "Registrando marcación...";


        const resultado = await llamarSupabase(
            "registrar_marcacion_con_ubicacion",
            {
                p_dni: dni,

                p_tipo: tipo,

                p_latitud: ubicacion.latitud,

                p_longitud: ubicacion.longitud,

                p_precision: ubicacion.precision
            }
        );


        // ----------------------------------
        // ERROR
        // ----------------------------------

        if (!resultado || resultado.ok === false) {

            mensaje.innerHTML =
                resultado?.mensaje ||
                "No se pudo registrar la marcación.";

            return;
        }


        // ----------------------------------
        // ENTRADA
        // ----------------------------------

        if (tipo === "ENTRADA") {

            if (
                resultado.minutos_tardanza &&
                resultado.minutos_tardanza > 0
            ) {

                mensaje.innerHTML =
                    `Entrada registrada. Tardanza: ${resultado.minutos_tardanza} minutos.`;

            } else {

                mensaje.innerHTML =
                    "Entrada registrada correctamente.";

            }

        }


        // ----------------------------------
        // SALIDA
        // ----------------------------------

        if (tipo === "SALIDA") {

            let texto =
                "Salida registrada correctamente.";

            if (resultado.horas_trabajadas) {

                texto +=
                    ` Horas trabajadas: ${resultado.horas_trabajadas}.`;

            }

            if (
                resultado.horas_extras &&
                resultado.horas_extras > 0
            ) {

                texto +=
                    ` Horas extras: ${resultado.horas_extras}.`;

            }

            mensaje.innerHTML = texto;

        }


        // ----------------------------------
        // LIMPIAR DESPUÉS DE 6 SEGUNDOS
        // ----------------------------------

        setTimeout(function () {

            limpiarDni();

        }, 6000);


    } catch (error) {

        console.error(error);

        mensaje.innerHTML =
            "No se pudo obtener la ubicación. Active el GPS.";

    }

}


// ==========================================
// BOTÓN ENTRADA
// ==========================================

if (btnEntrada) {

    btnEntrada.addEventListener(
        "click",
        function () {

            registrarMarcacion("ENTRADA");

        }
    );

}


// ==========================================
// BOTÓN SALIDA
// ==========================================

if (btnSalida) {

    btnSalida.addEventListener(
        "click",
        function () {

            registrarMarcacion("SALIDA");

        }
    );

}


// ==========================================
// RELOJ
// ==========================================

function actualizarReloj() {

    const ahora = new Date();

    const horas =
        String(ahora.getHours()).padStart(2, "0");

    const minutos =
        String(ahora.getMinutes()).padStart(2, "0");

    const segundos =
        String(ahora.getSeconds()).padStart(2, "0");


    if (reloj) {

        reloj.textContent =
            `${horas}:${minutos}:${segundos}`;

    }


    if (fecha) {

        fecha.textContent =
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

}


actualizarReloj();

setInterval(
    actualizarReloj,
    1000
);
