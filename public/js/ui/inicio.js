import { listarAlertas } from "../api/alertas.js"
import { listarPagos } from "../api/pagos.js"
import { listarSocios } from "../api/socios.js"

const amount = document.querySelector('.income-amount')
const alertaContenedor = document.querySelector('section.alertas')
const boton = document.createElement('a');

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

async function cargarDatos() {
    try {
        const {total}= await listarPagos()
        const socios = await listarSocios()
        const { alertas } = await listarAlertas();

        alertas.sort((a, b) => new Date(b.vencimiento) - new Date(a.vencimiento));

        
        ingresosMes(total);
        resumenMes(total, socios)
        mostrarAlertas(alertas)

    } catch (error) {
        console.error("No se pudieron cargar los datos", error)
    }
}

function mostrarAlertas(alertas) {
    alertaContenedor.replaceChildren()
    const titulo = document.createElement('div');
    titulo.classList.add('alertas-title');
    titulo.textContent = 'Alertas de deuda';
    alertaContenedor.appendChild(titulo);

    alertas.slice(0, 6).forEach(alerta => {
    alertaContenedor.appendChild(crearTarjeta(alerta));
    });

    
    boton.classList.add('btn', 'btn-secundario');
    boton.textContent = 'Ver más';
    alertaContenedor.appendChild(boton);

};



function crearTarjeta(alerta) {
    const tarjeta = document.createElement('article');
    tarjeta.classList.add('debt-card');

    const dni = formatearDni(alerta.dni)
    const monto = formatearMonto(alerta.monto)

    tarjeta.innerHTML = `
        <div class="debt-info">
            <div class="debt-name-row">
                <span class="debt-name">${alerta.nombre} ${alerta.apellido}</span>
                <span class="badge">${alerta.estado}</span>
            </div>
            <span class="debt-dni">DNI: ${dni}</span>
        </div>
        <span class="debt-amount">${monto}</span>
        <svg class="debt-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
        </svg>
    `

    return tarjeta
}

function ingresosMes(total) {
    const monto = formatearMonto(total[1].total_mes)
    amount.innerHTML = `${monto}`
}

function resumenMes(total, socios) {
    const numGreen = document.querySelector('.num.green');
    numGreen.innerHTML = `${total[0].total_pagos}`

    document.querySelector('.num.blue').textContent = socios.length;
    document.querySelector('.num.yellow').textContent =  socios.filter(s => s.activo === true).length;
    document.querySelector('.num.green').textContent =  total[0].total_pagos;
    document.querySelector('.num.red').textContent =  socios.filter(s => s.estado_cuota === "Vencida").length;
}

boton.addEventListener('click', () => {
    window.location.href = './alertas.html';
});

cargarDatos()