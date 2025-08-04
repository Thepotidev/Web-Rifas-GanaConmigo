document.addEventListener('DOMContentLoaded', () => {
    // Obtener el ID del sorteo de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const sorteoId = urlParams.get('id');

    // Elementos del DOM del Jumbotron de detalles
    const pageTitleElement = document.getElementById('page-title');
    const sorteoDetalleImg = document.getElementById('sorteo-detalle-img');
    const sorteoDetalleFecha = document.getElementById('sorteo-detalle-fecha');
    const sorteoDetalleHora = document.getElementById('sorteo-detalle-hora');
    const sorteoDetalleProgress = document.getElementById('sorteo-detalle-progress');
    const sorteoDetalleTitulo = document.getElementById('sorteo-detalle-titulo');
    const sorteoDetalleDescription = document.getElementById('sorteo-detalle-description');
    
    // Contenedores para la información adicional (ganador y estadísticas)
    const ganadorInfoDisplay = document.getElementById('ganador-info-display');
    const estadisticasDisplay = document.getElementById('estadisticas-display');


    // Simulación de datos de sorteos finalizados con más detalle
    const todosSorteosFinalizados = [
        {
            id: '1',
            titulo: 'Bronco Loco',
            descripcion: 'Ganate esta increíble camioneta 0km, ideal para la aventura.',
            imagen: '/src/assets/images/Bronco Loco.png',
            fecha: '29/07/2025',
            hora: '10:00 AM',
            estado: 'sold-out',
            ganador: { nombre: 'Juan Pérez', boleto: '0038', premio: 'Bronco Loco', telefono: '+584123456789' },
            boletosVendidos: 9999,
            totalBoletos: 9999,
        },
        {
            id: '2',
            titulo: 'Tundra Tuya',
            descripcion: 'Tu oportunidad de llevarte una potente Tundra 0km.',
            imagen: '/src/assets/images/Tundra Tuya.png',
            fecha: '30/06/2025',
            hora: '08:00 PM',
            estado: 'sold-out',
            ganador: { nombre: 'María Gómez', boleto: '4319', premio: 'Tundra Tuya', telefono: '+584149876543' },
            boletosVendidos: 9999,
            totalBoletos: 9999,
        },
    ];

    const sorteoSeleccionado = todosSorteosFinalizados.find(s => s.id === sorteoId);

    if (sorteoSeleccionado) {
        // Actualizar el título del documento (pestaña del navegador)
        if (pageTitleElement) {
            pageTitleElement.textContent = `Resultados: ${sorteoSeleccionado.titulo}`;
        }
        
        // Actualizar elementos del Jumbotron
        if (sorteoDetalleImg) {
            sorteoDetalleImg.src = sorteoSeleccionado.imagen;
            sorteoDetalleImg.alt = sorteoSeleccionado.titulo;
        }
        if (sorteoDetalleFecha) sorteoDetalleFecha.textContent = sorteoSeleccionado.fecha;
        if (sorteoDetalleHora) sorteoDetalleHora.textContent = sorteoSeleccionado.hora;
        if (sorteoDetalleTitulo) sorteoDetalleTitulo.textContent = sorteoSeleccionado.titulo;
        if (sorteoDetalleDescription) sorteoDetalleDescription.textContent = sorteoSeleccionado.descripcion;

        const porcentaje = ((sorteoSeleccionado.boletosVendidos / sorteoSeleccionado.totalBoletos) * 100).toFixed(2);
        if (sorteoDetalleProgress) {
            sorteoDetalleProgress.style.width = `${porcentaje}%`;
            sorteoDetalleProgress.textContent = `${porcentaje}%`;
        }

        // Inyectar información del ganador
        if (ganadorInfoDisplay) {
            ganadorInfoDisplay.innerHTML = `
                <div class="ganador-info-completa" style="margin-top: 20px;">
                    <h3>¡Felicidades al Ganador!</h3>
                    <p><strong>Nombre:</strong> ${sorteoSeleccionado.ganador.nombre}</p>
                    <p><strong>Boleto Ganador:</strong> ${sorteoSeleccionado.ganador.boleto}</p>
                    <p><strong>Premio:</strong> ${sorteoSeleccionado.ganador.premio}</p>
                    </div>
            `;
        }

        // Inyectar estadísticas de boletos
        if (estadisticasDisplay) {
            estadisticasDisplay.innerHTML = `
                <div class="estadisticas-sorteo" style="margin-top: 10px;">
                    <p>Boletos vendidos: ${sorteoSeleccionado.boletosVendidos} de ${sorteoSeleccionado.totalBoletos}</p>
                </div>
                <a href="index.html" class="btn-primary" style="margin-top: 20px;">Volver al Inicio</a>
            `;
        }

    } else {
        // Si no hay ID en la URL o el sorteo no se encuentra
        if (pageTitleElement) pageTitleElement.textContent = 'Sorteo No Encontrado';
        if (sorteoDetalleImg) sorteoDetalleImg.src = '/src/assets/images/placeholder-error.jpg'; // Imagen de error
        if (sorteoDetalleTitulo) sorteoDetalleTitulo.textContent = 'Sorteo No Encontrado';
        if (sorteoDetalleDescription) sorteoDetalleDescription.textContent = 'Lo sentimos, el sorteo solicitado no pudo ser encontrado o no existe.';
        
        // Ocultar elementos irrelevantes para un sorteo no encontrado
        if (sorteoDetalleProgress) sorteoDetalleProgress.style.display = 'none';
        if (sorteoDetalleFecha) sorteoDetalleFecha.style.display = 'none';
        if (sorteoDetalleHora) sorteoDetalleHora.style.display = 'none';
        if (ganadorInfoDisplay) ganadorInfoDisplay.innerHTML = ''; // Limpiar
        if (estadisticasDisplay) estadisticasDisplay.innerHTML = `
            <p style="text-align: center; margin-top: 20px;">Por favor, regrese a la <a href="index.html">página principal</a> para ver los sorteos.</p>
        `;
    }
    
    // NOTA: Los botones de paginación no tienen sentido en esta página si solo muestra un detalle.
    // Si aún los tienes en el HTML, puedes dejarlos o eliminarlos. Este script ya no los manipulará.
});