import { actualizarSocio, buscarSocioPorId } from "../api/socios.js";

const formulario = document.getElementById("form__agregar_socio");
const botonGuardar = formulario.querySelector('button[type="submit"]');
const textoBotonGuardar = botonGuardar.querySelector(".btn-texto");
const parametros = new URLSearchParams(window.location.search);
const idSocio = parametros.get("id");
let socioActual;

textoBotonGuardar.textContent = "Guardar cambios";
botonGuardar.disabled = true;

function mostrarMensaje(texto, clase) {
    let mensaje = formulario.querySelector(".mensaje, .error");

    if (!mensaje) {
        mensaje = document.createElement("p");
        formulario.appendChild(mensaje);
    }

    mensaje.classList.remove("mensaje", "error");
    mensaje.classList.add(clase);
    mensaje.setAttribute("role", clase === "error" ? "alert" : "status");
    mensaje.textContent = texto;
}

function asignarValor(nombre, valor) {
    formulario.elements.namedItem(nombre).value = valor ?? "";
}

function formatearFecha(fecha) {
    return fecha == null ? "" : String(fecha).slice(0, 10);
}

async function cargarSocio() {
    const idNumerico = Number(idSocio);

    if (!idSocio || !Number.isSafeInteger(idNumerico) || idNumerico <= 0) {
        const error = new Error("No se indicó un id de socio válido en la URL.");
        console.error("No se pudo cargar el socio.", error);
        mostrarMensaje(error.message, "error");
        return;
    }

    try {
        const resultado = await buscarSocioPorId(idNumerico);
        socioActual = resultado?.perfil;

        if (!socioActual) {
            throw new Error("No se encontró el socio solicitado.");
        }

        const plan = formulario.elements.namedItem("id_plan");
        const idPlan = String(socioActual.id_plan ?? "");
        const existeOpcionPlan = Array.from(plan.options)
            .some(opcion => opcion.value === idPlan);

        if (!existeOpcionPlan) {
            throw new Error("El plan del socio no está disponible en el formulario.");
        }

        asignarValor("nombre", socioActual.nombre);
        asignarValor("apellido", socioActual.apellido);
        asignarValor("dni", socioActual.dni);
        asignarValor("fecha_nacimiento", formatearFecha(socioActual.fecha_nacimiento));
        asignarValor("telefono", socioActual.telefono);
        asignarValor("email", socioActual.email);
        asignarValor("redes", socioActual.redes);
        asignarValor("fecha_alta", formatearFecha(socioActual.fecha_alta));
        asignarValor("id_plan", idPlan);

        botonGuardar.disabled = false;
    } catch (error) {
        console.error("No se pudo cargar el socio.", error);
        mostrarMensaje(error.message || "No se pudo cargar el socio.", "error");
    }
}

formulario.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!socioActual) {
        return;
    }

    const datosFormulario = new FormData(formulario);
    const dni = Number(String(datosFormulario.get("dni") ?? "").replace(/\D/g, ""));
    const idPlan = Number(datosFormulario.get("id_plan"));

    if (!Number.isSafeInteger(dni) || dni <= 0) {
        mostrarMensaje("Ingresá un DNI válido.", "error");
        return;
    }

    if (!Number.isInteger(idPlan)) {
        mostrarMensaje("Seleccioná un plan válido.", "error");
        return;
    }

    const datosSocio = {
        id_plan: idPlan,
        dni,
        nombre: String(datosFormulario.get("nombre") ?? "").trim(),
        apellido: String(datosFormulario.get("apellido") ?? "").trim(),
        telefono: datosFormulario.get("telefono") || null,
        redes: datosFormulario.get("redes") || null,
        email: datosFormulario.get("email") || null,
        fecha_alta: datosFormulario.get("fecha_alta") || null,
        fecha_nacimiento: datosFormulario.get("fecha_nacimiento") || null,
        activo: socioActual.activo
    };

    botonGuardar.disabled = true;

    try {
        await actualizarSocio(idSocio, datosSocio);
        mostrarMensaje("Cambios guardados correctamente.", "mensaje");
        window.setTimeout(() => {
            window.location.href = "./socios.html";
        }, 1000);
    } catch (error) {
        console.error("No se pudieron guardar los cambios del socio.", error);
        mostrarMensaje(error.message || "No se pudieron guardar los cambios.", "error");
        botonGuardar.disabled = false;
    }
});

cargarSocio();
