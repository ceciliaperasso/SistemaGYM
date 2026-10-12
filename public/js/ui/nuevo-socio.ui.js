import { agregarSocio } from "../api/socios.js";


const formulario = document.getElementById("form__agregar_socio");

formulario.addEventListener("submit", async (event) => {
    event.preventDefault();
    console.log("hola")

    const datosSocio = {
        nombre: document.getElementById("nombre").value,
        apellido:document.getElementById("apellido").value.trim(),
        dni:document.getElementById("dni").value.trim()
    }

    agregarSocio(datosSocio);
})
