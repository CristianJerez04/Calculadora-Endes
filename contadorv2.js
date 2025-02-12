let totalCosteGeneral = 0;

function actualizarTotalCosteGeneral() {
    let totalHabitaciones = 0;
    const habitaciones = document.querySelectorAll(".total-coste-habitacion");

    habitaciones.forEach(elem => {
        const totalHabitacion = parseFloat(elem.textContent.replace('Total: ', '').replace('€', '')) || 0;
        totalHabitaciones += totalHabitacion;
    });

    totalCosteGeneral = totalHabitaciones;
    document.getElementById("totalCoste").textContent = `Base imponible: ${totalCosteGeneral.toFixed(2)}€`;
    actualizarIva();
    actualizarTotalConIva();
}

function actualizarIva() {
    const iva = totalCosteGeneral * 0.21;
    document.getElementById("ivaCoste").textContent = `IVA (21%): ${iva.toFixed(2)}€`;
}

function actualizarTotalConIva() {
    const iva = totalCosteGeneral * 0.21;
    const totalConIva = totalCosteGeneral + iva;
    document.getElementById("totalConIva").textContent = `Total con IVA repercutido: ${totalConIva.toFixed(2)}€`;
}

function actualizarTotalCosteHabitacion(id) {
    const totalElem = document.getElementById(`totalCosteHabitacion${id}`);
    const rows = document.getElementById(`tabla${id}`).querySelectorAll('tbody tr');
    let totalHabitacion = 0;

    rows.forEach(row => {
        const coste = parseFloat(row.querySelector('.coste').textContent.replace('€', '')) || 0;
        totalHabitacion += coste;
    });

    totalElem.textContent = `Total: ${totalHabitacion.toFixed(2)}€`;
    actualizarTotalCosteGeneral();
}

function agregarHabitacion() {
    const habitacionSelect = document.getElementById("seleccionarHabitacion");
    const nombreHabitacion = habitacionSelect.options[habitacionSelect.selectedIndex].text;
    const valorHabitacion = habitacionSelect.value;

    if (!valorHabitacion) {
        alert("Por favor, selecciona una habitación.");
        return;
    }

    const contenedor = document.getElementById("habitaciones");
    const id = document.querySelectorAll(".appliance-box").length + 1;
    const div = document.createElement("div");
    div.className = "appliance-box";
    div.innerHTML = `
        <h2>${nombreHabitacion}</h2>
        <label class="texto">Precio kWh: <input class="input-field" type="number" step="0.01" id="precio${id}" value="0.15" min="0"></label>
        <h3>Electrodomésticos</h3>
        <button class="secboton" onclick="agregarElectrodomestico(${id})">Añadir Electrodoméstico</button>
        <input class="input-field" type="text" id="nombre${id}" placeholder="Nombre del electrodoméstico">
        <input class="input-field" type="number" id="potencia${id}" placeholder="Potencia (W)" step="0.01" min="0">
        <table class="appliance-table" id="tabla${id}">
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Potencia (W)</th>
                    <th>Tiempo Encendido</th>
                    <th>Coste</th>
                    <th>Acción</th>
                </tr>
            </thead>
            <tbody>
                ${obtenerElectrodomesticosPredefinidos(valorHabitacion, id)}
            </tbody>
        </table>
        <div id="totalCosteHabitacion${id}" class="total-coste-habitacion">Total: 0.00€</div>
    `;
    contenedor.appendChild(div);
    habitacionSelect.selectedIndex = 0; 

   
    const nuevaTabla = document.getElementById(`tabla${id}`).querySelector('tbody');
    nuevaTabla.querySelectorAll('tr').forEach(fila => {
        addEventListenersToRow(fila, id);
    });
}

