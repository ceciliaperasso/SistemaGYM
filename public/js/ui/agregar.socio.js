import { agregarSocio } from "../api/socios.js";


const formulario = document.getElementById("form__agregar_socio");

formulario.addEventListener("submit", async (event) => {
    event.preventDefault();

    const datos = Object.fromEntries(new FormData(formulario));
    console.log(datos);
    agregarSocio(datos);

    try {
        await agregarSocio(datos);
        formulario.reset();
        window.alert("Socio agregado correctamente.")
    } catch (error) {
        mostrarMensaje(error.message, 'error');
        window.alert("No se pudo agregar el socio ¿ por qué? ADIVINALO ")
    }
})

function mostrarMensaje(texto, clase) {
    const mensaje = document.createElement('p');
    if (clase) mensaje.classList.add(clase);
    mensaje.textContent = texto;
    formulario.appendChild(mensaje);
}