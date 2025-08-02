document.addEventListener('DOMContentLoaded', () => {
    // --- Selectores de Elementos del DOM ---
    const decrementarBtn = document.getElementById('decrementar');
    const incrementarBtn = document.getElementById('incrementar');
    const cantidadBoletosInput = document.getElementById('cantidad-boletos');
    const totalPagarSpan = document.getElementById('total-pagar');
    const buscarBoletoInput = document.getElementById('buscar-boleto');
    const aleatorioBtn = document.getElementById('aleatorio');
    const boletosElegidosDiv = document.getElementById('boletos-elegidos');

    // --- Configuración Inicial ---
    const PRECIO_POR_BOLETO = 2; // Puedes cambiar el precio aquí
    const MIN_BOLETO = 1;
    const MAX_BOLETO = 10000;
    let boletosSeleccionados = new Set(); // Usamos un Set para almacenar boletos únicos

    // --- Funciones de Lógica ---

    // Función para actualizar el total a pagar
    function actualizarTotal() {
        const cantidad = parseInt(cantidadBoletosInput.value);
        const total = cantidad * PRECIO_POR_BOLETO;
        totalPagarSpan.textContent = `${total}`;
    }

    // Función para añadir un boleto individual al DOM
    function agregarBoletoAlDOM(numeroBoleto) {
        const boletoItem = document.createElement('div');
        boletoItem.classList.add('boleto-item');
        boletoItem.dataset.numero = numeroBoleto; // Guardar el número en un data attribute

        boletoItem.innerHTML = `
            <span>#${numeroBoleto}</span>
            <button class="eliminar-boleto" type="button">x</button>
        `;
        boletosElegidosDiv.appendChild(boletoItem);

        // Añadir el evento click al botón de eliminar
        boletoItem.querySelector('.eliminar-boleto').addEventListener('click', () => {
            eliminarBoleto(numeroBoleto);
        });
    }

    // Función para eliminar un boleto
    function eliminarBoleto(numeroBoleto) {
        if (boletosSeleccionados.has(numeroBoleto)) {
            boletosSeleccionados.delete(numeroBoleto);
            const boletoElement = boletosElegidosDiv.querySelector(`.boleto-item[data-numero="${numeroBoleto}"]`);
            if (boletoElement) {
                boletoElement.remove();
            }
            // Actualizar la cantidad de boletos en el input si es necesario
            if (parseInt(cantidadBoletosInput.value) > 1) {
                cantidadBoletosInput.value = boletosSeleccionados.size;
                actualizarTotal();
            } else if (boletosSeleccionados.size === 0) {
                 cantidadBoletosInput.value = 1; // Resetea a 1 si no hay boletos
                 actualizarTotal();
            }
            mostrarMensajeBoletosVacios();
        }
    }

    // Función para añadir un boleto a la lista
    function añadirBoleto(numero) {
        const numeroBoleto = parseInt(numero);

        if (isNaN(numeroBoleto) || numeroBoleto < MIN_BOLETO || numeroBoleto > MAX_BOLETO) {
            alert(`Por favor, introduce un número de boleto válido entre ${MIN_BOLETO} y ${MAX_BOLETO}.`);
            return false;
        }

        if (boletosSeleccionados.has(numeroBoleto)) {
            alert(`El boleto #${numeroBoleto} ya ha sido seleccionado.`);
            return false;
        }

        if (boletosSeleccionados.size >= MAX_BOLETO) { // Limite global de boletos
            alert(`Has alcanzado el número máximo de boletos (${MAX_BOLETO}) que se pueden seleccionar.`);
            return false;
        }

        boletosSeleccionados.add(numeroBoleto);
        agregarBoletoAlDOM(numeroBoleto);
        return true;
    }

    // Función para mostrar un mensaje si no hay boletos seleccionados
    function mostrarMensajeBoletosVacios() {
        if (boletosSeleccionados.size === 0 && boletosElegidosDiv.children.length === 0) {
            const mensaje = document.createElement('p');
            mensaje.id = 'mensaje-boletos-vacios';
            mensaje.textContent = 'Aquí aparecerán tus boletos seleccionados.';
            boletosElegidosDiv.appendChild(mensaje);
        } else {
            const mensajeExistente = document.getElementById('mensaje-boletos-vacios');
            if (mensajeExistente) {
                mensajeExistente.remove();
            }
        }
    }


    // --- Manejadores de Eventos ---

    // Botón de decrementar cantidad
    decrementarBtn.addEventListener('click', () => {
        let cantidad = parseInt(cantidadBoletosInput.value);
        if (cantidad > 1) { // Mínimo 1 boleto
            cantidad--;
            cantidadBoletosInput.value = cantidad;
            actualizarTotal();
        }
    });

    // Botón de incrementar cantidad
    incrementarBtn.addEventListener('click', () => {
        let cantidad = parseInt(cantidadBoletosInput.value);
        if (cantidad < MAX_BOLETO) { // Máximo definido para la cantidad en el selector
            cantidad++;
            cantidadBoletosInput.value = cantidad;
            actualizarTotal();
        }
    });

    // Input de cantidad de boletos (si el usuario lo modifica directamente)
    cantidadBoletosInput.addEventListener('change', () => {
        let cantidad = parseInt(cantidadBoletosInput.value);
        if (isNaN(cantidad) || cantidad < 1) {
            cantidad = 1;
        } else if (cantidad > MAX_BOLETO) {
            cantidad = MAX_BOLETO;
        }
        cantidadBoletosInput.value = cantidad;
        actualizarTotal();
    });

    // Búsqueda de boleto individual
    buscarBoletoInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevenir el envío de formulario si está dentro de uno
            const numero = parseInt(buscarBoletoInput.value);
            if (añadirBoleto(numero)) {
                // Si el boleto se añadió con éxito, actualizamos la cantidad en el input
                cantidadBoletosInput.value = boletosSeleccionados.size;
                actualizarTotal();
                buscarBoletoInput.value = ''; // Limpiar input
                mostrarMensajeBoletosVacios();
            }
        }
    });

    // Botón "Elegir boletos aleatorios"
    aleatorioBtn.addEventListener('click', () => {
        const cantidadDeseada = parseInt(cantidadBoletosInput.value);
        let boletosGenerados = 0;
        let intentos = 0; // Para evitar bucles infinitos si hay pocos boletos disponibles

        // Eliminar boletos existentes para reemplazarlos por los aleatorios si se desea
        boletosSeleccionados.clear();
        boletosElegidosDiv.innerHTML = '';


        while (boletosGenerados < cantidadDeseada && intentos < (MAX_BOLETO * 2)) { // Limitar intentos
            const nuevoBoleto = Math.floor(Math.random() * (MAX_BOLETO - MIN_BOLETO + 1)) + MIN_BOLETO;
            if (añadirBoleto(nuevoBoleto)) { // añadirBoleto ya maneja duplicados y validación
                boletosGenerados++;
            }
            intentos++;
        }
        // Actualizar la cantidad de boletos en el input y el total
        cantidadBoletosInput.value = boletosSeleccionados.size;
        actualizarTotal();
        mostrarMensajeBoletosVacios();
    });

    // --- Inicialización ---
    actualizarTotal(); // Calcular el total inicial al cargar la página
    mostrarMensajeBoletosVacios(); // Mostrar el mensaje inicial si no hay boletos
});

// --- Fin del Código de boletos ---

// Función para copiar datos al portapapeles
function copiarDato(id) {
    const texto = document.getElementById(id).textContent;
    navigator.clipboard.writeText(texto);
    alert('¡Dato copiado!');
}