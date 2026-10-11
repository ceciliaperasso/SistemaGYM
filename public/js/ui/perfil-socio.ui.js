import { buscarSocioPorId } from "../api/socios.js";

const parametros = new URLSearchParams(window.location.search);
const id = parametros.get('id');

export async function cargarPerfil() {
    try {
        const socio = await buscarSocioPorId(id);

        if (!socio) {
            console.error('No se encontró el socio.');
            return;
        }
        mostrarPerfil(socio.perfil);
        mostrarCuota(socio.cuotas);
    }

    catch (error) {
        console.error('No se pudo cargar el perfil del socio.', error);
    }
}

function mostrarPerfil(socio) {
    document.querySelector(".profile__name").textContent = 
        `${socio.nombre} ${socio.apellido}`;
    document.querySelector(".profile__plan").textContent =
        `Plan de ${socio.plan_dias} semanales`;
    const badge = document.querySelector(".badge");

    if(socio.activo == false) {
        badge.textContent = `Inactivo`;
        badge.classList.add("badge--inactive");
    } else {
        badge.textContent = `Activo`;
        badge.classList.add("badge--active");
    }
}

function mostrarCuota(cuota){
    const card = document.getElementById("card-cuota");
    if(cuota.length === 0) {
        card.innerHTML = `
            <div class="fee__head">
                <h2 class="fee__title">CUOTA ACTUAL</h2>
                <span class="badge badge--pending">Pendiente</span>
            </div>
            <h2 class="fee__mensaje">No hay cuota pendiente</h2>
        `
        console.log("no hay cuotas") 
    }
}