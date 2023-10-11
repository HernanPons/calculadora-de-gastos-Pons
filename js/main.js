let gastos = [];
let dolarVenta = [];


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
    function capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    gastos.forEach((gasto, evt) => {
        const div = document.createElement("div");
        div.className = "tabla";

        const h4Nombre = document.createElement("p");
        h4Nombre.textContent = capitalizeFirstLetter(gasto.nombre);

        const h4Valor = document.createElement("p");
        h4Valor.className = "monto";
        h4Valor.textContent = `$${gasto.valor}`;

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
    const categoriaInput = document.querySelector("#selector")
    const categoriaValor = categoriaInput.value

    if (nombreInput.value && !isNaN(valorDelGastoTexto)) {
        const nuevoGastoObjeto = {
            nombre: nombreInput.value,
            valor: valorDelGastoTexto,
            categoria: categoriaValor,
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

function sumarMontos() {
    let totalUsd = 0;
    let suma = 0;
    gastos.forEach((gasto) => {
        suma += parseFloat(gasto.valor) || 0;
    });

    totalEnDolares()
    function totalEnDolares () {
        totalUsd = parseFloat(suma / dolarVenta);
    }

    const totalElement = document.getElementById("total");
    totalElement.textContent = "Total: $" + suma.toFixed(2);
}

/////////////////////////////////////////////////////////////////////////////////////////////////

function reiniciarMontos() {
    const elementos = document.querySelectorAll(".monto, .agregarItem");
    elementos.forEach(elemento => {
        elemento.value = "";
    });
    const totalElement = document.getElementById("total");
    totalElement.textContent = "Total:";

    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
      })
      
      swalWithBootstrapButtons.fire({
        title: '¿Está seguro?',
        text: "Si elimina todos los gastos, no podrá volver a recuperarlos.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'No, cancelar',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem('gastos');
            gastos = [];
            dibujarHTML();
            sumarMontos();
        
            swalWithBootstrapButtons.fire(
                'Eliminado!',
                'Se han eliminado todos los gastos guardados.',
                'success'
            )
        } else if (
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            'Cancelado',
            'Todos tus gastos siguen guardados :-)',
            'error'
          )
        }
      })
}


function filtrarCategorias() {
    const categoriaInput = document.querySelector("#filterSelect");
    const categoriaValor = categoriaInput.value;

    const resultadosDiv = document.getElementById("resultados");
    resultadosDiv.innerHTML = "";

    const datosGuardados = JSON.parse(localStorage.getItem("gastos"));

    const resultadosFiltro = datosGuardados.filter(gasto => gasto.categoria == categoriaValor);

    console.log(resultadosFiltro);

    resultadosFiltro.forEach((resultado) => {
        const divFilter = document.createElement("div")
        divFilter.className = "tabla"

        const pNombre = document.createElement("p");
        pNombre.className = "resFiltro";
        pNombre.textContent = `${resultado.nombre}`;
        divFilter.appendChild(pNombre);

        const pValor = document.createElement("p");
        pValor.className = "resFiltro";
        pValor.textContent = `$${resultado.valor}`;
        divFilter.appendChild(pValor);

        resultadosDiv.appendChild(divFilter);
    });
} 


/////////////////////////////////////////////////////////////////////////////////////////////////


let url = "https://dolarapi.com/v1/dolares/blue"

fetch(url)
    .then((res) => {
        return res.json ()
    })
    .then((dolar) => {
        let dolarCompra = dolar.compra;
        let dolarVenta = dolar.venta;
        let dolarFecha = dolar.fechaActualizacion;
        
        const fecha = new Date (dolarFecha)
        const año = fecha.getFullYear();
        const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
        const dia = fecha.getDate().toString().padStart(2, "0");
        const hora = fecha.getHours().toString().padStart(2, "0");
        const minutos = fecha.getMinutes().toString().padStart(2, "0");

        const fechaFormateada = `${dia}/${mes}/${año} ${hora}:${minutos}`;

        let mostrarCompra = document.querySelector (".dolarCompra");
        mostrarCompra.textContent = "$" + dolarCompra;

        let mostrarVenta = document.querySelector (".dolarVenta");
        mostrarVenta.textContent = "$" + dolarVenta;

        let mostrarFecha = document.querySelector (".dolarFecha");
        mostrarFecha.textContent = fechaFormateada;
    })
    .catch((err) => {
        console.log(err)
    })
    


