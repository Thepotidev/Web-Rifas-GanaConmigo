document.addEventListener('DOMContentLoaded', () => {

    const boletosSelector = document.getElementById('boletos-selector');

    if (boletosSelector) {
        const cantidadBoletosInput = document.getElementById('cantidad-boletos');
        const totalPagarSpan = document.getElementById('total-pagar');
        const buscarBoletoInput = document.getElementById('buscar-boleto');
        const aleatorioBtn = document.getElementById('aleatorio');
        const boletosElegidosDiv = document.getElementById('boletos-elegidos');
        const listaDeBoletosDisponibles = document.getElementById('lista-de-boletos-disponibles');

        const PRECIO_POR_BOLETO = 2;
        const MIN_BOLETO = 0; 
        const MAX_BOLETO = 9999;
        window.boletosSeleccionados = window.boletosSeleccionados || [];

        function actualizarTotal() {
            const cantidad = window.boletosSeleccionados.length;
            const total = cantidad * PRECIO_POR_BOLETO;
            totalPagarSpan.textContent = `${total}`;
            mostrarMensajeBoletosVacios();
        }

        function agregarBoletoAlDOM(numeroBoleto) {
            const boletoItem = document.createElement('div');
            boletoItem.classList.add('boleto-item');
            boletoItem.dataset.numero = numeroBoleto;
            boletoItem.innerHTML = `
                <span>#${String(numeroBoleto).padStart(4, '0')}</span>
                <button class="eliminar-boleto" type="button">x</button>
            `;
            boletosElegidosDiv.appendChild(boletoItem);

            boletoItem.querySelector('.eliminar-boleto').addEventListener('click', () => {
                eliminarBoleto(numeroBoleto);
                actualizarTotal();
            });
        }

        function eliminarBoleto(numeroBoleto) {
            numeroBoleto = Number(numeroBoleto);
            const idx = window.boletosSeleccionados.indexOf(numeroBoleto);
            if (idx !== -1) {
                window.boletosSeleccionados.splice(idx, 1);
                const boletoElement = boletosElegidosDiv.querySelector(`.boleto-item[data-numero="${numeroBoleto}"]`);
                if (boletoElement) boletoElement.remove();
                
                const boletoCard = listaDeBoletosDisponibles.querySelector(`.boleto-card[data-numero="${numeroBoleto}"]`);
                if (boletoCard) {
                    boletoCard.classList.remove('seleccionado');
                }
                mostrarMensajeBoletosVacios();
            }
        }

        function añadirBoleto(numero) {
            const numeroBoleto = parseInt(numero);
            if (isNaN(numeroBoleto) || numeroBoleto < MIN_BOLETO || numeroBoleto > MAX_BOLETO) {
                alert(`Por favor, introduce un número de boleto válido entre ${MIN_BOLETO} y ${MAX_BOLETO}.`);
                return false;
            }
            if (window.boletosSeleccionados.includes(numeroBoleto)) {
                alert(`El boleto #${String(numeroBoleto).padStart(4, '0')} ya ha sido seleccionado.`);
                return false;
            }
            const cantidadDeseada = parseInt(cantidadBoletosInput.value);
            if (window.boletosSeleccionados.length >= cantidadDeseada) {
                alert(`Solo puedes seleccionar ${cantidadDeseada} boletos.`);
                return false;
            }
            
            window.boletosSeleccionados.push(numeroBoleto);
            agregarBoletoAlDOM(numeroBoleto);
            actualizarTotal();

            const boletoCard = listaDeBoletosDisponibles.querySelector(`.boleto-card[data-numero="${numeroBoleto}"]`);
            if (boletoCard) {
                boletoCard.classList.add('seleccionado');
            }
            
            return true;
        }

        function generarBoletoAleatorioUnico() {
            const boletosDisponibles = [];
            for (let i = MIN_BOLETO; i <= MAX_BOLETO; i++) {
                if (!window.boletosSeleccionados.includes(i)) {
                    boletosDisponibles.push(i);
                }
            }
            
            if (boletosDisponibles.length > 0) {
                const randomIndex = Math.floor(Math.random() * boletosDisponibles.length);
                return boletosDisponibles[randomIndex];
            }
            return null;
        }

        function mostrarMensajeBoletosVacios() {
            const mensajeId = 'mensaje-boletos-vacios';
            let mensajeExistente = document.getElementById(mensajeId);
            
            if (window.boletosSeleccionados.length === 0) {
                if (!mensajeExistente) {
                    const mensaje = document.createElement('p');
                    mensaje.id = mensajeId;
                    mensaje.textContent = 'Aquí aparecerán tus boletos seleccionados.';
                    boletosElegidosDiv.appendChild(mensaje);
                }
            } else {
                if (mensajeExistente) mensajeExistente.remove();
            }
        }
        
        function generarTodosLosBoletos() {
            listaDeBoletosDisponibles.innerHTML = '';
            for (let i = MIN_BOLETO; i <= MAX_BOLETO; i++) {
                const boletoCard = document.createElement('div');
                boletoCard.classList.add('boleto-card');
                boletoCard.dataset.numero = i;
                boletoCard.textContent = String(i).padStart(4, '0');
                
                boletoCard.addEventListener('click', () => {
                    if (boletoCard.classList.contains('seleccionado')) {
                        eliminarBoleto(i);
                    } else {
                        añadirBoleto(i);
                    }
                });
                
                listaDeBoletosDisponibles.appendChild(boletoCard);
            }
        }

        // --- Manejadores de Eventos de Compra ---

        cantidadBoletosInput.addEventListener('change', () => {
            let cantidad = parseInt(cantidadBoletosInput.value);
            if (isNaN(cantidad) || cantidad < 0) {
                cantidad = 0;
            } else if (cantidad > MAX_BOLETO + 1) {
                cantidad = MAX_BOLETO + 1;
            }
            cantidadBoletosInput.value = cantidad;
        });

        buscarBoletoInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                const numero = parseInt(buscarBoletoInput.value);
                if (añadirBoleto(numero)) {
                    buscarBoletoInput.value = '';
                }
            }
        });

        aleatorioBtn.addEventListener('click', () => {
            const cantidadDeseada = parseInt(cantidadBoletosInput.value);
            
            window.boletosSeleccionados.forEach(numeroBoleto => {
                const boletoCard = listaDeBoletosDisponibles.querySelector(`.boleto-card[data-numero="${numeroBoleto}"]`);
                if (boletoCard) {
                    boletoCard.classList.remove('seleccionado');
                }
            });

            window.boletosSeleccionados = [];
            boletosElegidosDiv.innerHTML = '';
            
            const boletosDisponibles = [];
            for (let i = MIN_BOLETO; i <= MAX_BOLETO; i++) {
                boletosDisponibles.push(i);
            }
            
            for (let i = 0; i < cantidadDeseada; i++) {
                if (boletosDisponibles.length > 0) {
                    const randomIndex = Math.floor(Math.random() * boletosDisponibles.length);
                    const nuevoBoleto = boletosDisponibles.splice(randomIndex, 1)[0];
                    window.boletosSeleccionados.push(nuevoBoleto);
                    agregarBoletoAlDOM(nuevoBoleto);

                    const boletoCard = listaDeBoletosDisponibles.querySelector(`.boleto-card[data-numero="${nuevoBoleto}"]`);
                    if (boletoCard) {
                        boletoCard.classList.add('seleccionado');
                    }
                }
            }
            
            actualizarTotal();
        });

        // --- Inicialización ---
        generarTodosLosBoletos();
        actualizarTotal();
    } 
    
    // --- ENVÍO DEL FORMULARIO ---
    const formularioRifa = document.getElementById('formulario-rifa');

    if (formularioRifa) {
        formularioRifa.addEventListener('submit', async (e) => {
            e.preventDefault();

            const boletosElegidosDiv = document.getElementById('boletos-elegidos');
            const boletosSeleccionados = window.boletosSeleccionados || [];

            if (boletosSeleccionados.length === 0) {
                alert('Por favor, selecciona al menos un boleto antes de enviar.');
                return;
            }

            const formData = new FormData(formularioRifa);
            formData.append('boletos', JSON.stringify(boletosSeleccionados));

            // Aquí puedes cambiar la URL a la que envía el formulario
            const url = '/api/compras';

            try {
                const response = await fetch(url, {
                    method: 'POST',
                    body: formData,
                });

                const data = await response.json();

                if (data.success) {
                    alert('¡Compra exitosa! Tu registro ha sido enviado.');
                    formularioRifa.reset();
                    window.boletosSeleccionados = [];
                    boletosElegidosDiv.innerHTML = '';
                    actualizarTotal();
                } else {
                    alert(`Error en el registro: ${data.message}`);
                }
            } catch (error) {
                console.error('Error al enviar el formulario:', error);
                alert('Ocurrió un error inesperado. Por favor, intenta de nuevo.');
            }
        });
    }

    const verificadorForm = document.getElementById('form-verificador');

    if (verificadorForm) {
        const verificarBoletoInput = document.getElementById('verificar-boleto');
        const resultadoDiv = document.getElementById('resultado-verificador');

        verificadorForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const valorBusqueda = verificarBoletoInput.value;
            if (!valorBusqueda) {
                resultadoDiv.innerHTML = '<p class="error">Por favor, introduce un número de teléfono o de boleto valido.</p>';
                return;
            }
            resultadoDiv.innerHTML = '<p>Buscando...</p>';
            try {
                const response = await fetch(`/api/verificador?q=${valorBusqueda}`);
                const data = await response.json();
                if (data.success) {
                    resultadoDiv.innerHTML = `
                        <p class="success"><strong>Boleto encontrado:</strong> #${data.boleto}</p>
                        <p><strong>Titular:</strong> ${data.titular}</p>
                    `;
                } else {
                    resultadoDiv.innerHTML = `<p class="error">No se encontró el boleto o el teléfono.</p>`;
                }
            } catch (error) {
                console.error('Error al verificar el boleto:', error);
                resultadoDiv.innerHTML = `<p class="error">Ocurrió un error al verificar. Intenta de nuevo.</p>`;
            }
        });
    }
});

function copiarDato(id) {
    const elemento = document.getElementById(id);
    if (elemento) {
        const texto = elemento.textContent;
        navigator.clipboard.writeText(texto);
        alert('¡Dato copiado!');
    }
}