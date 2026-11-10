// ======================================================
// PROTECCIÓN DE ACCESO
// ======================================================

if (sessionStorage.getItem("adminAutorizado") !== "true") {
    window.location.href = "login.html";
}


// ======================================================
// SUPABASE
// ======================================================

const SUPABASE_URL = "https://aoyzlskorbbloxppwmhs.supabase.co";
const SUPABASE_KEY = "sb_publishable_0zwj4FTrsrvMaosuHpuGaQ_XNiZc8Df";


// ======================================================
// VARIABLES GLOBALES
// ======================================================

let reporteActual = [];


// ======================================================
// LLAMAR A SUPABASE
// ======================================================

async function llamarSupabase(nombreFuncion, parametros = {}) {

    try {

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

        const texto = await respuesta.text();

        if (!respuesta.ok) {

            console.error(
                `Error RPC ${nombreFuncion}:`,
                texto
            );

            throw new Error(
                texto || `Error ejecutando ${nombreFuncion}`
            );
        }

        if (!texto) {
            return null;
        }

        return JSON.parse(texto);

    } catch (error) {

        console.error(
            `Error en ${nombreFuncion}:`,
            error
        );

        throw error;
    }
}


// ======================================================
// ELEMENTOS
// ======================================================

let formularioTrabajador;
let btnGuardarTrabajador;
let listaTrabajadores;
let mensajeTrabajador;

let trabajadorSelect;
let fechaInicio;
let mensaje;
let btnGuardar;

let tituloFormulario;


// ======================================================
// INICIALIZAR ELEMENTOS
// ======================================================

function inicializarElementos() {

    formularioTrabajador =
        document.getElementById("formularioTrabajador");

    btnGuardarTrabajador =
        document.getElementById("btnGuardarTrabajador");

    listaTrabajadores =
        document.getElementById("listaTrabajadores");

    mensajeTrabajador =
        document.getElementById("mensajeTrabajador");

    trabajadorSelect =
        document.getElementById("trabajador");

    fechaInicio =
        document.getElementById("fechaInicio");

    mensaje =
        document.getElementById("mensaje");

    btnGuardar =
        document.getElementById("btnGuardar");

    tituloFormulario =
        document.getElementById("tituloFormulario");
}


// ======================================================
// MENSAJE TRABAJADOR
// ======================================================

function mostrarMensajeTrabajador(texto, tipo = "red") {

    if (!mensajeTrabajador) return;

    mensajeTrabajador.textContent = texto;

    if (tipo === "green") {

        mensajeTrabajador.style.color = "#155724";
        mensajeTrabajador.style.background = "#d4edda";

    } else {

        mensajeTrabajador.style.color = "#721c24";
        mensajeTrabajador.style.background = "#f8d7da";
    }
}

// ======================================================
// CARGAR TRABAJADORES EN SELECT DE HORARIOS
// ======================================================

async function cargarTrabajadores() {

    if (!trabajadorSelect) {
        return;
    }


    try {

        console.log(
            "Cargando trabajadores para horarios..."
        );


        // Usamos la misma función que ya sabemos
        // que devuelve correctamente los trabajadores.

        const trabajadores =
            await llamarSupabase(
                "listar_todos_trabajadores"
            );


        trabajadorSelect.innerHTML = `
            <option value="">
                Seleccione un trabajador
            </option>
        `;


        if (
            !Array.isArray(trabajadores) ||
            trabajadores.length === 0
        ) {

            console.warn(
                "No se encontraron trabajadores."
            );

            return;
        }


        trabajadores.forEach(
            function(trabajador) {

                const opcion =
                    document.createElement(
                        "option"
                    );


                opcion.value =
                    trabajador.id;


                opcion.textContent =
                    `${trabajador.dni} - ${
                        trabajador.nombre || ""
                    } ${
                        trabajador.apellidos || ""
                    }`;


                trabajadorSelect.appendChild(
                    opcion
                );

            }
        );


        console.log(
            "TRABAJADORES CARGADOS EN HORARIOS:",
            trabajadores.length
        );


    } catch (error) {

        console.error(
            "Error cargando trabajadores:",
            error
        );

        trabajadorSelect.innerHTML = `
            <option value="">
                Error al cargar trabajadores
            </option>
        `;
    }
}

// ======================================================
// CARGAR TABLA DE TRABAJADORES
// ======================================================

async function cargarListaTrabajadores() {

    const lista =
        document.getElementById("listaTrabajadores");

    if (!lista) {
        console.warn(
            "No existe listaTrabajadores"
        );
        return;
    }

    lista.innerHTML = `
        <tr>
            <td colspan="7">
                Cargando trabajadores...
            </td>
        </tr>
    `;

    try {

        console.log(
            "Consultando trabajadores..."
        );

        const respuesta =
            await llamarSupabase(
                "listar_todos_trabajadores"
            );

        console.log(
            "RESPUESTA TRABAJADORES:",
            respuesta
        );


        // ==================================================
        // NORMALIZAR RESPUESTA
        // ==================================================

        let trabajadores = [];


        if (Array.isArray(respuesta)) {

            trabajadores = respuesta;

        }
        else if (
            respuesta &&
            Array.isArray(respuesta.trabajadores)
        ) {

            trabajadores =
                respuesta.trabajadores;

        }
        else if (
            respuesta &&
            Array.isArray(respuesta.data)
        ) {

            trabajadores =
                respuesta.data;

        }
        else if (
            respuesta &&
            Array.isArray(respuesta.resultado)
        ) {

            trabajadores =
                respuesta.resultado;
        }


        console.log(
            "TRABAJADORES NORMALIZADOS:",
            trabajadores
        );


        lista.innerHTML = "";


        if (
            trabajadores.length === 0
        ) {

            lista.innerHTML = `
                <tr>
                    <td colspan="7">
                        No hay trabajadores registrados.
                    </td>
                </tr>
            `;

            return;
        }


        // ==================================================
        // MOSTRAR TRABAJADORES
        // ==================================================

        trabajadores.forEach(
            function(trabajador) {

                const fila =
                    document.createElement("tr");


                fila.innerHTML = `
                    <td>
                        ${trabajador.dni || ""}
                    </td>

                    <td>
                        ${trabajador.nombre || ""}
                    </td>

                    <td>
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
                            trabajador.activo === false
                                ? "Inactivo"
                                : "Activo"
                        }
                    </td>

                    <td>

                        <button
                            type="button"
                            class="btn-editar"
                            onclick="editarTrabajador('${trabajador.id}')">

                            ✏️ Editar

                        </button>

                    </td>
                `;


                lista.appendChild(fila);

            }
        );


        console.log(
            "TRABAJADORES MOSTRADOS:",
            trabajadores.length
        );


    } catch (error) {

        console.error(
            "ERROR CARGANDO TRABAJADORES:",
            error
        );


        lista.innerHTML = `
            <tr>
                <td colspan="7">
                    Error al cargar trabajadores.
                </td>
            </tr>
        `;
    }
}

// ======================================================
// MOSTRAR FORMULARIO NUEVO TRABAJADOR
// ======================================================

