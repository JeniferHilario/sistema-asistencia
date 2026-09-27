// ==========================================
// PROTECCIÓN DE ACCESO
// ==========================================

if (sessionStorage.getItem("adminAutorizado") !== "true") {
    window.location.href = "login.html";
}


// ==========================================
// SUPABASE
// ==========================================

const SUPABASE_URL = "https://aoyzlskorbbloxppwmhs.supabase.co";
const SUPABASE_KEY = "sb_publishable_0zwj4FTrsrvMaosuHpuGaQ_XNiZc8Df";


// ==========================================
// ELEMENTOS
// ==========================================

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


// ==========================================
// LLAMAR SUPABASE
// ==========================================

async function llamarSupabase(
    nombreFuncion,
    parametros = {}
) {

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

        const errorTexto =
            await respuesta.text();

        console.error(
            "Error Supabase:",
            errorTexto
        );

        throw new Error(errorTexto);
    }

    return await respuesta.json();
}


// ==========================================
// CARGAR TRABAJADORES
// ==========================================

async function cargarTrabajadores() {

    if (!trabajadorSelect) return;

    try {

        const trabajadores =
            await llamarSupabase(
                "listar_trabajadores"
            );

        trabajadorSelect.innerHTML = `
            <option value="">
                Seleccione un trabajador
            </option>
        `;

        trabajadores.forEach(
            function (trabajador) {

                const opcion =
                    document.createElement("option");

                opcion.value =
                    trabajador.id;

                opcion.textContent =
                    `${trabajador.dni} - ${trabajador.nombre} ${trabajador.apellidos}`;

                trabajadorSelect.appendChild(
                    opcion
                );
            }
        );

    } catch (error) {

        console.error(
            "Error cargando trabajadores:",
            error
        );
    }
}


// ==========================================
// CARGAR LISTA DE TRABAJADORES
// ==========================================

async function cargarListaTrabajadores() {

    if (!listaTrabajadores) return;

    try {

        const trabajadores =
            await llamarSupabase(
                "listar_todos_trabajadores"
            );

        listaTrabajadores.innerHTML = "";

        if (
            !trabajadores ||
            trabajadores.length === 0
        ) {

            listaTrabajadores.innerHTML = `
                <tr>
                    <td colspan="6">
                        No hay trabajadores registrados.
                    </td>
                </tr>
            `;

            return;
        }

        trabajadores.forEach(
            function (trabajador) {

                const fila =
                    document.createElement("tr");

                fila.innerHTML = `
                    <td>
                        ${trabajador.dni || ""}
                    </td>

                    <td>
                        ${trabajador.nombre || ""}
                        ${trabajador.apellidos || ""}
                    </td>

                    <td>
                        ${trabajador.area || ""}
                    </td>

                    <td>
                        ${trabajador.cargo || ""}
                    </td>

                    <td>
                        ${
                            trabajador.activo
                                ? "Activo"
                                : "Inactivo"
                        }
                    </td>

                    <td>
                        <button
                            type="button"
                            class="btn-editar"
                            onclick="editarTrabajador(
                                '${trabajador.id}',
                                '${trabajador.dni || ""}',
                                '${trabajador.nombre || ""}',
                                '${trabajador.apellidos || ""}',
                                '${trabajador.area || ""}',
                                '${trabajador.cargo || ""}',
                                ${trabajador.activo}
                            )"
                        >
                            EDITAR
                        </button>
                    </td>
                `;

                listaTrabajadores.appendChild(
                    fila
                );
            }
        );

    } catch (error) {

        console.error(
            "Error cargando lista:",
            error
        );

        listaTrabajadores.innerHTML = `
            <tr>
                <td colspan="6">
                    Error al cargar trabajadores.
                </td>
            </tr>
        `;
    }
}


// ==========================================
// EDITAR TRABAJADOR
// ==========================================

function editarTrabajador(
    id,
    dni,
    nombre,
    apellidos,
    area,
    cargo,
    activo
) {

    if (!formularioTrabajador) return;

    formularioTrabajador.dataset.id = id;

    const campoDni =
        document.getElementById("nuevoDni");

    const campoNombre =
        document.getElementById("nuevoNombre");

    const campoApellidos =
        document.getElementById("nuevoApellidos");

    const campoArea =
        document.getElementById("nuevoArea");

    const campoCargo =
        document.getElementById("nuevoCargo");

    const campoActivo =
        document.getElementById("nuevoActivo");

    if (campoDni) {
        campoDni.value = dni;
    }

    if (campoNombre) {
        campoNombre.value = nombre;
    }

    if (campoApellidos) {
        campoApellidos.value = apellidos;
    }

    if (campoArea) {
        campoArea.value = area;
    }

    if (campoCargo) {
        campoCargo.value = cargo;
    }

    if (campoActivo) {
        campoActivo.value =
            activo ? "true" : "false";
    }

    if (tituloFormulario) {
        tituloFormulario.textContent =
            "Editar trabajador";
    }

    if (btnGuardarTrabajador) {
        btnGuardarTrabajador.textContent =
            "ACTUALIZAR TRABAJADOR";
    }
}