function obtenerElectrodomesticosPredefinidos(habitacion, id) {
    const electrodomesticos = {
        cocina: [
            { nombre: "Lavadora", potencias: [1500, 2000, 2500] },
            { nombre: "Airfryer", potencias: [800, 900, 1000] },
            { nombre: "Horno", potencias: [2000, 3500, 5000] }
        ],
        salon: [
            { nombre: "Televisión", potencias: [100, 150, 200] },
            { nombre: "Lámpara", potencias: [60, 75, 100] },
            { nombre: "Altavoces", potencias: [50, 70, 90] }
        ],
        baño: [
            { nombre: "Toallero", potencias: [750, 1000, 1500] },
            { nombre: "Termo", potencias: [1500, 2000, 2500] },
            { nombre: "Lampara", potencias: [60, 75, 100] }
        ],
        dormitorio1: [
            { nombre: "Climatizador", potencias: [1000, 1500, 2000] },
            { nombre: "Ventilador", potencias: [50, 75, 100] },
            { nombre: "Lampara", potencias: [50, 70, 90] }
        ],
         dormitorio2: [
            { nombre: "Portatil", potencias: [45, 60, 75] },
            { nombre: "Humedificador", potencias: [25, 35, 50] },
            { nombre: "Calefactor", potencias: [750, 1000, 1500] }
        ],
        patio: [
            { nombre: "Parrilla electrica", potencias: [1000, 1500, 2000] },
            { nombre: "Calefactor", potencias: [800, 1200, 1500] },
            { nombre: "Luces Jardin", potencias: [10, 20, 30] }
        ],
        guardilla: [
            { nombre: "Deshumidificador", potencias: [200, 300, 400] },
            { nombre: "Ventilador techo", potencias: [50, 75, 100] },
            { nombre: "Calefactor portatil", potencias: [500, 1000, 1500] }
        ],
        sotano: [
            { nombre: "Deshumidificador", potencias: [200, 300, 400] },
            { nombre: "Congelador", potencias: [300, 400, 500] },
            { nombre: "Lampara de Pie", potencias: [50, 70, 80] }
        ],
        
    };

    if (!electrodomesticos[habitacion]) return '';

    return electrodomesticos[habitacion].map(e => `
        <tr>
            <td>${e.nombre}</td>
            <td>
                <select class="potencia-dropdown">
                    ${e.potencias.map(p => `<option value="${p}">${p}</option>`).join('')}
                </select>
            </td>
            <td class="tiempo">0s</td>
            <td class="coste">0.00€</td>
            <td>
                <button class="secboton toggle">On</button> 
                <button class="secboton eliminar">Delete</button>
                <button class="secboton acelerar" data-velocidad="1">x1</button>
            </td>
        </tr>
    `).join('');
}
function agregarElectrodomestico(id) {
    const nombre = document.getElementById(`nombre${id}`).value;
    const potencia = parseFloat(document.getElementById(`potencia${id}`).value);
    if (!nombre || isNaN(potencia) || potencia <= 0) {
        alert("Por favor, ingresa un nombre válido y una potencia positiva.");
        return;
    }

    const tabla = document.getElementById(`tabla${id}`).querySelector('tbody');
    const fila = document.createElement("tr");
    let encendido = false;
    let tiempoEncendido = 0;
    let intervalo;
    let velocidad = 1;

    fila.innerHTML = `
        <td>${nombre}</td>
        <td>
            <select class="potencia-dropdown">
                <option value="${potencia}">${potencia}</option>
            </select>
        </td>
        <td class="tiempo">0s</td>
        <td class="coste">0.00€</td>
        <td>
            <button class="secboton toggle">On</button>
            <button class="secboton eliminar">Delete</button>
            <button class="secboton acelerar" data-velocidad="1">x1</button>
        </td>
    `;

    addEventListenersToRow(fila, id);
    tabla.appendChild(fila);
    actualizarTotalCosteHabitacion(id);
}

function addEventListenersToRow(fila, id) {
    let encendido = false;
    let tiempoEncendido = 0;
    let intervalo;
    let velocidad = 1;

    const botonToggle = fila.querySelector(".toggle");
    const botonAcelerar = fila.querySelector(".acelerar");

    botonToggle.addEventListener("click", () => {
        const precioKwH = parseFloat(document.getElementById(`precio${id}`).value);
        const tiempoElem = fila.querySelector(".tiempo");
        const costeElem = fila.querySelector(".coste");
        const potenciaSeleccionada = parseFloat(fila.querySelector('.potencia-dropdown').value);

        if (!encendido) {
            let tiempoInicio = Date.now() - tiempoEncendido * 1000 / velocidad; 
            intervalo = setInterval(() => {
                let tiempoSeg = Math.floor((Date.now() - tiempoInicio) / 1000 * velocidad);
                tiempoEncendido = tiempoSeg; 
                let horas = Math.floor(tiempoSeg / 3600);
                let minutos = Math.floor((tiempoSeg % 3600) / 60);
                let segundos = tiempoSeg % 60;
                let consumoKWh = (potenciaSeleccionada / 1000) * (tiempoSeg / 3600);
                let coste = (consumoKWh * precioKwH).toFixed(2);
                tiempoElem.textContent = `${horas}h ${minutos}m ${segundos}s`;
                costeElem.textContent = `${coste}€`;
                actualizarTotalCosteHabitacion(id);
            }, 1000);
            botonToggle.textContent = "Off";
            fila.classList.add("on");
        } else {
            clearInterval(intervalo);
            botonToggle.textContent = "On";
            fila.classList.remove("on");
        }
        encendido = !encendido;
    });

    botonAcelerar.addEventListener("click", () => {
        if (!encendido) return;
        switch (velocidad) {
            case 1:
                velocidad = 2;
                botonAcelerar.textContent = "x2";
                break;
            case 2:
                velocidad = 5;
                botonAcelerar.textContent = "x5";
                break;
            case 5:
                velocidad = 10;
                botonAcelerar.textContent = "x10";
                break;
            case 10:
                velocidad = 30;
                botonAcelerar.textContent = "x30";
                break;
            case 30:
                velocidad = 60;
                botonAcelerar.textContent = "x60";
                break;
            case 60:
                velocidad = 90;
                botonAcelerar.textContent = "x90";
                break;
            default:
                velocidad = 1;
                botonAcelerar.textContent = "x1";
        }
        clearInterval(intervalo); 
        botonToggle.click(); 
        botonToggle.click(); 
    });

    const botonEliminar = fila.querySelector(".eliminar");
    botonEliminar.addEventListener("click", () => {
        fila.remove();
        actualizarTotalCosteHabitacion(id);
    });
}

function resetearTotalGeneral() {
    totalCosteGeneral = 0;
    document.getElementById("totalCoste").textContent = `Importe Total Facturación: 0.00 €`;
    document.getElementById("ivaCoste").textContent = `IVA (21%): 0.00 €`;
    document.getElementById("totalConIva").textContent = `Total con IVA: 0.00 €`;
}


document.querySelectorAll('tbody tr').forEach(fila => {
    const id = fila.closest('table').id.replace('tabla', '');
    addEventListenersToRow(fila, id);
});