function mostrarFormularioTrabajador() {

    limpiarFormularioTrabajador();

    if (formularioTrabajador) {

        formularioTrabajador.classList.add(
            "activo"
        );

        formularioTrabajador.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}


// ======================================================
// CANCELAR TRABAJADOR
// ======================================================

function cancelarTrabajador() {

    limpiarFormularioTrabajador();

    if (formularioTrabajador) {

        formularioTrabajador.classList.remove(
            "activo"
        );
    }
}

// ======================================================
// EDITAR TRABAJADOR
// ======================================================

async function editarTrabajador(id) {

    if (!formularioTrabajador) return;

    try {

        console.log(
            "Buscando trabajador para editar:",
            id
        );


        // ==============================================
        // OBTENER TODOS LOS TRABAJADORES
        // ==============================================

        const respuesta =
            await llamarSupabase(
                "listar_todos_trabajadores"
            );


        // ==============================================
        // NORMALIZAR RESPUESTA
        // ==============================================

        let trabajadores = [];


        if (Array.isArray(respuesta)) {

            trabajadores = respuesta;

        } else if (
            respuesta &&
            Array.isArray(respuesta.trabajadores)
        ) {

            trabajadores =
                respuesta.trabajadores;

        } else if (
            respuesta &&
            Array.isArray(respuesta.data)
        ) {

            trabajadores =
                respuesta.data;

        } else if (
            respuesta &&
            Array.isArray(respuesta.resultado)
        ) {

            trabajadores =
                respuesta.resultado;
        }


        // ==============================================
        // BUSCAR TRABAJADOR POR ID
        // ==============================================

        const trabajador =
            trabajadores.find(
                function(item) {

                    return String(item.id) ===
                           String(id);

                }
            );


        if (!trabajador) {

            console.error(
                "No se encontró el trabajador:",
                id
            );

            mostrarMensajeTrabajador(
                "No se encontró el trabajador.",
                "red"
            );

            return;
        }


        console.log(
            "TRABAJADOR ENCONTRADO:",
            trabajador
        );


        // ==============================================
        // GUARDAR ID PARA ACTUALIZAR
        // ==============================================

        formularioTrabajador.dataset.id =
            trabajador.id;


        // ==============================================
        // CAMPOS DEL FORMULARIO
        // ==============================================

        const campoDni =
            document.getElementById(
                "nuevoDni"
            );

        const campoNombre =
            document.getElementById(
                "nuevoNombre"
            );

        const campoApellidos =
            document.getElementById(
                "nuevoApellidos"
            );

        const campoArea =
            document.getElementById(
                "nuevoArea"
            );

        const campoCargo =
            document.getElementById(
                "nuevoCargo"
            );

        const campoActivo =
            document.getElementById(
                "nuevoActivo"
            );


        // ==============================================
        // CARGAR DATOS
        // ==============================================

        if (campoDni) {

            campoDni.value =
                trabajador.dni || "";
        }


        if (campoNombre) {

            campoNombre.value =
                trabajador.nombre || "";
        }


        if (campoApellidos) {

            campoApellidos.value =
                trabajador.apellidos || "";
        }


        if (campoArea) {

            campoArea.value =
                trabajador.area || "";
        }


        if (campoCargo) {

            campoCargo.value =
                trabajador.cargo || "";
        }


        if (campoActivo) {

            campoActivo.value =
                trabajador.activo === false
                    ? "false"
                    : "true";
        }


        // ==============================================
        // CAMBIAR TÍTULO
        // ==============================================

        if (tituloFormulario) {

            tituloFormulario.textContent =
                "Editar trabajador";
        }


        // ==============================================
        // CAMBIAR BOTÓN
        // ==============================================

        if (btnGuardarTrabajador) {

            btnGuardarTrabajador.textContent =
                "ACTUALIZAR TRABAJADOR";
        }


        // ==============================================
        // MOSTRAR FORMULARIO
        // ==============================================

        formularioTrabajador.classList.add(
            "activo"
        );


        formularioTrabajador.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });


    } catch (error) {

        console.error(
            "Error cargando trabajador para editar:",
            error
        );


        mostrarMensajeTrabajador(
            "No se pudo cargar la información del trabajador.",
            "red"
        );
    }
}

// ======================================================
// GUARDAR / ACTUALIZAR TRABAJADOR
// ======================================================

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


    if (!dni || !nombre || !apellidos) {

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


        if (
            resultado &&
            resultado.ok === false
        ) {

            throw new Error(
                resultado.mensaje ||
                "Supabase rechazó la operación."
            );
        }


        mostrarMensajeTrabajador(
            id
                ? "Trabajador actualizado correctamente."
                : "Trabajador registrado correctamente.",
            "green"
        );


        limpiarFormularioTrabajador();

        await cargarTrabajadores();
await cargarListaTrabajadores();

// Actualizar automáticamente el horario mostrado
if (
    trabajadorSelect &&
    trabajadorSelect.value &&
    fechaInicio &&
    fechaInicio.value
) {
    limpiarHorarios();
    await cargarHorarioExistente();
}

        

    } catch (error) {

        console.error(
            "Error guardando trabajador:",
            error
        );


        let mensajeError =
            "No se pudo guardar el trabajador.";


        const texto =
            error.message || "";


        if (
            texto.toLowerCase().includes("duplicate") ||
            texto.toLowerCase().includes("unique")
        ) {

            mensajeError =
                "El DNI ya está registrado.";
        }


        mostrarMensajeTrabajador(
            mensajeError,
            "red"
        );
    }
}


// ======================================================
// LIMPIAR FORMULARIO TRABAJADOR
// ======================================================

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


    if (campoDni) campoDni.value = "";

    if (campoNombre) campoNombre.value = "";

    if (campoApellidos) campoApellidos.value = "";

    if (campoArea) campoArea.value = "";

    if (campoCargo) campoCargo.value = "";

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
            "GUARDAR";
    }
}

// ======================================================
// GUARDAR HORARIO - ACTUALIZACIÓN AUTOMÁTICA
// ======================================================

async function guardarHorario() {

    if (!trabajadorSelect || !fechaInicio) return;

    const trabajadorId = trabajadorSelect.value;
    const fechaBase = fechaInicio.value;

    if (!trabajadorId) {
        mostrarMensajeHorario("Seleccione un trabajador.", "red");
        return;
    }

    if (!fechaBase) {
        mostrarMensajeHorario("Seleccione la fecha de inicio.", "red");
        return;
    }

    const textoOriginal = btnGuardar
        ? btnGuardar.textContent
        : "";

    try {

        if (btnGuardar) {
            btnGuardar.disabled = true;
            btnGuardar.textContent = "GUARDANDO...";
        }

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

        dias.forEach(function(dia, indice) {

            const entrada = document.getElementById(`${dia}Entrada`);
            const salida = document.getElementById(`${dia}Salida`);
            const descanso = document.getElementById(`${dia}Descanso`);

            const horaEntrada = entrada?.value || "";
            const horaSalida = salida?.value || "";

            const esDescanso = descanso?.checked === true;

            horarios.push({
                dia: indice,
                hora_entrada: esDescanso ? "" : horaEntrada,
                hora_salida: esDescanso ? "" : horaSalida,
                descanso: esDescanso
            });

        });

        const resultado = await llamarSupabase(
            "guardar_horario_semanal",
            {
                p_trabajador_id: trabajadorId,
                p_fecha_inicio: fechaBase,
                p_horarios: horarios
            }
        );

        if (!resultado || resultado.ok !== true) {
            throw new Error(
                resultado?.mensaje || "No se pudo guardar el horario."
            );
        }

        // VOLVER A CONSULTAR EL HORARIO GUARDADO
        await cargarHorarioExistente();

        mostrarMensajeHorario(
            "✓ Horario guardado y actualizado correctamente.",
            "green"
        );

    } catch (error) {

        console.error("Error guardando horario:", error);

        mostrarMensajeHorario(
            error.message || "No se pudo guardar el horario.",
            "red"
        );

    } finally {

        if (btnGuardar) {
            btnGuardar.disabled = false;
            btnGuardar.textContent = textoOriginal || "✓ GUARDAR HORARIO";
        }

    }
}

// ======================================================
// MENSAJE HORARIO
// ======================================================

function mostrarMensajeHorario(
    texto,
    tipo
) {

    if (!mensaje) return;

    mensaje.textContent =
        texto;


    if (tipo === "green") {

        mensaje.style.color =
            "#155724";

        mensaje.style.background =
            "#d4edda";

    } else {

        mensaje.style.color =
            "#721c24";

        mensaje.style.background =
            "#f8d7da";
    }
}

