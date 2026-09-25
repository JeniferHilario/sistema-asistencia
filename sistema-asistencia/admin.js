// VERIFICAR ACCESO ADMINISTRATIVO

if (sessionStorage.getItem("adminAutorizado") !== "true") {
    window.location.href = "login.html";
}
const SUPABASE_URL = "https://aoyzlskorbbloxppwmhs.supabase.co";
const SUPABASE_KEY = "sb_publishable_0zwj4FTrsrvMaosuHpuGaQ_XNiZc8Df";


// =====================================================
// VARIABLES
// =====================================================

let trabajadorEditando = null;


// =====================================================
// ELEMENTOS
// =====================================================

const formularioTrabajador =
    document.getElementById("formularioTrabajador");

const btnGuardarTrabajador =
    document.getElementById("btnGuardarTrabajador");

const listaTrabajadores =
    document.getElementById("listaTrabajadores");

const mensajeTrabajador =
    document.getElementById("mensajeTrabajador");

const trabajadorSelect =
    document.getElementById("trabajador");

const fechaInicio =
    document.getElementById("fechaInicio");

const mensaje =
    document.getElementById("mensaje");

const btnGuardar =
    document.getElementById("btnGuardar");

const tituloFormulario =
    document.getElementById("tituloFormulario");


// =====================================================
// CARGAR TRABAJADORES PARA EL HORARIO
// =====================================================

async function cargarTrabajadores() {

    try {

        const respuesta = await fetch(
            `${SUPABASE_URL}/rest/v1/rpc/listar_trabajadores`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "apikey": SUPABASE_KEY,
                    "Authorization": `Bearer ${SUPABASE_KEY}`
                },

                body: JSON.stringify({})
            }
        );

        const trabajadores =
            await respuesta.json();

        trabajadorSelect.innerHTML = `
            <option value="">
                Seleccione un trabajador
            </option>
        `;

        if (!Array.isArray(trabajadores)) {

            console.error(trabajadores);

            return;
        }

        trabajadores.forEach(trabajador => {

            const opcion =
                document.createElement("option");

            opcion.value =
                trabajador.id;

            opcion.textContent =
                `${trabajador.nombre} ${trabajador.apellidos} - DNI ${trabajador.dni}`;

            trabajadorSelect.appendChild(
                opcion
            );

        });

    } catch (error) {

        console.error(
            "Error cargando trabajadores:",
            error
        );

    }

}


// =====================================================
// CARGAR TODOS LOS TRABAJADORES
// =====================================================

async function cargarListaTrabajadores() {

    try {

        const respuesta = await fetch(
            `${SUPABASE_URL}/rest/v1/rpc/listar_todos_trabajadores`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "apikey": SUPABASE_KEY,
                    "Authorization": `Bearer ${SUPABASE_KEY}`
                },

                body: JSON.stringify({})
            }
        );

        const trabajadores =
            await respuesta.json();

        listaTrabajadores.innerHTML = "";

        if (!Array.isArray(trabajadores)) {

            listaTrabajadores.innerHTML = `
                <tr>
                    <td colspan="6">
                        No se pudieron cargar los trabajadores.
                    </td>
                </tr>
            `;

            console.error(trabajadores);

            return;
        }

        if (trabajadores.length === 0) {

            listaTrabajadores.innerHTML = `
                <tr>
                    <td colspan="6">
                        No hay trabajadores registrados.
                    </td>
                </tr>
            `;

            return;
        }

        trabajadores.forEach(trabajador => {

            const fila =
                document.createElement("tr");

            fila.innerHTML = `

                <td>
                    ${trabajador.dni}
                </td>

                <td>
                    ${trabajador.nombre}
                    ${trabajador.apellidos}
                </td>

                <td>
                    ${trabajador.area || "-"}
                </td>

                <td>
                    ${trabajador.cargo || "-"}
                </td>

                <td class="${
                    trabajador.activo
                        ? "activo"
                        : "inactivo"
                }">

                    ${
                        trabajador.activo
                            ? "Activo"
                            : "Inactivo"
                    }

                </td>

                <td>

                    <button
                        class="btn-editar"
                        onclick="editarTrabajador(
                            '${trabajador.id}',
                            '${trabajador.dni}',
                            '${trabajador.nombre}',
                            '${trabajador.apellidos}',
                            '${trabajador.area || ""}',
                            '${trabajador.cargo || ""}',
                            ${trabajador.activo}
                        )">

                        ✏️ Editar

                    </button>

                </td>

            `;

            listaTrabajadores.appendChild(
                fila
            );

        });

    } catch (error) {

        console.error(
            "Error cargando lista:",
            error
        );

    }

}


