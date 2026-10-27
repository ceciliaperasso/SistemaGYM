import { listarAlertas } from "../api/alertas.js";

const contenedorHoy = document.getElementById('alertas-hoy');
const contenedorAnteriores = document.getElementById('alertas-anteriores');

function mostrarMensaje(texto, clase) {
    const mensaje = document.createElement('p');
    if (clase) mensaje.classList.add(clase);
    mensaje.textContent = texto;
    contenedorHoy.replaceChildren();
    contenedorAnteriores.replaceChildren(mensaje);
}

function formatearDni(dni) {
    if (dni == null) return "";
    return Number(dni).toLocaleString("es-AR");
}

function formatearMonto(valor) {
    if (valor == null) return "";
    return `$${Number(valor).toLocaleString("es-AR", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    })}`;
}

function crearTarjetaHoy(alerta) {
    const card = document.createElement('section');
    card.classList.add('alert-card', 'alert-card--today');

    card.innerHTML = `
        <span class="today-label">HOY</span>
        <div class="display">
            <div class="alert-card__row">
                <div>
                    <p class="name">${alerta.nombre} ${alerta.apellido}</p>
                    <p class="dni">DNI: ${formatearDni(alerta.dni)}</p>
                </div>
                <p class="amount">${formatearMonto(alerta.monto)}</p>
            </div>
            <div class="actions">
                <button class="btn btn-secundario" data-accion="notificar" data-id-cuota="${alerta.id_cuota}">
                    <i class="fa-solid fa-bell"></i>
                    <span class="btn-texto">Notificar</span>
                </button>
                <button class="btn" data-accion="registrar" data-id-cuota="${alerta.id_cuota}">
                    <i class="fa-solid fa-clipboard-check"></i>
                    <span class="btn-texto">Registrar</span>
                </button>
            </div>
        </div>
    `;

    return card;
}
function crearTarjetaAnterior(alerta) {
    const card = document.createElement('article');
    card.classList.add('alert-card');

    card.innerHTML = `
        <div class="alert-card__row">
            <div>
                <div class="name-line">
                    <p class="name">${alerta.nombre} ${alerta.apellido}</p>
                    <span class="badge badge--overdue">Vencido</span>
                </div>
                <p class="dni">DNI: ${formatearDni(alerta.dni)}</p>
            </div>
            <p class="amount">${formatearMonto(alerta.monto)}</p>
        </div>
        <div class="actions">
            <button class="btn btn-secundario" data-accion="notificar" data-id-cuota="${alerta.id_cuota}">
                <svg width="15" height="19" viewBox="0 0 15 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 15.5833V13.75H1.83333V7.33333C1.83333 6.06528 2.21528 4.9387 2.97917 3.95359C3.74306 2.96847 4.73611 2.32284 5.95833 2.01667V1.375C5.95833 0.993058 6.09217 0.668558 6.35983 0.401502C6.6275 0.134446 6.952 0.000613194 7.33333 2.08333e-06C7.71467 -0.000609028 8.03947 0.133224 8.30775 0.401502C8.57603 0.66978 8.70956 0.99428 8.70833 1.375V2.01667C9.93056 2.32222 10.9236 2.96786 11.6875 3.95359C12.4514 4.93931 12.8333 6.06589 12.8333 7.33333V13.75H14.6667V15.5833H0ZM7.33333 18.3333C6.82917 18.3333 6.39772 18.154 6.039 17.7953C5.68028 17.4365 5.50061 17.0048 5.5 16.5H9.16667C9.16667 17.0042 8.98731 17.4359 8.62858 17.7953C8.26986 18.1546 7.83811 18.3339 7.33333 18.3333ZM3.66667 13.75H11V7.33333C11 6.325 10.641 5.46181 9.92292 4.74375C9.20486 4.0257 8.34167 3.66667 7.33333 3.66667C6.325 3.66667 5.46181 4.0257 4.74375 4.74375C4.02569 5.46181 3.66667 6.325 3.66667 7.33333V13.75Z" fill="#E5E7EA"/>
                </svg>
                <span class="btn-texto">Notificar</span>
            </button>
            <button class="btn" data-accion="registrar" data-id-cuota="${alerta.id_cuota}">
                <svg width="17" height="19" viewBox="0 0 17 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.83333 18.3333C1.32917 18.3333 0.897722 18.154 0.539 17.7952C0.180278 17.4365 0.000611111 17.0048 0 16.5V3.66667C0 3.1625 0.179667 2.73106 0.539 2.37233C0.898333 2.01361 1.32978 1.83394 1.83333 1.83333H5.68333C5.88194 1.28333 6.21439 0.840278 6.68067 0.504167C7.14694 0.168056 7.67006 0 8.25 0C8.82994 0 9.35336 0.168056 9.82025 0.504167C10.2871 0.840278 10.6193 1.28333 10.8167 1.83333H14.6667C15.1708 1.83333 15.6026 2.013 15.9619 2.37233C16.3213 2.73167 16.5006 3.16311 16.5 3.66667V16.5C16.5 17.0042 16.3206 17.4359 15.9619 17.7952C15.6032 18.1546 15.1714 18.3339 14.6667 18.3333H1.83333ZM1.83333 16.5H14.6667V3.66667H1.83333V16.5ZM4.58333 14.6667H9.16667C9.42639 14.6667 9.64425 14.5787 9.82025 14.4027C9.99625 14.2267 10.0839 14.0091 10.0833 13.75C10.0827 13.4909 9.99472 13.2733 9.81933 13.0973C9.64394 12.9213 9.42639 12.8333 9.16667 12.8333H4.58333C4.32361 12.8333 4.10606 12.9213 3.93067 13.0973C3.75528 13.2733 3.66728 13.4909 3.66667 13.75C3.66606 14.0091 3.75406 14.227 3.93067 14.4036C4.10728 14.5802 4.32483 14.6679 4.58333 14.6667ZM4.58333 11H11.9167C12.1764 11 12.3942 10.912 12.5702 10.736C12.7463 10.56 12.8339 10.3424 12.8333 10.0833C12.8327 9.82422 12.7447 9.60667 12.5693 9.43067C12.3939 9.25467 12.1764 9.16667 11.9167 9.16667H4.58333C4.32361 9.16667 4.10606 9.25467 3.93067 9.43067C3.75528 9.60667 3.66728 9.82422 3.66667 10.0833C3.66606 10.3424 3.75406 10.5603 3.93067 10.7369C4.10728 10.9135 4.32483 11.0012 4.58333 11ZM4.58333 7.33333H11.9167C12.1764 7.33333 12.3942 7.24533 12.5702 7.06933C12.7463 6.89333 12.8339 6.67578 12.8333 6.41667C12.8327 6.15756 12.7447 5.94 12.5693 5.764C12.3939 5.588 12.1764 5.5 11.9167 5.5H4.58333C4.32361 5.5 4.10606 5.588 3.93067 5.764C3.75528 5.94 3.66728 6.15756 3.66667 6.41667C3.66606 6.67578 3.75406 6.89364 3.93067 7.07025C4.10728 7.24686 4.32483 7.33456 4.58333 7.33333ZM8.25 2.97917C8.44861 2.97917 8.613 2.91408 8.74317 2.78392C8.87333 2.65375 8.93811 2.48967 8.9375 2.29167C8.93689 2.09367 8.87181 1.92958 8.74225 1.79942C8.61269 1.66925 8.44861 1.60417 8.25 1.60417C8.05139 1.60417 7.88731 1.66925 7.75775 1.79942C7.62819 1.92958 7.56311 2.09367 7.5625 2.29167C7.56189 2.48967 7.62697 2.65406 7.75775 2.78483C7.88853 2.91561 8.05261 2.98039 8.25 2.97917Z" fill="#E5E7EA"/>
                </svg>

                <span class="btn-texto">Registrar</span>
            </button>
        </div>
    `;

    return card;
}