// ======================================================
// CARGAR HORARIO EXISTENTE
// ======================================================

async function cargarHorarioExistente() {

    if (!trabajadorSelect || !fechaInicio) return;

    const trabajadorId = trabajadorSelect.value;
    const fechaBase = fechaInicio.value;

    if (!trabajadorId || !fechaBase) {
        limpiarHorarios();
        return;
    }

    try {

        limpiarHorarios();

        // CONSULTAR LA SEMANA SELECCIONADA
        const resultadoActual = await llamarSupabase(
            "obtener_horario_semanal",
            {
                p_trabajador_id: trabajadorId,
                p_fecha_inicio: fechaBase
            }
        );

        console.log("HORARIO SEMANA ACTUAL:", resultadoActual);

        // VERIFICAR SI LA SEMANA ACTUAL TIENE HORARIOS
        const tieneHorarioActual =
            resultadoActual?.ok === true &&
            Array.isArray(resultadoActual.horarios) &&
            resultadoActual.horarios.some(h =>
                h.descanso === true ||
                h.hora_entrada ||
                h.hora_salida
            );

        if (tieneHorarioActual) {

            colocarHorariosEnFormulario(resultadoActual.horarios);

            console.log("Se cargó el horario de la semana seleccionada.");

            mostrarMensajeHorario(
                "✓ Se cargaron los horarios de esta semana.",
                "green"
            );

            return;
        }

        // SI NO EXISTEN HORARIOS, CALCULAR LA SEMANA ANTERIOR
        const partes = fechaBase.split("-").map(Number);

        const fechaAnterior = new Date(
            Date.UTC(partes[0], partes[1] - 1, partes[2] - 7)
        );

        const anio = fechaAnterior.getUTCFullYear();
        const mes = String(fechaAnterior.getUTCMonth() + 1).padStart(2, "0");
        const dia = String(fechaAnterior.getUTCDate()).padStart(2, "0");

        const fechaSemanaAnterior = `${anio}-${mes}-${dia}`;

        // CONSULTAR HORARIOS DE LA SEMANA ANTERIOR
        const resultadoAnterior = await llamarSupabase(
            "obtener_horario_semanal",
            {
                p_trabajador_id: trabajadorId,
                p_fecha_inicio: fechaSemanaAnterior
            }
        );

        console.log("HORARIO SEMANA ANTERIOR:", resultadoAnterior);

        const tieneHorarioAnterior =
            resultadoAnterior?.ok === true &&
            Array.isArray(resultadoAnterior.horarios) &&
            resultadoAnterior.horarios.some(h =>
                h.descanso === true ||
                h.hora_entrada ||
                h.hora_salida
            );

        if (tieneHorarioAnterior) {

            // COPIAR LOS HORARIOS ANTERIORES COMO BASE
            colocarHorariosEnFormulario(resultadoAnterior.horarios);

            mostrarMensajeHorario(
                "✓ Se copiaron los horarios de la semana anterior. Puede modificarlos y guardar la nueva semana.",
                "green"
            );

            console.log("Horario anterior cargado como plantilla.");

        } else {

            limpiarHorarios();

            mostrarMensajeHorario(
                "No hay horarios registrados para esta semana ni para la anterior.",
                "red"
            );
        }

    } catch (error) {

        console.error("Error cargando horario:", error);

        limpiarHorarios();

        mostrarMensajeHorario(
            "No se pudo cargar el horario.",
            "red"
        );
    }
}


