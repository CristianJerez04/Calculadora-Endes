// script.js
const applianceForm = document.getElementById('appliance-form');
const applianceTableBody = document.getElementById('appliance-table-body');
const totalCostDisplay = document.getElementById('total-cost-display');

let appliances = [];
let kwhPrice = 0;

document.addEventListener('DOMContentLoaded', function() {
    const menuBtn = document.getElementById('menu-btn');
    const menu = document.getElementById('menu');

    menuBtn.addEventListener('click', function() {
        menu.classList.toggle('active');
    });
});
// Obtener precios de la API eSios
async function fetchElectricityPrice() {
    const apiKey = "TU_API_KEY"; // Sustituye por tu clave
    const region = "8741"; // Código de Castilla-La Mancha en eSios
    const endpoint = `https://api.esios.ree.es/indicators/1001?geo_ids=${region}`;
    
    try {
        const response = await fetch(endpoint, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Token token="${apiKey}"`
            }
        });
        const data = await response.json();
        
        // Obtener el último precio disponible
        const latestPrice = data.indicator.values.pop();
        kwhPrice = latestPrice.value / 1000; // Conversión a €/kWh
        totalCostDisplay.textContent = `Precio actual del kWh: €${kwhPrice.toFixed(4)}`;
    } catch (error) {
        console.error('Error al obtener los precios:', error);
        totalCostDisplay.textContent = 'Error al cargar los precios.';
    }
}



// Añadir electrodoméstico
applianceForm.addEventListener('submit', (event) => {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const power = parseFloat(document.getElementById('power').value);
    const hours = parseFloat(document.getElementById('hours').value);
    
    const dailyConsumption = (power / 1000) * hours; // kWh
    appliances.push({ name, power, hours, dailyConsumption });
    
    updateTable();
    updateTotalCost();
    
    applianceForm.reset();
});

// Actualizar la tabla
function updateTable() {
    applianceTableBody.innerHTML = '';
    appliances.forEach(appliance => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${appliance.name}</td>
            <td>${appliance.power}</td>
            <td>${appliance.hours}</td>
            <td>${appliance.dailyConsumption.toFixed(2)}</td>
        `;
        applianceTableBody.appendChild(row);
    });
}

// Calcular el costo total
function updateTotalCost() {
    const totalConsumption = appliances.reduce((sum, appliance) => sum + appliance.dailyConsumption, 0);
    const totalCost = totalConsumption * kwhPrice;
    totalCostDisplay.textContent = `Costo Diario Total: €${totalCost.toFixed(2)}`;
}

// Cargar el precio inicial
fetchElectricityPrice();