// =====================================================
// EDITAR TRABAJADOR
// =====================================================

function editarTrabajador(
    id,
    dni,
    nombre,
    apellidos,
    area,
    cargo,
    activo
) {

    trabajadorEditando = id;

    tituloFormulario.textContent =
        "Editar trabajador";

    document.getElementById(
        "nuevoDni"
    ).value = dni;

    document.getElementById(
        "nuevoNombre"
    ).value = nombre;

    document.getElementById(
        "nuevoApellidos"
    ).value = apellidos;

    document.getElementById(
        "nuevoArea"
    ).value = area;

    document.getElementById(
        "nuevoCargo"
    ).value = cargo;

    document.getElementById(
        "nuevoActivo"
    ).value =
        activo
            ? "true"
            : "false";

    btnGuardarTrabajador.textContent =
        "💾 ACTUALIZAR TRABAJADOR";

    formularioTrabajador.classList.add(
        "activo"
    );

    formularioTrabajador.scrollIntoView({
        behavior: "smooth"
    });

}


// =====================================================
// GUARDAR O ACTUALIZAR TRABAJADOR
// =====================================================

async function guardarTrabajador() {

    const dni =
        document.getElementById(
            "nuevoDni"
        ).value.trim();

    const nombre =
        document.getElementById(
            "nuevoNombre"
        ).value.trim();

    const apellidos =
        document.getElementById(
            "nuevoApellidos"
        ).value.trim();

    const area =
        document.getElementById(
            "nuevoArea"
        ).value.trim();

    const cargo =
        document.getElementById(
            "nuevoCargo"
        ).value.trim();

    const activo =
        document.getElementById(
            "nuevoActivo"
        ).value === "true";


    if (!/^\d{8}$/.test(dni)) {

        mostrarMensajeTrabajador(
            "El DNI debe tener exactamente 8 números.",
            "error"
        );

        return;
    }


    if (!nombre) {

        mostrarMensajeTrabajador(
            "Ingrese los nombres.",
            "error"
        );

        return;
    }


    if (!apellidos) {

        mostrarMensajeTrabajador(
            "Ingrese los apellidos.",
            "error"
        );

        return;
    }


    if (!area) {

        mostrarMensajeTrabajador(
            "Ingrese el área.",
            "error"
        );

        return;
    }


    if (!cargo) {

        mostrarMensajeTrabajador(
            "Ingrese el cargo.",
            "error"
        );

        return;
    }


    btnGuardarTrabajador.disabled =
        true;

    btnGuardarTrabajador.textContent =
        "GUARDANDO...";


    try {

        let respuesta;


        if (trabajadorEditando) {

            respuesta = await fetch(
                `${SUPABASE_URL}/rest/v1/rpc/actualizar_trabajador`,
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

                        p_id:
                            trabajadorEditando,

                        p_dni:
                            dni,

                        p_nombre:
                            nombre,

                        p_apellidos:
                            apellidos,

                        p_area:
                            area,

                        p_cargo:
                            cargo,

                        p_activo:
                            activo

                    })
                }
            );

        }

        else {

            respuesta = await fetch(
                `${SUPABASE_URL}/rest/v1/rpc/crear_trabajador`,
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

                        p_nombre:
                            nombre,

                        p_apellidos:
                            apellidos,

                        p_area:
                            area,

                        p_cargo:
                            cargo,

                        p_activo:
                            activo

                    })
                }
            );

        }


        const resultado =
            await respuesta.json();


        console.log(
            "Resultado:",
            resultado
        );


        if (!respuesta.ok) {

            mostrarMensajeTrabajador(
                "Error de conexión con Supabase.",
                "error"
            );

            console.error(resultado);

            return;
        }


        if (!resultado.ok) {

            mostrarMensajeTrabajador(
                resultado.mensaje ||
                "No se pudo guardar.",
                "error"
            );

            return;
        }


        mostrarMensajeTrabajador(
            trabajadorEditando
                ? "Trabajador actualizado correctamente."
                : "Trabajador registrado correctamente.",
            "success"
        );


        limpiarFormularioTrabajador();


        await cargarListaTrabajadores();

        await cargarTrabajadores();


        setTimeout(() => {

            formularioTrabajador.classList.remove(
                "activo"
            );

            mensajeTrabajador.innerHTML = "";

        }, 1200);


    } catch (error) {

        console.error(error);

        mostrarMensajeTrabajador(
            "Ocurrió un error.",
            "error"
        );

    } finally {

        btnGuardarTrabajador.disabled =
            false;

        btnGuardarTrabajador.textContent =
            "💾 GUARDAR TRABAJADOR";

    }

}