function mostrarNotificaciones(alertas) {
  if (alertas.length === 0) {
        mostrarMensaje('No hay notificaciones pendientes.');
        return;
    }

    const hoy = new Date().toLocaleDateString("es-AR");
    let ultimaFecha = "";
    let lista;

    contenedorHoy.replaceChildren();
    contenedorAnteriores.replaceChildren();

    alertas.forEach(alerta => {
        const fecha = new Date(alerta.vencimiento).toLocaleDateString("es-AR");

        // Las de hoy van a su propia sección
        if (fecha === hoy) {
            contenedorHoy.appendChild(crearTarjetaHoy(alerta));
            return;
        }

        // Las anteriores se agrupan por día: bloque nuevo cuando cambia la fecha
        if (fecha !== ultimaFecha) {
            const dia = document.createElement('div');
            dia.classList.add('alert-card-day');

            const titulo = document.createElement('h2');
            titulo.classList.add('section-date');
            titulo.textContent = new Date(alerta.vencimiento)
                .toLocaleDateString("es-AR", { day: "numeric", month: "long" });

            lista = document.createElement('div');
            lista.classList.add('list');

            dia.append(titulo, lista);
            contenedorAnteriores.appendChild(dia);
            ultimaFecha = fecha;
        }

        lista.appendChild(crearTarjetaAnterior(alerta));
    });
}

async function cargarAlertas() {
    try {
        const { alertas } = await listarAlertas();

        // Más recientes primero (las de hoy quedan arriba)
        alertas.sort((a, b) => new Date(b.vencimiento) - new Date(a.vencimiento));

        mostrarNotificaciones(alertas);
    } catch (error) {
        console.error('No se pudieron cargar las alertas.', error);
        mostrarMensaje('No se pudieron cargar las notificaciones.', 'error');
    }
}

cargarAlertas()