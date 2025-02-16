//Variable totalcoste general
//Esta variable se utiliza para almacenar el coste total general de todas las habitaciones.

let totalCosteGeneral = 0;



//Función para actualizar costes
//Esta función calcula el coste total de todas las habitaciones sumando los valores de las clases 
//.total-coste-habitacion y actualiza el totalCosteGeneral. Luego, actualiza el texto de la base imponible 
//y llama a las funciones para actualizar el IVA y el total con IVA.

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


//Función para Actualizar iva
//Esta función calcula el IVA (21%) sobre el totalCosteGeneral y 
//actualiza el texto del IVA en el elemento con el ID ivaCoste.

function actualizarIva() {
    const iva = totalCosteGeneral * 0.21;
    document.getElementById("ivaCoste").textContent = `IVA (21%): ${iva.toFixed(2)}€`;
}

//Función para actualizar el total con iva
//Esta función calcula el total con IVA añadiendo el IVA al totalCosteGeneral y 
//actualiza el texto en el elemento con el ID totalConIva.

function actualizarTotalConIva() {
    const iva = totalCosteGeneral * 0.21;
    const totalConIva = totalCosteGeneral + iva;
    document.getElementById("totalConIva").textContent = `Total con IVA repercutido: ${totalConIva.toFixed(2)}€`;
}

//Función para actualizar el coste total de la habitación.
//Esta función calcula el coste total de los electrodomésticos en una habitación específica 
//sumando los valores de las celdas con la clase .coste y actualiza el texto del coste total 
//de la habitación. Luego, llama a actualizarTotalCosteGeneral para actualizar el coste general.

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

// Función para agregar habitaciones.
// Esta función añade una nueva habitación a la lista de habitaciones. Crea dinámicamente un div con los elementos HTML necesarios, 
// como el nombre de la habitación, un input para el precio kWh, un botón para añadir electrodomésticos y una tabla para listar los 
// electrodomésticos. También agrega eventos para eliminar la habitación y actualizar el precio del kWh.

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
    div.id = `habitacion${id}`; 
    div.innerHTML = `
        <h2>${nombreHabitacion}</h2>
        <button class="eliminarhab">Eliminar habitación</button>
        <label class="texto">Precio kWh: <input class="input-field precio-kwh" type="number" step="0.01" id="precio${id}" value="0.15" min="0"></label>
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

    div.querySelector(".eliminarhab").addEventListener("click", function() {
        eliminarHabitacion(id);
    });

    
    const inputPrecioKwh = div.querySelector(".precio-kwh");
    inputPrecioKwh.addEventListener("change", actualizarPreciosKwh);
}

//Función para actualizar el precio del kWh
//Esta función actualiza el precio del kWh en todos los inputs cuando se cambia en uno de ellos. 
//Luego, recalcula los costes de las habitaciones.

function actualizarPreciosKwh(event) {
    const nuevoPrecio = parseFloat(event.target.value) || 0;
    const preciosKwh = document.querySelectorAll(".precio-kwh");

    preciosKwh.forEach(input => {
        input.value = nuevoPrecio.toFixed(2);
    });

    
    document.querySelectorAll(".appliance-box").forEach((elem, id) => {
        actualizarTotalCosteHabitacion(id + 1);
    });
}

//Función para eliminar habitaciónes.
//Esta función elimina una habitación de la lista de habitaciones y actualiza el coste total general.

function eliminarHabitacion(id) {
    const habitacion = document.getElementById(`habitacion${id}`);
    habitacion.parentNode.removeChild(habitacion);
    actualizarTotalCosteGeneral();
}

//Funcion para gestión de habitaciones y electrodomésticos
//Esta función devuelve una cadena HTML que representa una tabla de electrodomésticos predefinidos 
//para una habitación específica, incluyendo selectores de potencia, botones de control y campos de coste.

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
            { nombre: "Lámpara", potencias: [60, 75, 100] }
        ],
        dormitorio1: [
            { nombre: "Climatizador", potencias: [1000, 1500, 2000] },
            { nombre: "Ventilador", potencias: [50, 75, 100] },
            { nombre: "Lámpara", potencias: [50, 70, 90] }
        ],
         dormitorio2: [
            { nombre: "Portatil", potencias: [45, 60, 75] },
            { nombre: "Humedificador", potencias: [25, 35, 50] },
            { nombre: "Calefactor", potencias: [750, 1000, 1500] }
        ],
        patio: [
            { nombre: "Parrilla eléctrica", potencias: [1000, 1500, 2000] },
            { nombre: "Calefactor", potencias: [800, 1200, 1500] },
            { nombre: "Luces Jardín", potencias: [10, 20, 30] }
        ],
        guardilla: [
            { nombre: "Deshumidificador", potencias: [200, 300, 400] },
            { nombre: "Ventilador techo", potencias: [50, 75, 100] },
            { nombre: "Calefactor portátil", potencias: [500, 1000, 1500] }
        ],
        sotano: [
            { nombre: "Deshumidificador", potencias: [200, 300, 400] },
            { nombre: "Congelador", potencias: [300, 400, 500] },
            { nombre: "Lámpara de Pie", potencias: [50, 70, 80] }
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


//Función para agregar nuevos electrodomesticos
//Esta función añade un nuevo electrodoméstico a la tabla de una habitación específica, 
//incluyendo validaciones para el nombre y la potencia, y llama a addEventListenersToRow para añadir eventos a los botones.

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


//Función para crear eventos
//Esta parte del código añade eventos a los botones de las filas:

// Botón Toggle (botonToggle): Activa o desactiva el encendido del electrodoméstico, actualiza el tiempo de encendido y el coste.

// Botón Acelerar (botonAcelerar): Aumenta la velocidad del tiempo de encendido (simulando un paso rápido del tiempo).

// Botón Eliminar (botonEliminar): Elimina la fila del electrodoméstico y actualiza el coste total de la habitación.

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

//Función para resetear el total general
//Esta función restablece el totalCosteGeneral a 0 y actualiza los textos del importe total,
//IVA y total con IVA en los respectivos elementos.

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


// 1. totalCosteGeneral: Variable para almacenar el coste total general.

// 2. actualizarTotalCosteGeneral: Función para calcular y actualizar el coste total de todas las habitaciones.

// 3. actualizarIva: Función para calcular y actualizar el IVA.

// 4. actualizarTotalConIva: Función para calcular y actualizar el total con IVA.

// 5. actualizarTotalCosteHabitacion: Función para calcular y actualizar el coste total de una habitación específica.

// 6. obtenerElectrodomesticosPredefinidos: Función para obtener los electrodomésticos predefinidos de una habitación.

// 7. agregarElectrodomestico: Función para añadir un nuevo electrodoméstico a una tabla de habitación.

// 8. addEventListenersToRow: Función para añadir eventos a los botones de una fila de electrodoméstico.

// 9. resetearTotalGeneral: Función para resetear el total general a 0.

// 10. Inicialización de Eventos: Código para inicializar los eventos en las filas existentes de las tablas.