// =====================================================
// LIMPIAR FORMULARIO
// =====================================================

function limpiarFormularioTrabajador() {

    trabajadorEditando = null;

    tituloFormulario.textContent =
        "Nuevo trabajador";

    document.getElementById(
        "nuevoDni"
    ).value = "";

    document.getElementById(
        "nuevoNombre"
    ).value = "";

    document.getElementById(
        "nuevoApellidos"
    ).value = "";

    document.getElementById(
        "nuevoArea"
    ).value = "";

    document.getElementById(
        "nuevoCargo"
    ).value = "";

    document.getElementById(
        "nuevoActivo"
    ).value = "true";

}


// =====================================================
// MENSAJES
// =====================================================

function mostrarMensajeTrabajador(
    texto,
    tipo
) {

    mensajeTrabajador.textContent =
        texto;

    mensajeTrabajador.style.padding =
        "10px";

    mensajeTrabajador.style.marginTop =
        "10px";

    mensajeTrabajador.style.borderRadius =
        "7px";

    if (tipo === "success") {

        mensajeTrabajador.style.background =
            "#d4edda";

        mensajeTrabajador.style.color =
            "#155724";

    }

    else {

        mensajeTrabajador.style.background =
            "#f8d7da";

        mensajeTrabajador.style.color =
            "#721c24";

    }

}


// =====================================================
// FECHA
// =====================================================

function obtenerFechaPorDia(
    fechaBase,
    numeroDia
) {

    const fecha =
        new Date(
            fechaBase + "T00:00:00"
        );

    fecha.setDate(
        fecha.getDate() + numeroDia
    );

    const año =
        fecha.getFullYear();

    const mes =
        String(
            fecha.getMonth() + 1
        ).padStart(2, "0");

    const dia =
        String(
            fecha.getDate()
        ).padStart(2, "0");

    return `${año}-${mes}-${dia}`;

}


// =====================================================
// GUARDAR HORARIO
// =====================================================

async function guardarHorario() {

    const trabajadorId =
        trabajadorSelect.value;

    const fecha =
        fechaInicio.value;


    if (!trabajadorId) {

        mensaje.textContent =
            "Seleccione un trabajador.";

        mensaje.style.background =
            "#f8d7da";

        return;
    }


    if (!fecha) {

        mensaje.textContent =
            "Seleccione la fecha de inicio.";

        mensaje.style.background =
            "#f8d7da";

        return;
    }


    const dias = [

        {
            id: "lunes",
            dia: 0
        },

        {
            id: "martes",
            dia: 1
        },

        {
            id: "miercoles",
            dia: 2
        },

        {
            id: "jueves",
            dia: 3
        },

        {
            id: "viernes",
            dia: 4
        },

        {
            id: "sabado",
            dia: 5
        },

        {
            id: "domingo",
            dia: 6
        }

    ];


    const horarios =
        dias.map(dia => {

            const entrada =
                document.getElementById(
                    `${dia.id}Entrada`
                ).value;

            const salida =
                document.getElementById(
                    `${dia.id}Salida`
                ).value;

            const descanso =
                document.getElementById(
                    `${dia.id}Descanso`
                ).checked;


            return {

                dia:
                    dia.dia,

                hora_entrada:
                    descanso
                        ? ""
                        : entrada,

                hora_salida:
                    descanso
                        ? ""
                        : salida,

                descanso:
                    descanso

            };

        });


    try {

        const respuesta =
            await fetch(
                `${SUPABASE_URL}/rest/v1/rpc/guardar_horario_semanal`,
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

                        p_trabajador_id:
                            trabajadorId,

                        p_fecha_inicio:
                            fecha,

                        p_horarios:
                            horarios

                    })
                }
            );


        const resultado =
            await respuesta.json();


        console.log(
            "Resultado horario:",
            resultado
        );


        if (!respuesta.ok) {

            mensaje.textContent =
                "Error al guardar el horario.";

            mensaje.style.background =
                "#f8d7da";

            return;
        }


        if (!resultado.ok) {

            mensaje.textContent =
                resultado.mensaje ||
                "No se pudo guardar.";

            mensaje.style.background =
                "#f8d7da";

            return;
        }


        mensaje.textContent =
            "Horario semanal guardado correctamente.";

        mensaje.style.background =
            "#d4edda";

        mensaje.style.color =
            "#155724";


    } catch (error) {

        console.error(error);

        mensaje.textContent =
            "Error de conexión con Supabase.";

        mensaje.style.background =
            "#f8d7da";

    }

}


