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

///////////////////////////////////////////////////////////////////////////////////////////////////
function reiniciarMontos() {
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




/* function reiniciarMontos() {
    const confirmacion = confirm("¿Estás seguro de que quieres eliminar todos los datos?");
    
    if (confirmacion) {
        localStorage.removeItem('gastos');
        gastos = [];
        dibujarHTML();
        sumarMontos();
    }
} */

function filtrarCategorias() {
    const categoriaInput = document.querySelector("#filterSelect");
    const categoriaValor = categoriaInput.value;

    const resultadosDiv = document.getElementById("resultados");
    resultadosDiv.innerHTML = "";
    //console.log(categoriaValor)

    const datosGuardados = JSON.parse(localStorage.getItem("gastos"));
  
    //console.log (datosGuardados)

    const resultadosFiltro = datosGuardados.filter(gasto => gasto.categoria == categoriaValor);

    console.log(resultadosFiltro);

    resultadosFiltro.forEach((resultado) => {
        const pNombre = document.createElement("p");
        pNombre.className = "resFiltro";
        pNombre.textContent = `${resultado.nombre}`;
        resultadosDiv.appendChild(pNombre);
        const pValor = document.createElement("p");
        pValor.className = "resFiltro";
        pValor.textContent = `$${resultado.valor}`;
        resultadosDiv.appendChild(pValor);
    });
} 


