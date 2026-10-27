import { buscarSocioPorId, eliminarSocio } from "../api/socios.js";

const parametros = new URLSearchParams(window.location.search);
const id = parametros.get("id");

const elementos = {
    nombrePerfil: document.querySelector(".profile__name"),
    planPerfil: document.querySelector(".profile__plan"),
    estadoPerfil: document.querySelector(".badge"),
    dni: document.querySelector(".data-dni"),
    telefono: document.querySelector(".data-tel"),
    email: document.querySelector(".data-email"),
    tarjetaCuota: document.getElementById("card-cuota"),
    montoCuota: document.querySelector(".fee__amount"),
    vencimientoCuota: document.querySelector(".fee__date"),
    historialPagos: document.querySelector(".history"),
    botonEliminar: document.getElementById("eliminar")
};


function formatearFecha(fecha) {
    if (!fecha) return "— — —";

    return new Date(fecha).toLocaleDateString("es-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

function mostrarPerfil(socio) {
    elementos.nombrePerfil.textContent = `${socio.nombre} ${socio.apellido}`;
    elementos.planPerfil.textContent = `Plan de ${socio.plan_dias} semanales`;

    if (socio.activo == false) {
        elementos.estadoPerfil.textContent = "Inactivo";
        elementos.estadoPerfil.classList.add("badge--inactive");
    } else {
        elementos.estadoPerfil.textContent = "Activo";
        elementos.estadoPerfil.classList.add("badge--active");
    }

    elementos.dni.textContent = socio.dni == null ? ""
        : Number(socio.dni).toLocaleString("es-AR");
    elementos.telefono.textContent = socio.telefono ?? "...";
    elementos.email.textContent = socio.email ?? "...";
}

function mostrarCuota(cuotas) {
    
    if (cuotas.length === 0) {
        elementos.tarjetaCuota.innerHTML = `
            <div class="fee__head">
                <h2 class="fee__title">CUOTA ACTUAL</h2>
                <span class="badge badge--pending">Pendiente</span>
            </div>
            <h2 class="fee__mensaje">No hay cuota pendiente</h2>
        `;
        return;
    }

    const cuotaEstado = cuotas.find(cuota =>
        cuota.estado_cuota === "Vencida" || cuota.estado_cuota === "Próxima a vencer"
    );

    const monto = `$${Number(cuotaEstado?.saldo ?? 0).toLocaleString("es-AR", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                    })}`;

    elementos.montoCuota.textContent = monto;
    const fecha = formatearFecha(cuotaEstado?.vencimiento);
    elementos.vencimientoCuota.textContent = fecha;
}

function crearTarjetaPagos(pago) {
    const card = document.createElement("article");
    const monto = `${Number(pago.monto_aplicado ?? 0).toLocaleString("es-AR", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                    })}`;
    card.classList.add("card", "payment");

    card.innerHTML = `
        <div>
            <div class="payment__top">
                <span class="payment__method">${pago.metodo_pago}</span>
                <span class="tag tag--partial">Parcial</span>
            </div>
            <p class="payment__date">${formatearFecha(pago.fecha_pago)}</p>
        </div>
        <p class="payment__amount">+ $${monto}</p>
    `;

    return card;
}

function mostrarPagos(pagos) {
    if (pagos.length === 0) {
        const card = document.createElement("article");
        card.classList.add("card", "mensaje");

        card.innerHTML = `
            <div>
                <div class="payment__top">
                    <span class="payment__method">No hay pagos realizados</span>
                </div>
            </div>
        `;
        elementos.historialPagos.appendChild(card);
        return;
    }

    pagos.forEach(pago => {
        elementos.historialPagos.appendChild(crearTarjetaPagos(pago));
    });
}

export async function cargarPerfil() {
    try {
        const socio = await buscarSocioPorId(id);

        if (!socio) {
            console.error("No se encontró el socio.");
            return;
        }

        mostrarPerfil(socio.perfil);
        mostrarCuota(socio.cuotas);
        mostrarPagos(socio.pagos);
    } catch (error) {
        console.error("No se pudo cargar el perfil del socio.", error);
    }
}

elementos.botonEliminar.addEventListener('click', () => {
    const confirmar = confirm("Desea eliminar a este socio?")

    if (!confirmar) {
        return;
    } 

    eliminarSocio(id);
})

cargarPerfil();