const precioBoleto = 2.00;

document.addEventListener('DOMContentLoaded', () => {
    // Selectores para los elementos del DOM
    const boletosContainer = document.getElementById('boletos-disponibles-container');
    const boletosElegidosContainer = document.getElementById('boletos-elegidos');
    const cantidadBoletosInput = document.getElementById('cantidad-boletos');
    const incrementarBtn = document.getElementById('incrementar');
    const decrementarBtn = document.getElementById('decrementar');
    const totalPagarSpan = document.getElementById('total-pagar');
    const buscarBoletoInput = document.getElementById('buscar-boleto');
    const aleatorioBtn = document.getElementById('aleatorio');
    const formularioRifa = document.getElementById('formulario-rifa');
    const sorteoIdInput = document.getElementById('sorteo-id');

    let boletosDisponibles = [];
    let boletosSeleccionados = new Set();
    let sorteoId = sorteoIdInput.value;

    // Función para actualizar el total a pagar
    const actualizarTotal = () => {
        const total = boletosSeleccionados.size * precioBoleto;
        totalPagarSpan.textContent = total.toFixed(2);
    };

    // Renderiza los boletos disponibles en la UI
    const renderBoletosDisponibles = (filtro = null) => {
        if (!boletosContainer) {
            console.error("Error: No se encontró el contenedor de boletos disponibles con ID 'boletos-disponibles-container'.");
            return;
        }

        boletosContainer.innerHTML = '';
        let boletosFiltrados = boletosDisponibles;

        if (filtro) {
            // El filtro ahora busca directamente en la cadena del número de boleto
            boletosFiltrados = boletosDisponibles.filter(b => b.numero.includes(filtro));
        }

        boletosFiltrados.forEach(boleto => {
            const boletoDiv = document.createElement('div');
            boletoDiv.classList.add('boleto-disponible');
            if (boletosSeleccionados.has(boleto.numero)) {
                boletoDiv.classList.add('seleccionado');
            }
            boletoDiv.textContent = boleto.numero;
            boletoDiv.dataset.numero = boleto.numero;

            boletoDiv.addEventListener('click', () => {
                // El número de boleto se obtiene como string del dataset
                const numeroBoleto = boletoDiv.dataset.numero;
                const cantidadMaxima = parseInt(cantidadBoletosInput.value);

                if (boletosSeleccionados.has(numeroBoleto)) {
                    boletosSeleccionados.delete(numeroBoleto);
                    boletoDiv.classList.remove('seleccionado');
                } else {
                    if (boletosSeleccionados.size < cantidadMaxima) {
                        boletosSeleccionados.add(numeroBoleto);
                        boletoDiv.classList.add('seleccionado');
                    } else {
                        // En lugar de un alert, puedes mostrar un mensaje en la UI
                        console.log(`No puedes seleccionar más de ${cantidadMaxima} boletos.`);
                        return; // Salir de la función si se excede la cantidad
                    }
                }
                
                // Vuelve a renderizar para actualizar el estado visual
                renderBoletosDisponibles(buscarBoletoInput.value);
                renderBoletosElegidos();
                actualizarTotal();
            });
            boletosContainer.appendChild(boletoDiv);
        });
    };

    // Renderiza los boletos seleccionados
    const renderBoletosElegidos = () => {
        if (!boletosElegidosContainer) {
            console.error("Error: No se encontró el contenedor de boletos elegidos con ID 'boletos-elegidos'.");
            return;
        }

        boletosElegidosContainer.innerHTML = '';
        if (boletosSeleccionados.size === 0) {
            const mensaje = document.createElement('p');
            mensaje.textContent = 'Aquí aparecerán los boletos que elijas';
            boletosElegidosContainer.appendChild(mensaje);
        } else {
            // Se ordenan los boletos como strings para mantener el formato '0001', '0002', etc.
            Array.from(boletosSeleccionados).sort().forEach(numero => {
                const item = document.createElement('div');
                item.classList.add('boleto-item');
                item.innerHTML = `
                    <span>${numero}</span>
                    <button type="button" class="eliminar-boleto" data-numero="${numero}">x</button>
                `;
                boletosElegidosContainer.appendChild(item);

                item.querySelector('.eliminar-boleto').addEventListener('click', (e) => {
                    // El número de boleto se obtiene como string del dataset
                    const numeroEliminar = e.target.dataset.numero;
                    boletosSeleccionados.delete(numeroEliminar);
                    renderBoletosDisponibles(buscarBoletoInput.value);
                    renderBoletosElegidos();
                    actualizarTotal();
                });
            });
        }
    };

    // Manejadores de eventos
    if (incrementarBtn) {
        incrementarBtn.addEventListener('click', () => {
            let cantidad = parseInt(cantidadBoletosInput.value);
            
            if (cantidad < 10000) {
                cantidadBoletosInput.value = cantidad + 1;
                
            } else {
                console.log("No se puede incrementar, la cantidad ya es 10000.");
            }
        });
    }

    if (decrementarBtn) {
        decrementarBtn.addEventListener('click', () => {
            let cantidad = parseInt(cantidadBoletosInput.value);
            
            if (cantidad > 1) {
                cantidadBoletosInput.value = cantidad - 1;
                
            } else {
                console.log("No se puede decrementar, la cantidad ya es 1.");
            }
        });
    }

    if (buscarBoletoInput) {
        buscarBoletoInput.addEventListener('input', (e) => {
            renderBoletosDisponibles(e.target.value);
        });
    }

    if (aleatorioBtn) {
        aleatorioBtn.addEventListener('click', () => {
            const cantidad = parseInt(cantidadBoletosInput.value);
            // El filtro ya trabaja con los números como strings
            const disponiblesSinSeleccionados = boletosDisponibles.filter(b => !boletosSeleccionados.has(b.numero));

            if (disponiblesSinSeleccionados.length < cantidad) {
                alert("No hay suficientes boletos disponibles para esta selección aleatoria.");
                return;
            }

            // Deseleccionar los boletos actuales
            boletosSeleccionados.clear();
            
            const boletosRandom = [];
            const boletosDisponiblesCopy = [...disponiblesSinSeleccionados];

            for (let i = 0; i < cantidad; i++) {
                const indice = Math.floor(Math.random() * boletosDisponiblesCopy.length);
                const boleto = boletosDisponiblesCopy.splice(indice, 1)[0].numero;
                boletosSeleccionados.add(boleto);
            }

            renderBoletosDisponibles(buscarBoletoInput.value);
            renderBoletosElegidos();
            actualizarTotal();
        });
    }

    /**
     * Estandariza el número de teléfono al formato '+58'.
     * Acepta formatos como '04121234567' o '4121234567'.
     * @param {string} telefono - El número de teléfono ingresado por el usuario.
     * @returns {string} - El número estandarizado.
     */
    const estandarizarNumeroTelefono = (telefono) => {
        // Eliminar cualquier carácter que no sea un dígito o un '+'
        let numeroLimpio = telefono.toString().replace(/[^\d+]/g, '');

        // Si ya tiene el prefijo '+58', lo devolvemos tal cual
        if (numeroLimpio.startsWith('+58')) {
            return numeroLimpio;
        }

        // Si el número empieza con '0', lo eliminamos
        if (numeroLimpio.startsWith('0')) {
            numeroLimpio = numeroLimpio.substring(1);
        }

        // Añadir el prefijo '+58' y devolver el número estandarizado
        return `+58${numeroLimpio}`;
    };

    // Lógica de envío del formulario
    if (formularioRifa) {
        formularioRifa.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Validar que se haya seleccionado al menos un boleto
            if (boletosSeleccionados.size === 0) {
                alert("Por favor, selecciona al menos un boleto.");
                return;
            }

            // --- NUEVAS VALIDACIONES AGREGADAS ---
            const cedulaInput = document.getElementById('cedula');
            const referenciaInput = document.getElementById('referencia');
            const telefonoInput = document.getElementById('telefono');

            const cedula = cedulaInput.value;
            const referencia = referenciaInput.value;
            const telefono = telefonoInput.value;
            
            // Validación de cédula
            if (cedula.length !== 8 || isNaN(cedula)) {
                alert("La cédula debe contener exactamente 8 dígitos numéricos.");
                return;
            }

            // Validación de referencia
            if (referencia.length !== 6 || isNaN(referencia)) {
                alert("La referencia de pago debe contener exactamente 6 dígitos numéricos.");
                return;
            }

            // Validación de teléfono
            const telefonoLimpio = telefono.replace(/[^\d]/g, '');
            // Validamos que el formato sea 04XX-XXXXXXX (11 dígitos) o 4XX-XXXXXXX (10 dígitos)
            if (
                (telefonoLimpio.startsWith('04') && telefonoLimpio.length !== 11) ||
                (!telefonoLimpio.startsWith('04') && telefonoLimpio.length !== 10)
            ) {
                alert("El teléfono debe tener el formato 0412-1234567 o 412-1234567.");
                return;
            }
            // --- FIN DE LAS NUEVAS VALIDACIONES ---

            const formData = new FormData(formularioRifa);

            // Estandarizar el número de teléfono antes de usarlo
            const telefonoEstandarizado = estandarizarNumeroTelefono(telefono);

            const data = {
                sorteo_id: sorteoId,
                nombre: formData.get('nombre'),
                cedula: formData.get('cedula'),
                telefono: telefonoEstandarizado,
                referencia: formData.get('referencia'),
                // Convertir el Set de boletos a un array para el JSON
                boletos_seleccionados: Array.from(boletosSeleccionados)
            };

            // Aquí deberías enviar `data` y el archivo de comprobante al servidor
            console.log('Datos a enviar:', data);
            alert('Formulario enviado con éxito. Aquí puedes manejar la petición al servidor.');

            // Limpiar formulario y boletos después del envío
            formularioRifa.reset();
            boletosSeleccionados.clear();
            renderBoletosElegidos();
            renderBoletosDisponibles();
            actualizarTotal();
        });
    }

    // Función para copiar texto al portapapeles
    window.copiarDato = function(id) {
        const elemento = document.getElementById(id);
        if (elemento) {
            const texto = elemento.textContent || elemento.href;
            document.execCommand('copy');
            alert(`"${texto}" copiado al portapapeles.`);
        }
    };
    
    // Función de inicialización
    const init = () => {
        // Se generan los boletos como strings de 4 dígitos
        for (let i = 0; i <= 9999; i++) {
            boletosDisponibles.push({ numero: String(i).padStart(4, '0'), disponible: true });
        }
        renderBoletosDisponibles();
        actualizarTotal();
        renderBoletosElegidos();
    };

    init();
});