// ==========================================
// GUARDAR TRABAJADOR
// ==========================================

async function guardarTrabajador() {

    const campoDni =
        document.getElementById("nuevoDni");

    const campoNombre =
        document.getElementById("nuevoNombre");

    const campoApellidos =
        document.getElementById("nuevoApellidos");

    const campoArea =
        document.getElementById("nuevoArea");

    const campoCargo =
        document.getElementById("nuevoCargo");

    const campoActivo =
        document.getElementById("nuevoActivo");

    const dni =
        campoDni?.value.trim() || "";

    const nombre =
        campoNombre?.value.trim() || "";

    const apellidos =
        campoApellidos?.value.trim() || "";

    const area =
        campoArea?.value.trim() || "";

    const cargo =
        campoCargo?.value.trim() || "";

    const activo =
        campoActivo
            ? campoActivo.value === "true"
            : true;

    if (
        !dni ||
        !nombre ||
        !apellidos
    ) {

        mostrarMensajeTrabajador(
            "Complete DNI, nombre y apellidos.",
            "red"
        );

        return;
    }

    if (!/^\d{8}$/.test(dni)) {

        mostrarMensajeTrabajador(
            "El DNI debe tener exactamente 8 dígitos.",
            "red"
        );

        return;
    }

    try {

        const id =
            formularioTrabajador?.dataset.id;

        let resultado;

        if (id) {

            resultado =
                await llamarSupabase(
                    "actualizar_trabajador",
                    {
                        p_id: id,
                        p_dni: dni,
                        p_nombre: nombre,
                        p_apellidos: apellidos,
                        p_area: area,
                        p_cargo: cargo,
                        p_activo: activo
                    }
                );

        } else {

            resultado =
                await llamarSupabase(
                    "crear_trabajador",
                    {
                        p_dni: dni,
                        p_nombre: nombre,
                        p_apellidos: apellidos,
                        p_area: area,
                        p_cargo: cargo,
                        p_activo: activo
                    }
                );
        }

        console.log(
            "Resultado:",
            resultado
        );

        mostrarMensajeTrabajador(
            id
                ? "Trabajador actualizado correctamente."
                : "Trabajador registrado correctamente.",
            "green"
        );

        limpiarFormularioTrabajador();

        await cargarTrabajadores();

        await cargarListaTrabajadores();

    } catch (error) {

        console.error(
            "Error guardando trabajador:",
            error
        );

        mostrarMensajeTrabajador(
            "No se pudo guardar el trabajador.",
            "red"
        );
    }
}


// ==========================================
// LIMPIAR FORMULARIO TRABAJADOR
// ==========================================

function limpiarFormularioTrabajador() {

    const campoDni =
        document.getElementById("nuevoDni");

    const campoNombre =
        document.getElementById("nuevoNombre");

    const campoApellidos =
        document.getElementById("nuevoApellidos");

    const campoArea =
        document.getElementById("nuevoArea");

    const campoCargo =
        document.getElementById("nuevoCargo");

    const campoActivo =
        document.getElementById("nuevoActivo");

    if (campoDni) {
        campoDni.value = "";
    }

    if (campoNombre) {
        campoNombre.value = "";
    }

    if (campoApellidos) {
        campoApellidos.value = "";
    }

    if (campoArea) {
        campoArea.value = "";
    }

    if (campoCargo) {
        campoCargo.value = "";
    }

    if (campoActivo) {
        campoActivo.value = "true";
    }

    if (formularioTrabajador) {
        delete formularioTrabajador.dataset.id;
    }

    if (tituloFormulario) {
        tituloFormulario.textContent =
            "Nuevo trabajador";
    }

    if (btnGuardarTrabajador) {
        btnGuardarTrabajador.textContent =
            "GUARDAR TRABAJADOR";
    }
}


// ==========================================
// MENSAJE TRABAJADOR
// ==========================================

function mostrarMensajeTrabajador(
    texto,
    color
) {

    if (!mensajeTrabajador) return;

    mensajeTrabajador.textContent =
        texto;

    mensajeTrabajador.style.color =
        color;

    mensajeTrabajador.style.background =
        color === "green"
            ? "#d4edda"
            : "#f8d7da";
}


// ==========================================
// GUARDAR HORARIO
// ==========================================