// =====================================================
// CARGAR HORARIO EXISTENTE
// =====================================================

async function cargarHorarioExistente() {

    const trabajadorId =
        trabajadorSelect.value;

    const fecha =
        fechaInicio.value;


    if (!trabajadorId || !fecha) {
        return;
    }


    mensaje.textContent =
        "Cargando horario...";


    try {

        const respuesta =
            await fetch(
                `${SUPABASE_URL}/rest/v1/rpc/obtener_horario_semanal`,
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

                        p_trabajador_id:
                            trabajadorId,

                        p_fecha_inicio:
                            fecha

                    })
                }
            );


        const resultado =
            await respuesta.json();


        console.log(
            "Horario encontrado:",
            resultado
        );


        if (!respuesta.ok) {

            console.error(resultado);

            mensaje.textContent =
                "No se pudo cargar el horario.";

            return;
        }


        if (!resultado.ok) {

            mensaje.textContent =
                resultado.mensaje ||
                "No hay horario guardado.";

            return;
        }


        // LIMPIAR CAMPOS ANTES DE CARGAR

        limpiarHorarios();


        const horarios =
            resultado.horarios || [];


        horarios.forEach(dia => {

            const numeroDia =
                Number(dia.dia);


            const nombres = [

                "lunes",
                "martes",
                "miercoles",
                "jueves",
                "viernes",
                "sabado",
                "domingo"

            ];


            const nombreDia =
                nombres[numeroDia];


            if (!nombreDia) {
                return;
            }


            const entrada =
                document.getElementById(
                    `${nombreDia}Entrada`
                );

            const salida =
                document.getElementById(
                    `${nombreDia}Salida`
                );

            const descanso =
                document.getElementById(
                    `${nombreDia}Descanso`
                );


            if (entrada) {

                entrada.value =
                    dia.hora_entrada || "";

            }


            if (salida) {

                salida.value =
                    dia.hora_salida || "";

            }


            if (descanso) {

                descanso.checked =
                    dia.descanso === true;

            }

        });


        mensaje.textContent =
            "✅ Horario cargado correctamente.";

        mensaje.style.background =
            "#d4edda";

        mensaje.style.color =
            "#155724";


    } catch (error) {

        console.error(error);

        mensaje.textContent =
            "Error de conexión con Supabase.";

        mensaje.style.background =
            "#f8d7da";

    }

}


// =====================================================
// LIMPIAR HORARIOS
// =====================================================

function limpiarHorarios() {

    const dias = [

        "lunes",
        "martes",
        "miercoles",
        "jueves",
        "viernes",
        "sabado",
        "domingo"

    ];


    dias.forEach(dia => {

        const entrada =
            document.getElementById(
                `${dia}Entrada`
            );

        const salida =
            document.getElementById(
                `${dia}Salida`
            );

        const descanso =
            document.getElementById(
                `${dia}Descanso`
            );


        if (entrada) {
            entrada.value = "";
        }


        if (salida) {
            salida.value = "";
        }


        if (descanso) {
            descanso.checked = false;
        }

    });

}


// =====================================================
// EVENTOS
// =====================================================

btnGuardarTrabajador.addEventListener(
    "click",
    guardarTrabajador
);


btnGuardar.addEventListener(
    "click",
    guardarHorario
);


// NUEVO: CARGAR HORARIO AL CAMBIAR TRABAJADOR

trabajadorSelect.addEventListener(
    "change",
    cargarHorarioExistente
);


// NUEVO: CARGAR HORARIO AL CAMBIAR FECHA

fechaInicio.addEventListener(
    "change",
    cargarHorarioExistente
);


// =====================================================
// INICIO
// =====================================================

cargarTrabajadores();

cargarListaTrabajadores();
