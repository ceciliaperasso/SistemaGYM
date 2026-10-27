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
    elementos.vencimientoCuota.innerHTML = `
        <svg width="11" height="12" viewBox="0 0 11 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.16667 11.6667C0.845833 11.6667 0.571278 11.5525 0.343 11.3243C0.114722 11.096 0.000388889 10.8212 0 10.5V2.33334C0 2.0125 0.114333 1.73795 0.343 1.50967C0.571667 1.28139 0.846222 1.16706 1.16667 1.16667H1.75V0.583335C1.75 0.418058 1.806 0.279613 1.918 0.168002C2.03 0.056391 2.16844 0.0003909 2.33333 2.01149e-06C2.49822 -0.000386877 2.63686 0.0556132 2.74925 0.168002C2.86164 0.280391 2.91744 0.418835 2.91667 0.583335V1.16667H7.58333V0.583335C7.58333 0.418058 7.63933 0.279613 7.75133 0.168002C7.86333 0.056391 8.00178 0.0003909 8.16667 2.01149e-06C8.33156 -0.000386877 8.47019 0.0556132 8.58258 0.168002C8.69497 0.280391 8.75078 0.418835 8.75 0.583335V1.16667H9.33333C9.65417 1.16667 9.92892 1.281 10.1576 1.50967C10.3863 1.73834 10.5004 2.01289 10.5 2.33334V10.5C10.5 10.8208 10.3859 11.0956 10.1576 11.3243C9.92931 11.5529 9.65456 11.6671 9.33333 11.6667H1.16667ZM1.16667 10.5H9.33333V4.66667H1.16667V10.5ZM1.16667 3.5H9.33333V2.33334H1.16667V3.5ZM5.25 7C5.08472 7 4.94628 6.944 4.83467 6.832C4.72306 6.72 4.66706 6.58156 4.66667 6.41667C4.66628 6.25178 4.72228 6.11334 4.83467 6.00134C4.94706 5.88934 5.0855 5.83334 5.25 5.83334C5.4145 5.83334 5.55314 5.88934 5.66592 6.00134C5.7787 6.11334 5.8345 6.25178 5.83333 6.41667C5.83217 6.58156 5.77617 6.7202 5.66533 6.83259C5.5545 6.94497 5.41606 7.00078 5.25 7ZM2.91667 7C2.75139 7 2.61294 6.944 2.50133 6.832C2.38972 6.72 2.33372 6.58156 2.33333 6.41667C2.33294 6.25178 2.38894 6.11334 2.50133 6.00134C2.61372 5.88934 2.75217 5.83334 2.91667 5.83334C3.08117 5.83334 3.21981 5.88934 3.33258 6.00134C3.44536 6.11334 3.50117 6.25178 3.5 6.41667C3.49883 6.58156 3.44283 6.7202 3.332 6.83259C3.22117 6.94497 3.08272 7.00078 2.91667 7ZM7.58333 7C7.41806 7 7.27961 6.944 7.168 6.832C7.05639 6.72 7.00039 6.58156 7 6.41667C6.99961 6.25178 7.05561 6.11334 7.168 6.00134C7.28039 5.88934 7.41883 5.83334 7.58333 5.83334C7.74783 5.83334 7.88647 5.88934 7.99925 6.00134C8.11203 6.11334 8.16783 6.25178 8.16667 6.41667C8.1655 6.58156 8.1095 6.7202 7.99867 6.83259C7.88783 6.94497 7.74939 7.00078 7.58333 7ZM5.25 9.33334C5.08472 9.33334 4.94628 9.27734 4.83467 9.16534C4.72306 9.05334 4.66706 8.91489 4.66667 8.75C4.66628 8.58511 4.72228 8.44667 4.83467 8.33467C4.94706 8.22267 5.0855 8.16667 5.25 8.16667C5.4145 8.16667 5.55314 8.22267 5.66592 8.33467C5.7787 8.44667 5.8345 8.58511 5.83333 8.75C5.83217 8.91489 5.77617 9.05353 5.66533 9.16592C5.5545 9.27831 5.41606 9.33411 5.25 9.33334ZM2.91667 9.33334C2.75139 9.33334 2.61294 9.27734 2.50133 9.16534C2.38972 9.05334 2.33372 8.91489 2.33333 8.75C2.33294 8.58511 2.38894 8.44667 2.50133 8.33467C2.61372 8.22267 2.75217 8.16667 2.91667 8.16667C3.08117 8.16667 3.21981 8.22267 3.33258 8.33467C3.44536 8.44667 3.50117 8.58511 3.5 8.75C3.49883 8.91489 3.44283 9.05353 3.332 9.16592C3.22117 9.27831 3.08272 9.33411 2.91667 9.33334ZM7.58333 9.33334C7.41806 9.33334 7.27961 9.27734 7.168 9.16534C7.05639 9.05334 7.00039 8.91489 7 8.75C6.99961 8.58511 7.05561 8.44667 7.168 8.33467C7.28039 8.22267 7.41883 8.16667 7.58333 8.16667C7.74783 8.16667 7.88647 8.22267 7.99925 8.33467C8.11203 8.44667 8.16783 8.58511 8.16667 8.75C8.1655 8.91489 8.1095 9.05353 7.99867 9.16592C7.88783 9.27831 7.74939 9.33411 7.58333 9.33334Z" fill="currentColor"/>
        </svg> ${fecha}`;
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