// COLOCAR LOS HORARIOS EN LOS CAMPOS DEL FORMULARIO
function colocarHorariosEnFormulario(horarios) {

    const dias = [
        "lunes",
        "martes",
        "miercoles",
        "jueves",
        "viernes",
        "sabado",
        "domingo"
    ];

    limpiarHorarios();

    horarios.forEach(function(horario) {

        const numeroDia = Number(horario.dia);
        const nombreDia = dias[numeroDia];

        if (!nombreDia) return;

        const entrada = document.getElementById(`${nombreDia}Entrada`);
        const salida = document.getElementById(`${nombreDia}Salida`);
        const descanso = document.getElementById(`${nombreDia}Descanso`);

        if (entrada) {
            entrada.value = horario.hora_entrada
                ? horario.hora_entrada.substring(0, 5)
                : "";
        }

        if (salida) {
            salida.value = horario.hora_salida
                ? horario.hora_salida.substring(0, 5)
                : "";
        }

        if (descanso) {
            descanso.checked = horario.descanso === true;
        }

    });
}
// ======================================================
// LIMPIAR HORARIOS
// ======================================================

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


    dias.forEach(function(dia) {

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


// ======================================================
// REPORTES
// ======================================================

async function consultarReporte() {

    const desde =
        document.getElementById(
            "fechaReporteDesde"
        )?.value;

    const hasta =
        document.getElementById(
            "fechaReporteHasta"
        )?.value;


    const lista =
        document.getElementById(
            "listaReporte"
        );


    if (!desde || !hasta) {

        mostrarMensajeReporte(
            "Seleccione la fecha de inicio y la fecha final.",
            "red"
        );

        return;
    }


    if (desde > hasta) {

        mostrarMensajeReporte(
            "La fecha 'Desde' no puede ser mayor que 'Hasta'.",
            "red"
        );

        return;
    }


    try {

        mostrarMensajeReporte(
            "Consultando reporte...",
            "green"
        );


        if (lista) {

            lista.innerHTML = `
                <tr>
                    <td colspan="10">
                        Consultando información...
                    </td>
                </tr>
            `;
        }


        const resultado =
            await llamarSupabase(
                "obtener_reporte_asistencia",
                {
                    p_fecha_inicio: desde,
                    p_fecha_fin: hasta
                }
            );


        console.log(
            "REPORTE RECIBIDO:",
            resultado
        );


        if (!Array.isArray(resultado)) {

            throw new Error(
                "La respuesta del reporte no tiene el formato esperado."
            );
        }


        reporteActual =
            resultado;


        mostrarReporte(
            resultado
        );
      
        mostrarMensajeReporte(
            `Reporte generado correctamente. Registros encontrados: ${resultado.length}`,
            "green"
        );

    } catch (error) {

        console.error(
            "Error consultando reporte:",
            error
        );


        reporteActual = [];


        if (lista) {

            lista.innerHTML = `
                <tr>
                    <td colspan="10">
                        No se pudo cargar el reporte.
                    </td>
                </tr>
            `;
        }


        mostrarMensajeReporte(
            "No se pudo generar el reporte.",
            "red"
        );
    }
}

// =========================================
// TAREO MENSUAL
// =========================================

async function mostrarTareoMensual(registros) {

    const encabezado = document.getElementById("encabezadoTareo");
    const cuerpo = document.getElementById("listaTareo");

   const desde = document.getElementById("fechaTareoDesde").value;
   const hasta = document.getElementById("fechaTareoHasta").value;

    if (!desde || !hasta) {
        cuerpo.innerHTML = `
            <tr>
                <td colspan="40">Selecciona las fechas del reporte.</td>
            </tr>`;
        return;
    }

    if (desde > hasta) {
        cuerpo.innerHTML = `
            <tr>
                <td colspan="40">La fecha inicial no puede ser mayor que la fecha final.</td>
            </tr>`;
        return;
    }

    // Obtener la lista de trabajadores
    let trabajadores;

try {
    trabajadores = await llamarSupabase("listar_todos_trabajadores");
} catch (error) {
    console.error("Error al cargar trabajadores del tareo:", error);

    cuerpo.innerHTML = `
        <tr>
            <td colspan="40">
                No se pudo cargar la lista de trabajadores.
            </td>
        </tr>`;

    return;
}
    // Generar los días del periodo seleccionado
    const dias = [];
    let fechaActual = new Date(`${desde}T00:00:00`);
    const fechaFinal = new Date(`${hasta}T00:00:00`);

    while (fechaActual <= fechaFinal) {
        dias.push(new Date(fechaActual));
        fechaActual.setDate(fechaActual.getDate() + 1);
    }

    // Convertir fecha a formato YYYY-MM-DD
    function fechaTexto(fecha) {
        const anio = fecha.getFullYear();
        const mes = String(fecha.getMonth() + 1).padStart(2, "0");
        const dia = String(fecha.getDate()).padStart(2, "0");
        return `${anio}-${mes}-${dia}`;
    }

    // Proteger los nombres al mostrarlos en la tabla
    function escaparHTML(valor) {
        return String(valor ?? "").replace(/[&<>"']/g, caracter => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        })[caracter]);
    }

    // Crear encabezados
    encabezado.innerHTML = `
        <tr>
            <th>Trabajador</th>
            <th>DNI</th>
            ${dias.map(dia => `
                <th>${dia.getDate()}</th>
            `).join("")}
            <th>Total 1</th>
            <th>Total D</th>
            <th>Total F</th>
        </tr>
    `;

    // Crear un registro por trabajador y día
    const asistencias = {};

    (registros || []).forEach(registro => {

        const dni = String(registro.dni || "").trim();

        const fecha = String(
            registro.fecha ||
            registro.fecha_asistencia ||
            ""
        ).substring(0, 10);

        if (!dni || !fecha) return;

        let estado = String(registro.estado || "").trim().toUpperCase();

        // Si tiene hora de entrada y no tiene estado, se considera asistencia
        if (!estado && (registro.hora_entrada || registro.entrada)) {
            estado = "1";
        }

        // Homologar los estados conocidos
        if (
            estado === "ASISTENCIA" ||
            estado === "ASISTIÓ" ||
            estado === "ASISTIO" ||
            estado === "PRESENTE"
        ) {
            estado = "1";
        }

        // Homologar los estados para el tareo
if (
    ["TARDANZA", "PUNTUAL", "SIN SALIDA"].includes(estado)
) {
    estado = "1";
}

if (
    ["DESCANSO", "DESCANSO SEMANAL"].includes(estado)
) {
    estado = "D";
}

if (
    ["INASISTENCIA", "FALTA", "INASISTENTE"].includes(estado)
) {
    estado = "F";
}
        if (!asistencias[dni]) {
            asistencias[dni] = {};
        }

        asistencias[dni][fecha] = estado;
    });

    // Mostrar trabajadores y sus marcas
    cuerpo.innerHTML = (trabajadores || [])
        .filter(trabajador => trabajador.activo !== false)
        .map(trabajador => {

            const dni = String(trabajador.dni || "").trim();

            const apellidos = String(trabajador.apellidos || "")
    .replace(/,+\s*$/, "")
    .trim();

const nombres = String(trabajador.nombre || "")
    .trim();

const nombre = [apellidos, nombres]
    .filter(Boolean)
    .join(", ") ||
    trabajador.nombre_completo ||
    "Sin nombre";

            let totalUno = 0;
            let totalD = 0;
            let totalF = 0;

            const celdas = dias.map(dia => {

                const fecha = fechaTexto(dia);
                const estado = asistencias[dni]?.[fecha] || "";

                if (estado === "1") totalUno++;
                if (estado === "D") totalD++;
                if (estado === "F") totalF++;

                return `<td style="text-align:center;">${escaparHTML(estado)}</td>`;
            }).join("");

            return `
                <tr>
                    <td>${escaparHTML(nombre)}</td>
                    <td>${escaparHTML(dni)}</td>
                    ${celdas}
                    <td style="text-align:center;"><strong>${totalUno}</strong></td>
                    <td style="text-align:center;">${totalD}</td>
                    <td style="text-align:center;">${totalF}</td>
                </tr>
            `;
        }).join("");

    if (!trabajadores || trabajadores.length === 0) {
        cuerpo.innerHTML = `
            <tr>
                <td colspan="${dias.length + 5}">
                    No se encontraron trabajadores.
                </td>
            </tr>`;
    }
}

// ======================================================
// CONSULTA INDEPENDIENTE DEL TAREO MENSUAL
// ======================================================

async function consultarTareo() {

    const desde = document.getElementById("fechaTareoDesde").value;
    const hasta = document.getElementById("fechaTareoHasta").value;
    const cuerpo = document.getElementById("listaTareo");
    const mensaje = document.getElementById("mensajeTareo");

    if (!desde || !hasta) {
        mensaje.textContent = "Selecciona las fechas del tareo.";
        return;
    }

    if (desde > hasta) {
        mensaje.textContent = "La fecha inicial no puede ser mayor que la fecha final.";
        return;
    }

    try {
        mensaje.textContent = "Consultando tareo...";

        const registros = await llamarSupabase("obtener_reporte_asistencia", {
            p_fecha_inicio: desde,
            p_fecha_fin: hasta
        });

        if (!Array.isArray(registros)) {
            throw new Error("La respuesta no tiene el formato esperado.");
        }

        await mostrarTareoMensual(registros);

        mensaje.textContent = "Tareo generado correctamente.";

    } catch (error) {
        console.error("Error al consultar tareo:", error);
        cuerpo.innerHTML = `
            <tr>
                <td colspan="40">No se pudo generar el tareo.</td>
            </tr>`;
        mensaje.textContent = "Error al consultar el tareo.";
    }
}

// ======================================================
// MOSTRAR REPORTE
// ======================================================

function mostrarReporte(datos) {

    const lista = document.getElementById("listaReporte");

    if (!lista) return;

    lista.innerHTML = "";

    if (!Array.isArray(datos) || datos.length === 0) {

        lista.innerHTML = `
            <tr>
                <td colspan="11">
                    No hay registros para el rango seleccionado.
                </td>
            </tr>
        `;

        return;
    }


    // ==================================================
    // CREAR CELDA NORMAL
    // ==================================================

    function crearCelda(fila, contenido) {

        const celda = document.createElement("td");

        celda.textContent =
            contenido === null ||
            contenido === undefined
                ? ""
                : contenido;

        fila.appendChild(celda);
    }


    // ==================================================
    // CREAR CELDA DE UBICACIÓN
    // ==================================================

    function crearCeldaUbicacion(
        fila,
        latEntrada,
        lonEntrada,
        latSalida,
        lonSalida
    ) {

        const celda =
            document.createElement("td");


        let tieneUbicacion = false;


        // ------------------------------
        // ENTRADA
        // ------------------------------

        if (
            latEntrada !== null &&
            latEntrada !== undefined &&
            latEntrada !== "" &&
            lonEntrada !== null &&
            lonEntrada !== undefined &&
            lonEntrada !== ""
        ) {

            const enlaceEntrada =
                document.createElement("a");

            enlaceEntrada.href =
                `https://www.google.com/maps?q=${latEntrada},${lonEntrada}`;

            enlaceEntrada.target = "_blank";

            enlaceEntrada.rel =
                "noopener noreferrer";

            enlaceEntrada.textContent =
                "📍 Entrada";

            enlaceEntrada.style.color =
                "#8B0000";

            enlaceEntrada.style.fontWeight =
                "bold";

            enlaceEntrada.style.textDecoration =
                "none";

            celda.appendChild(
                enlaceEntrada
            );

            tieneUbicacion = true;
        }


        // ------------------------------
        // SALIDA
        // ------------------------------

        if (
            latSalida !== null &&
            latSalida !== undefined &&
            latSalida !== "" &&
            lonSalida !== null &&
            lonSalida !== undefined &&
            lonSalida !== ""
        ) {

            if (tieneUbicacion) {

                celda.appendChild(
                    document.createElement("br")
                );
            }


            const enlaceSalida =
                document.createElement("a");

            enlaceSalida.href =
                `https://www.google.com/maps?q=${latSalida},${lonSalida}`;

            enlaceSalida.target = "_blank";

            enlaceSalida.rel =
                "noopener noreferrer";

            enlaceSalida.textContent =
                "📍 Salida";

            enlaceSalida.style.color =
                "#8B0000";

            enlaceSalida.style.fontWeight =
                "bold";

            enlaceSalida.style.textDecoration =
                "none";

            celda.appendChild(
                enlaceSalida
            );

            tieneUbicacion = true;
        }


        if (!tieneUbicacion) {

            celda.textContent =
                "Sin ubicación";
        }


        fila.appendChild(celda);
    }


    // ==================================================
    // RECORRER REPORTE
    // ==================================================

    datos.forEach(function(registro) {

        const fila =
            document.createElement("tr");


        // ------------------------------
        // DATOS
        // ------------------------------

        const fecha =
            obtenerValor(
                registro,
                ["fecha", "fecha_asistencia"]
            );


        const dni =
            obtenerValor(
                registro,
                ["dni"]
            );


        const trabajador =
            obtenerValor(
                registro,
                [
                    "trabajador",
                    "nombre_completo",
                    "nombre"
                ]
            );


        const area =
            obtenerValor(
                registro,
                ["area"]
            );


        const entrada =
            obtenerValor(
                registro,
                [
                    "hora_entrada",
                    "entrada"
                ]
            );


        const salida =
            obtenerValor(
                registro,
                [
                    "hora_salida",
                    "salida"
                ]
            );


        const estado =
            obtenerValor(
                registro,
                ["estado"]
            );


        const tardanza =
            obtenerValor(
                registro,
                [
                    "minutos_tardanza",
                    "tardanza"
                ]
            );


        const horas =
            obtenerValor(
                registro,
                [
                    "horas_trabajadas",
                    "horas"
                ]
            );


        const horasExtras =
            obtenerValor(
                registro,
                [
                    "horas_extra",
                    "horas_extras",
                    "hora_extra",
                    "extras"
                ]
            );


        // ------------------------------
        // COORDENADAS
        // ------------------------------

        const latEntrada =
            obtenerValor(
                registro,
                ["latitud_entrada"]
            );


        const lonEntrada =
            obtenerValor(
                registro,
                ["longitud_entrada"]
            );


        const latSalida =
            obtenerValor(
                registro,
                ["latitud_salida"]
            );


        const lonSalida =
            obtenerValor(
                registro,
                ["longitud_salida"]
            );


        // ==================================================
        // CREAR COLUMNAS
        // ==================================================

        crearCelda(
            fila,
            formatearFecha(fecha)
        );


        crearCelda(
            fila,
            dni
        );


        crearCelda(
            fila,
            trabajador
        );


        crearCelda(
            fila,
            area
        );


        crearCelda(
            fila,
            formatearHora(entrada)
        );


        crearCelda(
            fila,
            formatearHora(salida)
        );


        // ⭐ UBICACIÓN
        crearCeldaUbicacion(
            fila,
            latEntrada,
            lonEntrada,
            latSalida,
            lonSalida
        );


        // ⭐ ESTADO
        crearCelda(
            fila,
            estado
        );


        // ⭐ TARDANZA
        crearCelda(
            fila,
            tardanza === "" ||
            tardanza === null ||
            tardanza === undefined
                ? "0 min"
                : `${tardanza} min`
        );


        // ⭐ HORAS TRABAJADAS
        crearCelda(
            fila,
            horas === "" ||
            horas === null ||
            horas === undefined
                ? "0"
                : horas
        );


        // ⭐ HORAS EXTRAS
        crearCelda(
            fila,
            horasExtras === "" ||
            horasExtras === null ||
            horasExtras === undefined
                ? "0"
                : horasExtras
        );


        lista.appendChild(
            fila
        );

    });
}

// ======================================================
// MOSTRAR REPORTE
// ======================================================


// ======================================================
// OBTENER VALOR
// ======================================================

function obtenerValor(
    objeto,
    nombres
) {

    for (
        let i = 0;
        i < nombres.length;
        i++
    ) {

        const nombre =
            nombres[i];


        if (
            objeto &&
            objeto[nombre] !== undefined &&
            objeto[nombre] !== null
        ) {

            return objeto[nombre];
        }
    }


    return "";
}


// ======================================================
// AGREGAR CELDA
// ======================================================

function agregarCelda(
    fila,
    valor
) {

    const td =
        document.createElement("td");

    td.textContent =
        valor ?? "";

    fila.appendChild(td);
}


// ======================================================
// FORMATO FECHA
// ======================================================

function formatearFecha(valor) {

    if (!valor) return "";

    const texto =
        String(valor);

    if (
        /^\d{4}-\d{2}-\d{2}$/.test(texto)
    ) {

        const partes =
            texto.split("-");

        return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }

    return texto;
}


// ======================================================
// FORMATO HORA
// ======================================================

function formatearHora(valor) {

    if (!valor) return "";

    return String(valor)
        .substring(0, 5);
}


// ======================================================
// MENSAJE REPORTE
// ======================================================

function mostrarMensajeReporte(
    texto,
    tipo
) {

    const elemento =
        document.getElementById(
            "mensajeReporte"
        );


    if (!elemento) return;


    elemento.textContent =
        texto;


    if (tipo === "green") {

        elemento.style.color =
            "#155724";

        elemento.style.background =
            "#d4edda";

    } else {

        elemento.style.color =
            "#721c24";

        elemento.style.background =
            "#f8d7da";
    }
}


// ======================================================
// DESCARGAR EXCEL
// ======================================================

function descargarExcel() {

    if (
        !Array.isArray(reporteActual) ||
        reporteActual.length === 0
    ) {

        mostrarMensajeReporte(
            "Primero consulte un reporte.",
            "red"
        );

        return;
    }


    const encabezados = [
        "Fecha",
        "DNI",
        "Trabajador",
        "Área",
        "Entrada",
        "Salida",
        "Ubicación",
        "Estado",
        "Tardanza (min)",
        "Horas trabajadas",
        "Horas extras"
    ];


    const filas =
        reporteActual.map(function(registro) {

            return [

                formatearFecha(
                    obtenerValor(
                        registro,
                        [
                            "fecha",
                            "fecha_asistencia"
                        ]
                    )
                ),

                obtenerValor(
                    registro,
                    [
                        "dni"
                    ]
                ),

                obtenerValor(
                    registro,
                    [
                        "trabajador",
                        "nombre_completo",
                        "nombre"
                    ]
                ),

                obtenerValor(
                    registro,
                    [
                        "area"
                    ]
                ),

                formatearHora(
                    obtenerValor(
                        registro,
                        [
                            "hora_entrada",
                            "entrada"
                        ]
                    )
                ),

                formatearHora(
                    obtenerValor(
                        registro,
                        [
                            "hora_salida",
                            "salida"
                        ]
                    )
                ),

                obtenerValor(
                    registro,
                    [
                        "estado"
                    ]
                ),

                obtenerValor(
                    registro,
                    [
                        "minutos_tardanza",
                        "tardanza"
                    ]
                ),

                obtenerValor(
                    registro,
                    [
                        "horas_trabajadas",
                        "horas"
                    ]
                ),

                obtenerValor(
                    registro,
                    [
                        "horas_extra",
                        "horas_extras",
                        "hora_extra",
                        "extras"
                    ]
                )

            ];
        });


    let csv =
        encabezados.join(";") +
        "\n";


    filas.forEach(function(fila) {

        csv += fila
            .map(function(valor) {

                return `"${String(
                    valor ?? ""
                ).replace(
                    /"/g,
                    '""'
                )}"`;

            })
            .join(";") +
            "\n";
    });


    const blob =
        new Blob(
            ["\uFEFF" + csv],
            {
                type:
                    "text/csv;charset=utf-8;"
            }
        );


    const url =
        URL.createObjectURL(blob);


    const enlace =
        document.createElement("a");


    enlace.href = url;


    enlace.download =
        `Reporte_Asistencia_${obtenerFechaArchivo()}.csv`;


    document.body.appendChild(
        enlace
    );


    enlace.click();


    document.body.removeChild(
        enlace
    );


    URL.revokeObjectURL(url);


    mostrarMensajeReporte(
        "Reporte descargado correctamente.",
        "green"
    );
}


// ======================================================
// FECHA PARA ARCHIVO
// ======================================================

function obtenerFechaArchivo() {

    const fecha =
        new Date();

    return fecha
        .toISOString()
        .split("T")[0];
}

// ======================================================
// CARGAR USUARIOS ADMINISTRADORES
// ======================================================

async function cargarUsuariosAdmin() {

    const lista =
        document.getElementById(
            "listaUsuariosAdmin"
        );


    if (!lista) {

        console.warn(
            "No existe listaUsuariosAdmin"
        );

        return;
    }


    lista.innerHTML = `
        <tr>
            <td colspan="5">
                Cargando usuarios...
            </td>
        </tr>
    `;


    try {

        console.log(
            "Consultando usuarios administradores..."
        );


        const respuesta =
            await llamarSupabase(
                "listar_usuarios_admin",
                {}
            );


        console.log(
            "RESPUESTA USUARIOS:",
            respuesta
        );


        // ==================================================
        // NORMALIZAR RESPUESTA
        // ==================================================

        let usuarios = [];


        if (Array.isArray(respuesta)) {

            usuarios = respuesta;

        }
        else if (
            respuesta &&
            Array.isArray(respuesta.usuarios)
        ) {

            usuarios =
                respuesta.usuarios;

        }
        else if (
            respuesta &&
            Array.isArray(respuesta.data)
        ) {

            usuarios =
                respuesta.data;

        }
        else if (
            respuesta &&
            Array.isArray(respuesta.resultado)
        ) {

            usuarios =
                respuesta.resultado;
        }


        console.log(
            "USUARIOS NORMALIZADOS:",
            usuarios
        );


        lista.innerHTML = "";


        if (
            usuarios.length === 0
        ) {

            lista.innerHTML = `
                <tr>
                    <td colspan="5">
                        No hay usuarios registrados.
                    </td>
                </tr>
            `;

            return;
        }


        // ==================================================
        // MOSTRAR USUARIOS
        // ==================================================

        usuarios.forEach(
            function(usuario) {

                const fila =
                    document.createElement("tr");


                const activo =
                    usuario.activo !== false;


                fila.innerHTML = `
                    <td>
                        ${usuario.usuario || ""}
                    </td>

                    <td>
                        ${usuario.nombre || ""}
                    </td>

                    <td>
                        ${usuario.rol || ""}
                    </td>

                    <td
                        style="
                            font-weight:bold;
                            color:${
                                activo
                                    ? "#198754"
                                    : "#dc3545"
                            };
                        "
                    >
                        ${
                            activo
                                ? "Activo"
                                : "Inactivo"
                        }
                    </td>

                    <td>

                        <button
                            type="button"
                            class="btn-editar"
                            onclick="editarUsuarioAdmin('${usuario.id}')">

                            ✏️ Editar

                        </button>

                    </td>
                `;


                lista.appendChild(fila);

            }
        );


        console.log(
            "USUARIOS MOSTRADOS:",
            usuarios.length
        );


    } catch (error) {

        console.error(
            "ERROR CARGANDO USUARIOS:",
            error
        );


        lista.innerHTML = `
            <tr>
                <td colspan="5">
                    Error al cargar usuarios.
                </td>
            </tr>
        `;
    }
}
// ======================================================
// CREAR USUARIO
// ======================================================

async function crearUsuarioAdmin() {

    const campoUsuario =
        document.getElementById(
            "nuevoUsuarioAdmin"
        );

    const campoNombre =
        document.getElementById(
            "nuevoNombreAdmin"
        );

    const campoPassword =
        document.getElementById(
            "nuevaPasswordAdmin"
        );

    const campoRol =
        document.getElementById(
            "nuevoRolAdmin"
        );


    const usuario =
        campoUsuario?.value.trim() || "";

    const nombre =
        campoNombre?.value.trim() || "";

    const password =
        campoPassword?.value.trim() || "";

    const rol =
        campoRol?.value || "Administrador";


    if (!usuario) {

        mostrarMensajeUsuario(
            "Ingrese un usuario.",
            "red"
        );

        return;
    }


    if (!nombre) {

        mostrarMensajeUsuario(
            "Ingrese el nombre completo.",
            "red"
        );

        return;
    }


    if (!password) {

        mostrarMensajeUsuario(
            "Ingrese una contraseña.",
            "red"
        );

        return;
    }


    if (password.length < 6) {

        mostrarMensajeUsuario(
            "La contraseña debe tener mínimo 6 caracteres.",
            "red"
        );

        return;
    }


    try {

        const resultado =
            await llamarSupabase(
                "crear_usuario_admin",
                {
                    p_usuario: usuario,
                    p_password: password,
                    p_nombre: nombre,
                    p_rol: rol
                }
            );


        if (
            !resultado ||
            resultado.ok !== true
        ) {

            throw new Error(
                resultado?.mensaje ||
                "No se pudo crear el usuario."
            );
        }


        mostrarMensajeUsuario(
            "✓ Usuario creado correctamente.",
            "green"
        );


        if (campoUsuario) {
            campoUsuario.value = "";
        }

        if (campoNombre) {
            campoNombre.value = "";
        }

        if (campoPassword) {
            campoPassword.value = "";
        }

        if (campoRol) {
            campoRol.value =
                "Administrador";
        }


        await cargarUsuariosAdmin();


    } catch (error) {

        console.error(
            "Error creando usuario:",
            error
        );


        mostrarMensajeUsuario(
            error.message ||
            "No se pudo crear el usuario.",
            "red"
        );
    }
}


// ======================================================
// MENSAJE USUARIO
// ======================================================

function mostrarMensajeUsuario(
    texto,
    tipo
) {

    const mensajeUsuario =
        document.getElementById(
            "mensajeUsuario"
        );


    if (!mensajeUsuario) return;


    mensajeUsuario.textContent =
        texto;


    if (tipo === "green") {

        mensajeUsuario.style.background =
            "#d4edda";

        mensajeUsuario.style.color =
            "#155724";

    } else {

        mensajeUsuario.style.background =
            "#f8d7da";

        mensajeUsuario.style.color =
            "#721c24";
    }
}


// ======================================================
// CAMBIAR ESTADO USUARIO
// ======================================================

async function cambiarEstadoUsuario(
    id,
    estadoActual
) {

    const nuevoEstado =
        estadoActual === true
            ? false
            : true;


    const confirmar =
        confirm(
            nuevoEstado
                ? "¿Desea activar este usuario?"
                : "¿Desea desactivar este usuario?"
        );


    if (!confirmar) return;


    try {

        const resultado =
            await llamarSupabase(
                "cambiar_estado_usuario_admin",
                {
                    p_id: id,
                    p_activo: nuevoEstado
                }
            );


        if (
            !resultado ||
            resultado.ok !== true
        ) {

            throw new Error(
                resultado?.mensaje ||
                "No se pudo cambiar el estado."
            );
        }


        await cargarUsuariosAdmin();


    } catch (error) {

        console.error(
            "Error cambiando estado:",
            error
        );


        alert(
            error.message ||
            "No se pudo cambiar el estado."
        );
    }
}

// ======================================================
// CARGA DE HORARIOS DESDE EXCEL
// ======================================================

function normalizarDni(valor) {

    if (valor === null || valor === undefined) {
        return "";
    }

    return String(valor)
        .replace(/\D/g, "")
        .padStart(8, "0")
        .slice(-8);
}


// ======================================================
// NORMALIZAR TEXTO EXCEL
// ======================================================

function normalizarTextoExcel(valor) {

    if (
        valor === null ||
        valor === undefined
    ) {
        return "";
    }

    return String(valor)
        .trim();
}


// ======================================================
// NORMALIZAR FECHA EXCEL
// ======================================================

function normalizarFechaExcel(valor) {

    if (!valor) {
        return "";
    }


    if (
        valor instanceof Date &&
        !isNaN(valor.getTime())
    ) {

        const anio =
            valor.getFullYear();

        const mes =
            String(
                valor.getMonth() + 1
            ).padStart(2, "0");

        const dia =
            String(
                valor.getDate()
            ).padStart(2, "0");

        return `${anio}-${mes}-${dia}`;
    }


    if (
        typeof valor === "number" &&
        valor > 1
    ) {

        const fecha =
            XLSX.SSF.parse_date_code(valor);

        if (fecha) {

            return `${fecha.y}-${String(
                fecha.m
            ).padStart(2, "0")}-${String(
                fecha.d
            ).padStart(2, "0")}`;
        }
    }


    const texto =
        String(valor).trim();


    if (
        /^\d{4}-\d{2}-\d{2}$/.test(texto)
    ) {

        return texto;
    }


    const partes =
        texto.split(/[\/\-]/);


    if (partes.length === 3) {

        if (
            partes[0].length === 4
        ) {

            return `${partes[0]}-${String(
                partes[1]
            ).padStart(2, "0")}-${String(
                partes[2]
            ).padStart(2, "0")}`;
        }


        return `${partes[2]}-${String(
            partes[1]
        ).padStart(2, "0")}-${String(
            partes[0]
        ).padStart(2, "0")}`;
    }


    return "";
}


// ======================================================
// NORMALIZAR HORA EXCEL
// ======================================================

function normalizarHoraExcel(valor) {

    if (
        valor === null ||
        valor === undefined ||
        valor === ""
    ) {

        return "";
    }


    if (
        valor instanceof Date &&
        !isNaN(valor.getTime())
    ) {

        return `${String(
            valor.getHours()
        ).padStart(2, "0")}:${String(
            valor.getMinutes()
        ).padStart(2, "0")}`;
    }


    if (
        typeof valor === "number" &&
        valor >= 0 &&
        valor < 1
    ) {

        const minutosTotales =
            Math.round(
                valor * 24 * 60
            );

        const horas =
            Math.floor(
                minutosTotales / 60
            ) % 24;

        const minutos =
            minutosTotales % 60;


        return `${String(
            horas
        ).padStart(2, "0")}:${String(
            minutos
        ).padStart(2, "0")}`;
    }


    const texto =
        String(valor).trim();


    const coincidencia =
        texto.match(
            /^(\d{1,2}):(\d{2})/
        );


    if (coincidencia) {

        return `${String(
            parseInt(
                coincidencia[1],
                10
            )
        ).padStart(2, "0")}:${coincidencia[2]}`;
    }


    return "";
}


// ======================================================
// DETERMINAR DESCANSO
// ======================================================

function tipoEsDescanso(
    tipo,
    entrada,
    salida
) {

    const texto =
        normalizarTextoExcel(
            tipo
        ).toUpperCase();


    if (
        texto === "DESCANSO" ||
        texto === "DESCANSA" ||
        texto === "D"
    ) {

        return true;
    }


    if (
        !entrada &&
        !salida &&
        texto !== "TRABAJO"
    ) {

        return true;
    }


    return false;
}


// ======================================================
// LEER ARCHIVO EXCEL
// ======================================================

function leerArchivoExcel(
    archivo
) {

    return new Promise(
        function(resolve, reject) {

            const lector =
                new FileReader();


            lector.onload =
                function(evento) {

                    try {

                        const datos =
                            new Uint8Array(
                                evento.target.result
                            );


                        const libro =
                            XLSX.read(
                                datos,
                                {
                                    type: "array",
                                    cellDates: true
                                }
                            );


                        if (
                            !libro.SheetNames ||
                            libro.SheetNames.length === 0
                        ) {

                            reject(
                                new Error(
                                    "El Excel no contiene hojas."
                                )
                            );

                            return;
                        }


                        let nombreHoja =
                            libro.SheetNames.find(
                                function(nombre) {

                                    return (
                                        nombre
                                            .trim()
                                            .toUpperCase()
                                            ===
                                        "HORARIO_SEMANAL"
                                    );

                                }
                            );


                        if (!nombreHoja) {

                            nombreHoja =
                                libro.SheetNames[0];
                        }


                        const hoja =
                            libro.Sheets[
                                nombreHoja
                            ];


                        const filas =
                            XLSX.utils.sheet_to_json(
                                hoja,
                                {
                                    defval: "",
                                    raw: true
                                }
                            );


                        resolve(
                            filas
                        );


                    } catch (error) {

                        reject(
                            error
                        );
                    }

                };


            lector.onerror =
                function() {

                    reject(
                        new Error(
                            "No se pudo leer el archivo Excel."
                        )
                    );
                };


            lector.readAsArrayBuffer(
                archivo
            );

        }
    );
}


// ======================================================
// CARGAR HORARIO DESDE EXCEL
// ======================================================

async function cargarHorarioDesdeExcel() {

    const archivoInput =
    document.getElementById("archivoHorarioExcel") ||
    document.getElementById("archivoExcel");
        

    const mensajeExcel =
        document.getElementById(
            "mensajeExcel"
        );


    const boton =
        document.getElementById(
            "btnSubirExcel"
        );


    if (!archivoInput) {

        console.error(
            "No existe #archivoExcel"
        );

        return;
    }


    const archivo =
        archivoInput.files[0];


    if (!archivo) {

        mostrarMensajeExcel(
            "Seleccione primero un archivo Excel.",
            "red"
        );

        return;
    }


    if (
        typeof XLSX === "undefined"
    ) {

        mostrarMensajeExcel(
            "No se cargó la librería Excel. Recargue la página.",
            "red"
        );

        return;
    }


    try {

        if (boton) {

            boton.disabled = true;

            boton.textContent =
                "⏳ PROCESANDO...";
        }


        mostrarMensajeExcel(
            "Leyendo archivo Excel...",
            "green"
        );


        const filas =
            await leerArchivoExcel(
                archivo
            );


        if (
            !Array.isArray(filas) ||
            filas.length === 0
        ) {

            throw new Error(
                "El Excel no contiene registros."
            );
        }


        // --------------------------------------------------
        // OBTENER TRABAJADORES
        // --------------------------------------------------

        const trabajadores =
            await llamarSupabase(
                "listar_todos_trabajadores"
            );


        if (
            !Array.isArray(trabajadores)
        ) {

            throw new Error(
                "No se pudieron cargar los trabajadores."
            );
        }


        const trabajadoresPorDni =
            new Map();


        const trabajadoresPorNombre =
            new Map();


        trabajadores.forEach(
            function(trabajador) {

                const dni =
                    normalizarDni(
                        trabajador.dni
                    );


                const nombre =
                    `${trabajador.nombre || ""} ${
                        trabajador.apellidos || ""
                    }`
                    .trim()
                    .toUpperCase();


                if (dni) {

                    trabajadoresPorDni.set(
                        dni,
                        trabajador
                    );
                }


                if (nombre) {

                    trabajadoresPorNombre.set(
                        nombre,
                        trabajador
                    );
                }

            }
        );


        // --------------------------------------------------
        // COLUMNAS DE LOS DÍAS
        // --------------------------------------------------

        const dias = [

            {
                entrada: "LUN_ENTRADA",
                salida: "LUN_SALIDA",
                tipo: "LUN_TIPO"
            },

            {
                entrada: "MAR_ENTRADA",
                salida: "MAR_SALIDA",
                tipo: "MAR_TIPO"
            },

            {
                entrada: "MIE_ENTRADA",
                salida: "MIE_SALIDA",
                tipo: "MIE_TIPO"
            },

            {
                entrada: "JUE_ENTRADA",
                salida: "JUE_SALIDA",
                tipo: "JUE_TIPO"
            },

            {
                entrada: "VIE_ENTRADA",
                salida: "VIE_SALIDA",
                tipo: "VIE_TIPO"
            },

            {
                entrada: "SAB_ENTRADA",
                salida: "SAB_SALIDA",
                tipo: "SAB_TIPO"
            },

            {
                entrada: "DOM_ENTRADA",
                salida: "DOM_SALIDA",
                tipo: "DOM_TIPO"
            }

        ];


        let guardados = 0;

        let omitidos = 0;

        const errores = [];


        // --------------------------------------------------
        // PROCESAR CADA TRABAJADOR
        // --------------------------------------------------

        for (
            const fila of filas
        ) {

            const dni =
                normalizarDni(
                    fila.DNI ??
                    fila.dni
                );


            const nombreExcel =
                normalizarTextoExcel(
                    fila.TRABAJADOR ??
                    fila.Trabajador ??
                    fila.NOMBRE ??
                    fila.Nombre
                )
                .toUpperCase();


            const trabajador =
                trabajadoresPorDni.get(dni) ||
                trabajadoresPorNombre.get(
                    nombreExcel
                );


            if (!trabajador) {

                omitidos++;

                errores.push(
                    `No encontrado: ${
                        dni ||
                        nombreExcel ||
                        "sin DNI/nombre"
                    }`
                );

                continue;
            }


            const fechaInicio =
                normalizarFechaExcel(
                    fila.FECHA_INICIO_SEMANA ??
                    fila["Fecha inicio"] ??
                    fila["FECHA INICIO"]
                );


            if (!fechaInicio) {

                omitidos++;

                errores.push(
                    `${trabajador.dni} - ${
                        trabajador.nombre
                    }: fecha de inicio inválida`
                );

                continue;
            }


            const horarios =
                dias.map(
                    function(dia, indice) {

                        const entrada =
                            normalizarHoraExcel(
                                fila[dia.entrada]
                            );


                        const salida =
                            normalizarHoraExcel(
                                fila[dia.salida]
                            );


                        const tipo =
                            normalizarTextoExcel(
                                fila[dia.tipo]
                            )
                            .toUpperCase();


                        const descanso =
                            tipoEsDescanso(
                                tipo,
                                entrada,
                                salida
                            );


                        return {

                            dia:
                                indice,

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

                    }
                );


            try {

                const respuesta =
                    await llamarSupabase(
                        "guardar_horario_semanal",
                        {
                            p_trabajador_id:
                                trabajador.id,

                            p_fecha_inicio:
                                fechaInicio,

                            p_horarios:
                                horarios
                        }
                    );


                if (
                    !respuesta ||
                    respuesta.ok !== true
                ) {

                    omitidos++;

                    errores.push(
                        `${trabajador.dni} - ${
                            trabajador.nombre
                        }: ${
                            respuesta?.mensaje ||
                            "no se pudo guardar"
                        }`
                    );

                    continue;
                }


                guardados++;


            } catch (error) {

                omitidos++;

                errores.push(
                    `${trabajador.dni} - ${
                        trabajador.nombre
                    }: ${
                        error.message ||
                        "error al guardar"
                    }`
                );
            }

        }


        // --------------------------------------------------
        // RESULTADO
        // --------------------------------------------------

      if (guardados > 0) {

    let mensajeFinal =
        `Excel procesado correctamente. Horarios guardados: ${guardados}. Registros omitidos: ${omitidos}.`;

    if (errores.length > 0) {
        mensajeFinal +=
            `<br><br><strong>Registros omitidos:</strong><br>` +
            errores.slice(0, 10).join("<br>");
    }

    mostrarMensajeExcel(
        mensajeFinal,
        omitidos === 0 ? "green" : "red"
    );

} else {

    mostrarMensajeExcel(
        `No se guardaron horarios. Registros omitidos: ${omitidos}.<br><br>` +
        `<strong>Detalle:</strong><br>` +
        errores.slice(0, 10).join("<br>"),
        "red"
    );
}

        console.log(
            "RESULTADO IMPORTACIÓN EXCEL",
            {
                guardados,
                omitidos,
                errores
            }
        );


        // Actualizar trabajadores
        await cargarTrabajadores();

        await cargarListaTrabajadores();


    } catch (error) {

        console.error(
            "Error importando Excel:",
            error
        );


        mostrarMensajeExcel(
            error.message ||
            "No se pudo procesar el Excel.",
            "red"
        );


    } finally {

        if (boton) {

            boton.disabled = false;

            boton.textContent =
                "📥 SUBIR Y GUARDAR EXCEL";
        }

    }
}


// ======================================================
// MENSAJE EXCEL
// ======================================================

function mostrarMensajeExcel(
    texto,
    tipo
) {

    const elemento =
        document.getElementById(
            "mensajeExcel"
        );


    if (!elemento) return;


    elemento.innerHTML =
        texto;


    if (tipo === "green") {

        elemento.style.color =
            "#155724";

        elemento.style.background =
            "#d4edda";

    } else {

        elemento.style.color =
            "#721c24";

        elemento.style.background =
            "#f8d7da";
    }

}


// ======================================================
// BOTÓN EXCEL
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        const botonExcel =
            document.getElementById(
                "btnSubirExcel"
            );


        if (botonExcel) {

            botonExcel.addEventListener(
                "click",
                cargarHorarioDesdeExcel
            );


            console.log(
                "BOTÓN EXCEL CONECTADO CORRECTAMENTE"
            );
        }

    }
);
  
// ======================================================
// EVENTOS
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    async function() {

        console.log(
            "ADMIN.JS CARGADO CORRECTAMENTE"
        );


        inicializarElementos();


        // ------------------------------
        // TRABAJADORES
        // ------------------------------

        if (btnGuardarTrabajador) {

            btnGuardarTrabajador.addEventListener(
                "click",
                guardarTrabajador
            );
        }


        // ------------------------------
        // HORARIOS
        // ------------------------------

        if (btnGuardar) {

            btnGuardar.addEventListener(
                "click",
                guardarHorario
            );
        }


        if (trabajadorSelect) {

            trabajadorSelect.addEventListener(
                "change",
                function() {

                    limpiarHorarios();

                    cargarHorarioExistente();
                }
            );
        }


        if (fechaInicio) {

            fechaInicio.addEventListener(
                "change",
                function() {

                    limpiarHorarios();

                    cargarHorarioExistente();
                }
            );
        }

        // ------------------------------
        // IMPORTAR HORARIOS DESDE EXCEL
        // ------------------------------

         const botonExcel =
               document.getElementById(
                  "btnCargarExcel"
               );

      if (botonExcel) {

          botonExcel.addEventListener(
              "click",
               cargarHorarioDesdeExcel
           );

       }

// ------------------------------
// EXCEL HORARIOS
// ------------------------------

const btnSubirExcel =
    document.getElementById("btnSubirExcel");

if (btnSubirExcel) {

    btnSubirExcel.addEventListener(
        "click",
        cargarHorarioDesdeExcel
    );

    console.log(
        "BOTÓN EXCEL CONECTADO CORRECTAMENTE"
    );

}

        
        // ------------------------------
        // USUARIOS
        // ------------------------------

        const botonUsuario =
            document.getElementById(
                "btnGuardarUsuario"
            );


        if (botonUsuario) {

            botonUsuario.addEventListener(
                "click",
                crearUsuarioAdmin
            );
        }


        // ------------------------------
        // CARGAS INICIALES
        // ------------------------------

        await cargarTrabajadores();

        await cargarListaTrabajadores();

        await cargarUsuariosAdmin();


        console.log(
            "ADMINISTRACIÓN CARGADA COMPLETAMENTE"
        );

    }
);
