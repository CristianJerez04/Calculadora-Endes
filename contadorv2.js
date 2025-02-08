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
    const nombreHabitacion = prompt("Ingrese el nombre de la habitación:");
    if (!nombreHabitacion) return;

    const contenedor = document.getElementById("habitaciones");
    const id = document.querySelectorAll(".appliance-box").length + 1;
    const div = document.createElement("div");
    div.className = "appliance-box";
    div.innerHTML = `
        <h2>${nombreHabitacion}</h2>
        <label class="texto">Precio kWh: <input class="input-field" type="number" step="0.01" id="precio${id}" value="0.15"></label>
        <h3>Agregar Electrodoméstico</h3>
        <label class="texto">Nombre: <input class="input-field" type="text" id="nombre${id}"></label>
        <label class="texto">Potencia (W): <input class="input-field" type="number" id="potencia${id}"></label>
        <button class="submit-button" onclick="agregarElectrodomestico(${id})">Añadir</button>
        <h3>Electrodomésticos</h3>
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
            <tbody></tbody>
        </table>
        <div id="totalCosteHabitacion${id}" class="total-coste-habitacion">Total: 0.00€</div>
    `;
    contenedor.appendChild(div);
}

function agregarElectrodomestico(id) {
    const nombre = document.getElementById(`nombre${id}`).value;
    const potencia = parseFloat(document.getElementById(`potencia${id}`).value);
    if (!nombre || isNaN(potencia) || potencia <= 0) return;

    const tabla = document.getElementById(`tabla${id}`).querySelector('tbody');
    const fila = document.createElement("tr");
    let encendido = false;
    let tiempoEncendido = 0;
    let intervalo;

    fila.innerHTML = `
        <td>${nombre}</td>
        <td>${potencia}</td>
        <td class="tiempo">0s</td>
        <td class="coste">0.00€</td>
        <td><button class="secboton toggle">On</button> <button class="secboton eliminar">Delete</button></td>
    `;

    const botonToggle = fila.querySelector(".toggle");
    botonToggle.addEventListener("click", () => {
        const precioKwH = parseFloat(document.getElementById(`precio${id}`).value);
        const tiempoElem = fila.querySelector(".tiempo");
        const costeElem = fila.querySelector(".coste");

        if (!encendido) {
            let tiempoInicio = Date.now() - tiempoEncendido * 1000; // Adjust for accumulated time
            intervalo = setInterval(() => {
                let tiempoSeg = Math.floor((Date.now() - tiempoInicio) / 1000);
                tiempoEncendido = tiempoSeg; // Store accumulated time
                let consumoKWh = (potencia / 1000) * (tiempoSeg / 3600);
                let coste = (consumoKWh * precioKwH).toFixed(2);
                tiempoElem.textContent = `${tiempoSeg}s`;
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

    const botonEliminar = fila.querySelector(".eliminar");
    botonEliminar.addEventListener("click", () => {
        fila.remove();
        actualizarTotalCosteHabitacion(id);
    });

    tabla.appendChild(fila);
}

function resetearTotalGeneral() {
    totalCosteGeneral = 0;
    document.getElementById("totalCoste").textContent = `Importe Total Facturación: 0.00 €`;
    document.getElementById("ivaCoste").textContent = `IVA (21%): 0.00 €`;
    document.getElementById("totalConIva").textContent = `Total con IVA: 0.00 €`;
}