async function guardarHorario() {

    if (
        !trabajadorSelect ||
        !fechaInicio
    ) return;

    const trabajadorId =
        trabajadorSelect.value;

    const fechaBase =
        fechaInicio.value;

    if (!trabajadorId) {

        if (mensaje) {

            mensaje.textContent =
                "Seleccione un trabajador.";

            mensaje.style.color =
                "red";
        }

        return;
    }

    if (!fechaBase) {

        if (mensaje) {

            mensaje.textContent =
                "Seleccione la fecha de inicio.";

            mensaje.style.color =
                "red";
        }

        return;
    }

    try {

        const dias = [
            "lunes",
            "martes",
            "miercoles",
            "jueves",
            "viernes",
            "sabado",
            "domingo"
        ];

        const horarios = [];

        dias.forEach(
            function (dia, indice) {

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

                const horaEntrada =
                    entrada?.value || "";

                const horaSalida =
                    salida?.value || "";


                // ==========================================
                // CORRECCIÓN IMPORTANTE
                // ==========================================
                //
                // Si existen entrada y salida,
                // automáticamente NO es descanso.
                //
                // Solo será descanso si:
                // - No hay hora de entrada
                // - No hay hora de salida
                // - El checkbox está marcado
                // ==========================================

                const tieneHorario =
                    horaEntrada !== "" &&
                    horaSalida !== "";

                const esDescanso =
                    !tieneHorario &&
                    descanso?.checked === true;


                horarios.push({

                    dia: indice,

                    hora_entrada:
                        esDescanso
                            ? ""
                            : horaEntrada,

                    hora_salida:
                        esDescanso
                            ? ""
                            : horaSalida,

                    descanso:
                        esDescanso
                });

            }
        );


        console.log(
            "HORARIOS QUE SE ENVIARÁN:",
            horarios
        );


        const resultado =
            await llamarSupabase(
                "guardar_horario_semanal",
                {
                    p_trabajador_id:
                        trabajadorId,

                    p_fecha_inicio:
                        fechaBase,

                    p_horarios:
                        horarios
                }
            );


        console.log(
            "RESPUESTA DE SUPABASE:",
            resultado
        );


        if (
            !resultado ||
            resultado.ok !== true
        ) {

            throw new Error(
                resultado?.mensaje ||
                "No se pudo guardar el horario."
            );
        }


        if (mensaje) {

            mensaje.textContent =
                "Horario semanal guardado correctamente.";

            mensaje.style.color =
                "green";

            mensaje.style.background =
                "#d4edda";
        }


    } catch (error) {

        console.error(
            "Error guardando horario:",
            error
        );

        if (mensaje) {

            mensaje.textContent =
                "No se pudo guardar el horario.";

            mensaje.style.color =
                "red";

            mensaje.style.background =
                "#f8d7da";
        }
    }
}


// ==========================================
// CARGAR HORARIO EXISTENTE
// ==========================================

async function cargarHorarioExistente() {

    if (
        !trabajadorSelect ||
        !fechaInicio
    ) return;

    const trabajadorId =
        trabajadorSelect.value;

    const fechaBase =
        fechaInicio.value;

    if (
        !trabajadorId ||
        !fechaBase
    ) return;

    try {

        const resultado =
            await llamarSupabase(
                "obtener_horario_semanal",
                {
                    p_trabajador_id:
                        trabajadorId,

                    p_fecha_inicio:
                        fechaBase
                }
            );

        console.log(
            "Horario existente:",
            resultado
        );

        if (!resultado) return;

        const dias = [
            "lunes",
            "martes",
            "miercoles",
            "jueves",
            "viernes",
            "sabado",
            "domingo"
        ];

        dias.forEach(
            function (dia) {

                const horario =
                    resultado[dia];

                if (!horario) return;

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

                    entrada.value =
                        horario.hora_entrada || "";
                }

                if (salida) {

                    salida.value =
                        horario.hora_salida || "";
                }

                if (descanso) {

                    descanso.checked =
                        horario.descanso === true;
                }
            }
        );

    } catch (error) {

        console.error(
            "Error cargando horario:",
            error
        );
    }
}


// ==========================================
// LIMPIAR HORARIOS
// ==========================================

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

    dias.forEach(
        function (dia) {

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
        }
    );
}


// ==========================================
// EVENTOS
// ==========================================

if (btnGuardarTrabajador) {

    btnGuardarTrabajador.addEventListener(
        "click",
        guardarTrabajador
    );
}


if (btnGuardar) {

    btnGuardar.addEventListener(
        "click",
        guardarHorario
    );
}


if (trabajadorSelect) {

    trabajadorSelect.addEventListener(
        "change",
        function () {

            limpiarHorarios();

            cargarHorarioExistente();
        }
    );
}


if (fechaInicio) {

    fechaInicio.addEventListener(
        "change",
        function () {

            limpiarHorarios();

            cargarHorarioExistente();
        }
    );
}


// ==========================================
// INICIAR
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        cargarTrabajadores();

        cargarListaTrabajadores();

    }
);
