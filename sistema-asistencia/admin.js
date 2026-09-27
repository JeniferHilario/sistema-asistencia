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
// CARGAR TRABAJADORES EN SELECT
// ======================================================

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

        if (!Array.isArray(trabajadores)) {
            return;
        }

        trabajadores.forEach(function(trabajador) {

            const opcion =
                document.createElement("option");

            opcion.value =
                trabajador.id;

            opcion.textContent =
                `${trabajador.dni} - ${trabajador.nombre} ${trabajador.apellidos}`;

            trabajadorSelect.appendChild(opcion);
        });

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

    if (!listaTrabajadores) return;

    try {

        const trabajadores =
            await llamarSupabase(
                "listar_todos_trabajadores"
            );

        listaTrabajadores.innerHTML = "";

        if (
            !Array.isArray(trabajadores) ||
            trabajadores.length === 0
        ) {

            listaTrabajadores.innerHTML = `
                <tr>
                    <td colspan="7">
                        No hay trabajadores registrados.
                    </td>
                </tr>
            `;

            return;
        }


        trabajadores.forEach(function(trabajador) {

            const fila =
                document.createElement("tr");


            const tdDni =
                document.createElement("td");

            tdDni.textContent =
                trabajador.dni || "";


            const tdNombre =
                document.createElement("td");

            tdNombre.textContent =
                trabajador.nombre || "";


            const tdApellidos =
                document.createElement("td");

            tdApellidos.textContent =
                trabajador.apellidos || "";


            const tdArea =
                document.createElement("td");

            tdArea.textContent =
                trabajador.area || "";


            const tdCargo =
                document.createElement("td");

            tdCargo.textContent =
                trabajador.cargo || "";


            const tdEstado =
                document.createElement("td");

            tdEstado.textContent =
                trabajador.activo
                    ? "Activo"
                    : "Inactivo";

            tdEstado.style.fontWeight = "bold";

            tdEstado.style.color =
                trabajador.activo
                    ? "#198754"
                    : "#dc3545";


            const tdAccion =
                document.createElement("td");


            const botonEditar =
                document.createElement("button");

            botonEditar.type = "button";

            botonEditar.textContent =
                "EDITAR";

            botonEditar.className =
                "btn-estado btn-activo";


            botonEditar.addEventListener(
                "click",
                function() {

                    editarTrabajador(
                        trabajador.id,
                        trabajador.dni || "",
                        trabajador.nombre || "",
                        trabajador.apellidos || "",
                        trabajador.area || "",
                        trabajador.cargo || "",
                        trabajador.activo === true
                    );

                }
            );


            tdAccion.appendChild(
                botonEditar
            );


            fila.appendChild(tdDni);
            fila.appendChild(tdNombre);
            fila.appendChild(tdApellidos);
            fila.appendChild(tdArea);
            fila.appendChild(tdCargo);
            fila.appendChild(tdEstado);
            fila.appendChild(tdAccion);


            listaTrabajadores.appendChild(
                fila
            );

        });


    } catch (error) {

        console.error(
            "Error cargando trabajadores:",
            error
        );

        listaTrabajadores.innerHTML = `
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


    formularioTrabajador.dataset.id =
        id;


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


    formularioTrabajador.classList.add(
        "activo"
    );


    formularioTrabajador.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
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
// GUARDAR HORARIO
// ======================================================

async function guardarHorario() {

    if (!trabajadorSelect || !fechaInicio) {
        return;
    }


    const trabajadorId =
        trabajadorSelect.value;

    const fechaBase =
        fechaInicio.value;


    if (!trabajadorId) {

        mostrarMensajeHorario(
            "Seleccione un trabajador.",
            "red"
        );

        return;
    }


    if (!fechaBase) {

        mostrarMensajeHorario(
            "Seleccione la fecha de inicio.",
            "red"
        );

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


        dias.forEach(function(dia, indice) {

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

        });


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


        if (
            !resultado ||
            resultado.ok !== true
        ) {

            throw new Error(
                resultado?.mensaje ||
                "No se pudo guardar el horario."
            );
        }


        mostrarMensajeHorario(
            "Horario semanal guardado correctamente.",
            "green"
        );


    } catch (error) {

        console.error(
            "Error guardando horario:",
            error
        );


        mostrarMensajeHorario(
            "No se pudo guardar el horario.",
            "red"
        );
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


        dias.forEach(function(dia) {

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

        });


    } catch (error) {

        console.error(
            "Error cargando horario:",
            error
        );
    }
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


// ======================================================
// MOSTRAR REPORTE
// ======================================================

function mostrarReporte(datos) {

    const lista =
        document.getElementById(
            "listaReporte"
        );


    if (!lista) return;


    lista.innerHTML = "";


    if (
        !Array.isArray(datos) ||
        datos.length === 0
    ) {

        lista.innerHTML = `
            <tr>
                <td colspan="10">
                    No hay registros para el rango seleccionado.
                </td>
            </tr>
        `;

        return;
    }


    datos.forEach(function(registro) {

        const fila =
            document.createElement("tr");


        const fecha =
            obtenerValor(
                registro,
                [
                    "fecha",
                    "fecha_asistencia"
                ]
            );


        const dni =
            obtenerValor(
                registro,
                [
                    "dni"
                ]
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
                [
                    "area"
                ]
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
                [
                    "estado"
                ]
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


        agregarCelda(
            fila,
            formatearFecha(fecha)
        );


        agregarCelda(
            fila,
            dni
        );


        agregarCelda(
            fila,
            trabajador
        );


        agregarCelda(
            fila,
            area
        );


        agregarCelda(
            fila,
            formatearHora(entrada)
        );


        agregarCelda(
            fila,
            formatearHora(salida)
        );


        agregarCelda(
            fila,
            estado
        );


        agregarCelda(
            fila,
            tardanza === "" ||
            tardanza === null
                ? "0"
                : `${tardanza} min`
        );


        agregarCelda(
            fila,
            horas === "" ||
            horas === null
                ? "0"
                : horas
        );


        agregarCelda(
            fila,
            horasExtras === "" ||
            horasExtras === null
                ? "0"
                : horasExtras
        );


        lista.appendChild(
            fila
        );

    });
}


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
// USUARIOS ADMINISTRADORES
// ======================================================

async function cargarUsuariosAdmin() {

    const lista =
        document.getElementById(
            "listaUsuariosAdmin"
        );


    if (!lista) return;


    lista.innerHTML = `
        <tr>
            <td colspan="5">
                Cargando usuarios...
            </td>
        </tr>
    `;


    try {

        const resultado =
            await llamarSupabase(
                "listar_usuarios_admin",
                {}
            );


        lista.innerHTML = "";


        if (
            !Array.isArray(resultado) ||
            resultado.length === 0
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


        resultado.forEach(function(usuario) {

            const fila =
                document.createElement("tr");


            const tdUsuario =
                document.createElement("td");

            tdUsuario.textContent =
                usuario.usuario || "";


            const tdNombre =
                document.createElement("td");

            tdNombre.textContent =
                usuario.nombre || "";


            const tdRol =
                document.createElement("td");

            tdRol.textContent =
                usuario.rol || "";


            const tdEstado =
                document.createElement("td");

            tdEstado.textContent =
                usuario.activo
                    ? "Activo"
                    : "Inactivo";


            tdEstado.style.fontWeight =
                "bold";

            tdEstado.style.color =
                usuario.activo
                    ? "#198754"
                    : "#dc3545";


            const tdAccion =
                document.createElement("td");


            const boton =
                document.createElement("button");


            boton.type = "button";

            boton.className =
                usuario.activo
                    ? "btn-estado btn-inactivo"
                    : "btn-estado btn-activo";


            boton.textContent =
                usuario.activo
                    ? "DESACTIVAR"
                    : "ACTIVAR";


            boton.addEventListener(
                "click",
                function() {

                    cambiarEstadoUsuario(
                        usuario.id,
                        usuario.activo
                    );

                }
            );


            tdAccion.appendChild(
                boton
            );


            fila.appendChild(
                tdUsuario
            );

            fila.appendChild(
                tdNombre
            );

            fila.appendChild(
                tdRol
            );

            fila.appendChild(
                tdEstado
            );

            fila.appendChild(
                tdAccion
            );


            lista.appendChild(
                fila
            );

        });


    } catch (error) {

        console.error(
            "Error cargando usuarios:",
            error
        );


        lista.innerHTML = `
            <tr>
                <td colspan="5">
                    Error al cargar los usuarios.
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
