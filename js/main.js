let gastos = [];

document.addEventListener('DOMContentLoaded', () => {
    cargarGastos();
    dibujarHTML();
});

function cargarGastos() {
    const gastosGuardados = JSON.parse(localStorage.getItem('gastos'));
    if (gastosGuardados) {
        gastos = gastosGuardados;
    }
}

function dibujarHTML() {
    const container = document.querySelector(".container");
    container.innerHTML = "";

    gastos.forEach((gasto, evt) => {
        const div = document.createElement("div");
        div.className = "items";

        const h4Nombre = document.createElement("h4");
        h4Nombre.textContent = gasto.nombre;

        const h4Valor = document.createElement("h4");
        h4Valor.className = "monto";
        h4Valor.textContent = gasto.valor;

        const button = document.createElement("button");
        button.textContent = "eliminar";
        button.className = "eliminar";

        button.addEventListener("click", function() {
            div.remove();
            eliminarGasto(evt);
        });

        div.appendChild(h4Nombre);
        div.appendChild(h4Valor);
        div.appendChild(button);

        container.appendChild(div);
    });
}

function nuevoGasto() {
    const nombreInput = document.querySelector(".agregarItem");
    const valorDelGastoInput = document.querySelector(".valorDelGasto");
    const valorDelGastoTexto = parseInt(valorDelGastoInput.value);

    if (nombreInput.value && !isNaN(valorDelGastoTexto)) {
        const nuevoGastoObjeto = {
            nombre: nombreInput.value,
            valor: valorDelGastoTexto
        };

        gastos.push(nuevoGastoObjeto);

        localStorage.setItem('gastos', JSON.stringify(gastos));

        dibujarHTML();
        sumarMontos ();
        valorDelGastoInput.value = "";
        nombreInput.value = "";
    }
}

function eliminarGasto(evt) {
    gastos.splice(evt, 1);
    localStorage.setItem('gastos', JSON.stringify(gastos));
    dibujarHTML();
    sumarMontos ();
}

function reiniciarMontos() {
    const elementos = document.querySelectorAll(".monto, .agregarItem");
    elementos.forEach(elemento => {
        elemento.value = "";
    });
    const totalElement = document.getElementById("total");
    totalElement.textContent = "Total:";
}

function sumarMontos() {
    let suma = 0;
    gastos.forEach((gasto) => {
        suma += parseFloat(gasto.valor) || 0;
    });

    const totalElement = document.getElementById("total");
    totalElement.textContent = "Total: " + suma.toFixed(2);
}

function reiniciarMontos() {
    const confirmacion = confirm("¿Estás seguro de que quieres eliminar todos los datos?");
    
    if (confirmacion) {
        localStorage.removeItem('gastos');
        gastos = [];
        dibujarHTML();
        sumarMontos();
    }
}
