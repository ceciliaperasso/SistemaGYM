import { listarPagos } from "../api/pagos.js"

const amount = document.querySelector('div.amount')
const totalPagos = document.querySelector('span.total')
const contenedorPagos = document.querySelector('.transactions-grid')

function formatearFecha(fecha) {
    if (!fecha) return "— — —";

    return new Date(fecha).toLocaleDateString("es-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

async function cargarPagos() {
    try {
        const {total} = await listarPagos();
        const {pagos} = await listarPagos()

        pagos.sort((a, b) => new Date(b.vencimiento) - new Date(a.vencimiento));

        actualizarSummary(total);
        mostrarPagos(pagos)
    } catch(error) {
        console.error("No se pudieron cargar los pagos", error)
    }
}

function actualizarSummary(total) {
    const monto = `${Number(total[1].total_mes ?? 0).toLocaleString("es-AR", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                    })}`;
    amount.innerHTML = `$${monto}`
    totalPagos.innerHTML = `${total[0].total_pagos} pagos <br> registrados`
}

function mostrarPagos(pagos) {
    contenedorPagos.replaceChildren();


    pagos.forEach(pago => {
        contenedorPagos.appendChild(crearTarjeta(pago));
    });
}

function crearTarjeta(pago) {
    const tarjeta = document.createElement('div');
    tarjeta.classList.add('transaction-card');

    const monto = `${Number(pago.monto ?? 0).toLocaleString("es-AR", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                    })}`;

    const fecha = formatearFecha(pago.fecha)

    tarjeta.innerHTML = `
        <div class="card-left">
            <div class="icon-box">
                <i class="fa-regular fa-money-bill-1"></i>
            </div>
            <div class="user-info">
                <div class="name-row">
                <span class="name">${pago.nombre} ${pago.apellido}</span>
                <span class="badge parcial">${pago.metodo}</span>
                </div>
                <div class="details">Plan ${pago.plan}, ${fecha}</div>
            </div>
        </div>
        <div class="price">+ $${monto}</div>
    `

    return tarjeta
}

cargarPagos();