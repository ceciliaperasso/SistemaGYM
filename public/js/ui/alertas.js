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
                    <svg><use href="#i-bell"/></svg>
                    <span class="btn-texto">Notificar</span>
                </button>
                <button class="btn" data-accion="registrar" data-id-cuota="${alerta.id_cuota}">
                    <svg><use href="#i-clip"/></svg>
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
                <svg><use href="#i-bell"/></svg>
                <span class="btn-texto">Notificar</span>
            </button>
            <button class="btn" data-accion="registrar" data-id-cuota="${alerta.id_cuota}">
                <svg><use href="#i-clip"/></svg>
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