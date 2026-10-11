import { buscarSociosPorTexto, listarSocios } from "../api/socios.js";

const contenedorTarjetas = document.querySelector('.tarjetas-container');
const buscador = document.getElementById('buscador');
const botonesFiltro = document.querySelectorAll('.filtro-btn');

let sociosCargados = [];
let textoBusqueda = "";
let filtroActivo = "todos";
let timeoutId;
let solicitudActual = 0;

export function mostrarSocios(socios) {
    contenedorTarjetas.innerHTML = '';

    if (socios.length === 0) {
        mostrarEstadoVacio();
        return;
    }

    socios.forEach(socio => {
        contenedorTarjetas.appendChild(crearTarjeta(socio));
    });
}

function mostrarError(mensaje) {
    const mensajeError = document.createElement('p');
    mensajeError.classList.add('error');
    mensajeError.textContent = mensaje;
    contenedorTarjetas.replaceChildren(mensajeError);
}

function mostrarEstadoVacio() {
    const mensaje = document.createElement('p');
    mensaje.textContent = 'No se encontraron socios con los criterios seleccionados.';
    contenedorTarjetas.replaceChildren(mensaje);
}

export function crearTarjeta(socio) {
    const card = document.createElement('div');
    card.classList.add(`tarjeta-socio`);
    const estadoClase = (socio.estado_cuota ?? "").toLowerCase().replaceAll(' ', '-')

    if (estadoClase) {
        card.classList.add(estadoClase);
    }

    const top = document.createElement('div');
    top.classList.add("tarjeta-top");
    top.innerHTML = `
        <div class="info-usuario">
            <svg class="avatar" width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.2857 14.2857C12.3214 14.2857 10.6399 13.5863 9.24107 12.1875C7.84226 10.7887 7.14286 9.10714 7.14286 7.14286C7.14286 5.17857 7.84226 3.49702 9.24107 2.09821C10.6399 0.699405 12.3214 0 14.2857 0C16.25 0 17.9315 0.699405 19.3304 2.09821C20.7292 3.49702 21.4286 5.17857 21.4286 7.14286C21.4286 9.10714 20.7292 10.7887 19.3304 12.1875C17.9315 13.5863 16.25 14.2857 14.2857 14.2857ZM0 25V23.5714C0 22.5595 0.260714 21.6298 0.782143 20.7821C1.30357 19.9345 1.99524 19.2869 2.85714 18.8393C4.70238 17.9167 6.57738 17.225 8.48214 16.7643C10.3869 16.3036 12.3214 16.0726 14.2857 16.0714C16.25 16.0702 18.1845 16.3012 20.0893 16.7643C21.994 17.2274 23.869 17.919 25.7143 18.8393C26.5774 19.2857 27.2696 19.9333 27.7911 20.7821C28.3125 21.6309 28.5726 22.5607 28.5714 23.5714V25C28.5714 25.9821 28.222 26.8232 27.5232 27.5232C26.8244 28.2232 25.9833 28.5726 25 28.5714H3.57143C2.58929 28.5714 1.74881 28.222 1.05 27.5232C0.351191 26.8244 0.00119048 25.9833 0 25Z" fill="currentColor" fill-opacity="0.8"/>
            </svg>

            <div class="datos-personales">
                <h3>${socio.nombre} ${socio.apellido}</h3>
                <p class="dni">DNI: ${socio.dni}</p>
            </div>
        </div>
        <span class="flecha">
            <button class="flecha-perfil">
                <svg width="11" height="19" viewBox="0 0 11 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.7129 9.5L0.362903 2.15C0.112903 1.9 -0.00793011 1.60417 0.000403226 1.2625C0.00873656 0.920833 0.137903 0.625 0.387903 0.375C0.637903 0.125 0.933737 0 1.2754 0C1.61707 0 1.9129 0.125 2.1629 0.375L9.8379 8.075C10.0379 8.275 10.1879 8.5 10.2879 8.75C10.3879 9 10.4379 9.25 10.4379 9.5C10.4379 9.75 10.3879 10 10.2879 10.25C10.1879 10.5 10.0379 10.725 9.8379 10.925L2.1379 18.625C1.8879 18.875 1.59624 18.9958 1.2629 18.9875C0.92957 18.9792 0.637903 18.85 0.387903 18.6C0.137903 18.35 0.0129032 18.0542 0.0129032 17.7125C0.0129032 17.3708 0.137903 17.075 0.387903 16.825L7.7129 9.5Z" fill="currentColor"/>
                </svg>
            </button>
        </span>
    `


    const bottom = document.createElement('div');
    bottom.classList.add("tarjeta-bottom");

    const fecha = formatearFecha(socio.vencimiento);

    bottom.innerHTML = `
        <div class="detalles-vencimiento">
            <p class="etiqueta-estado">${socio.estado_cuota}</p>
            <p class="fecha">
                <svg width="11" height="12" viewBox="0 0 11 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.16667 11.6667C0.845833 11.6667 0.571278 11.5525 0.343 11.3243C0.114722 11.096 0.000388889 10.8212 0 10.5V2.33334C0 2.0125 0.114333 1.73795 0.343 1.50967C0.571667 1.28139 0.846222 1.16706 1.16667 1.16667H1.75V0.583335C1.75 0.418058 1.806 0.279613 1.918 0.168002C2.03 0.056391 2.16844 0.0003909 2.33333 2.01149e-06C2.49822 -0.000386877 2.63686 0.0556132 2.74925 0.168002C2.86164 0.280391 2.91744 0.418835 2.91667 0.583335V1.16667H7.58333V0.583335C7.58333 0.418058 7.63933 0.279613 7.75133 0.168002C7.86333 0.056391 8.00178 0.0003909 8.16667 2.01149e-06C8.33156 -0.000386877 8.47019 0.0556132 8.58258 0.168002C8.69497 0.280391 8.75078 0.418835 8.75 0.583335V1.16667H9.33333C9.65417 1.16667 9.92892 1.281 10.1576 1.50967C10.3863 1.73834 10.5004 2.01289 10.5 2.33334V10.5C10.5 10.8208 10.3859 11.0956 10.1576 11.3243C9.92931 11.5529 9.65456 11.6671 9.33333 11.6667H1.16667ZM1.16667 10.5H9.33333V4.66667H1.16667V10.5ZM1.16667 3.5H9.33333V2.33334H1.16667V3.5ZM5.25 7C5.08472 7 4.94628 6.944 4.83467 6.832C4.72306 6.72 4.66706 6.58156 4.66667 6.41667C4.66628 6.25178 4.72228 6.11334 4.83467 6.00134C4.94706 5.88934 5.0855 5.83334 5.25 5.83334C5.4145 5.83334 5.55314 5.88934 5.66592 6.00134C5.7787 6.11334 5.8345 6.25178 5.83333 6.41667C5.83217 6.58156 5.77617 6.7202 5.66533 6.83259C5.5545 6.94497 5.41606 7.00078 5.25 7ZM2.91667 7C2.75139 7 2.61294 6.944 2.50133 6.832C2.38972 6.72 2.33372 6.58156 2.33333 6.41667C2.33294 6.25178 2.38894 6.11334 2.50133 6.00134C2.61372 5.88934 2.75217 5.83334 2.91667 5.83334C3.08117 5.83334 3.21981 5.88934 3.33258 6.00134C3.44536 6.11334 3.50117 6.25178 3.5 6.41667C3.49883 6.58156 3.44283 6.7202 3.332 6.83259C3.22117 6.94497 3.08272 7.00078 2.91667 7ZM7.58333 7C7.41806 7 7.27961 6.944 7.168 6.832C7.05639 6.72 7.00039 6.58156 7 6.41667C6.99961 6.25178 7.05561 6.11334 7.168 6.00134C7.28039 5.88934 7.41883 5.83334 7.58333 5.83334C7.74783 5.83334 7.88647 5.88934 7.99925 6.00134C8.11203 6.11334 8.16783 6.25178 8.16667 6.41667C8.1655 6.58156 8.1095 6.7202 7.99867 6.83259C7.88783 6.94497 7.74939 7.00078 7.58333 7ZM5.25 9.33334C5.08472 9.33334 4.94628 9.27734 4.83467 9.16534C4.72306 9.05334 4.66706 8.91489 4.66667 8.75C4.66628 8.58511 4.72228 8.44667 4.83467 8.33467C4.94706 8.22267 5.0855 8.16667 5.25 8.16667C5.4145 8.16667 5.55314 8.22267 5.66592 8.33467C5.7787 8.44667 5.8345 8.58511 5.83333 8.75C5.83217 8.91489 5.77617 9.05353 5.66533 9.16592C5.5545 9.27831 5.41606 9.33411 5.25 9.33334ZM2.91667 9.33334C2.75139 9.33334 2.61294 9.27734 2.50133 9.16534C2.38972 9.05334 2.33372 8.91489 2.33333 8.75C2.33294 8.58511 2.38894 8.44667 2.50133 8.33467C2.61372 8.22267 2.75217 8.16667 2.91667 8.16667C3.08117 8.16667 3.21981 8.22267 3.33258 8.33467C3.44536 8.44667 3.50117 8.58511 3.5 8.75C3.49883 8.91489 3.44283 9.05353 3.332 9.16592C3.22117 9.27831 3.08272 9.33411 2.91667 9.33334ZM7.58333 9.33334C7.41806 9.33334 7.27961 9.27734 7.168 9.16534C7.05639 9.05334 7.00039 8.91489 7 8.75C6.99961 8.58511 7.05561 8.44667 7.168 8.33467C7.28039 8.22267 7.41883 8.16667 7.58333 8.16667C7.74783 8.16667 7.88647 8.22267 7.99925 8.33467C8.11203 8.44667 8.16783 8.58511 8.16667 8.75C8.1655 8.91489 8.1095 9.05353 7.99867 9.16592C7.88783 9.27831 7.74939 9.33411 7.58333 9.33334Z" fill="currentColor"/>
                </svg>
                ${fecha}</p> 
        </div>
        <div class="detalles-plan">
            <p class="tipo-plan">Plan: ${socio.nombre_plan}</p>
            <p class="precio">$${(socio.monto_a_pagar ?? 0).toLocaleString("es-AR", { 
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
                useGrouping: true
            })}</p>
        </div>
    `

    card.appendChild(top);
    card.appendChild(bottom)
    
    const botonFlecha = card.querySelector('.flecha-perfil')
    botonFlecha.addEventListener('click', () => {
        window.location.href = `perfil-socio.html?id=${socio.id_socios}`;
    });

    return card
}

function formatearFecha(fecha) {
    if (!fecha) return "— — —";

    return new Date(fecha).toLocaleDateString("es-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

function filtrarSocios() {
    if (filtroActivo === "todos") {
        return sociosCargados;
    }

    return sociosCargados.filter(socio => {
        const estado = (socio.estado_cuota ?? "").toLowerCase();

        if (filtroActivo === "por-vencer") {
            return estado === "próxima a vencer";
        }
        if (filtroActivo === "deudores") {
            return estado === "vencida";
        }
        if (filtroActivo === "activos") {
            return ["al día", "próxima a vencer", "pagada"].includes(estado);
        }

        return true;
    });
}

function actualizarVista() {
    mostrarSocios(filtrarSocios());
}

export async function mostrarTarjetas() {
    const solicitud = ++solicitudActual;

    try {
        const socios = await listarSocios();
        if (solicitud === solicitudActual) {
            sociosCargados = socios;
            actualizarVista();
        }
    } catch (error) {
        console.error('No se pudieron cargar los socios.', error);
        if (solicitud === solicitudActual) {
            mostrarError(error instanceof Error ? error.message : 'No se pudieron cargar los socios.');
        }
    }
}

async function buscarSocios(texto) {
    const solicitud = ++solicitudActual;

    try {
        const socios = await buscarSociosPorTexto(texto);
        if (solicitud === solicitudActual) {
            sociosCargados = socios;
            actualizarVista();
        }
    } catch (error) {
        console.error('No se pudieron buscar los socios.', error);
        if (solicitud === solicitudActual) {
            mostrarError(error instanceof Error ? error.message : 'Ocurrió un error al buscar.');
        }
    }
}

buscador.addEventListener('input', () => {
    textoBusqueda = buscador.value.trim();
    clearTimeout(timeoutId);

    if (!textoBusqueda) {
        mostrarTarjetas();
        return;
    }

    solicitudActual++;
    timeoutId = setTimeout(() => buscarSocios(textoBusqueda), 300);
});

botonesFiltro.forEach(boton => {
    boton.addEventListener('click', () => {
        if (boton.classList.contains('fil-porvencer')) {
            filtroActivo = "por-vencer";
        } else if (boton.classList.contains('fil-deudores')) {
            filtroActivo = "deudores";
        } else if (boton.classList.contains('fil-activos')) {
            filtroActivo = "activos";
        } else {
            filtroActivo = "todos";
        }

        botonesFiltro.forEach(opcion => 
            opcion.classList.toggle('activo', opcion === boton)
        );
        actualizarVista();
    });
});

