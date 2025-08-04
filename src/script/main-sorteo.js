document.addEventListener('DOMContentLoaded', () => {
    // Simulación de datos del sorteo activo (en un backend, esto vendría de la DB)
    const activeSorteoData = {
        id: 'activo-principal',
        titulo: '¡Participa en la Gran Rifa!',
        descripcion: '¡Gana increíbles premios participando en nuestra rifa mensual! Compra tus boletos y aumenta tus posibilidades.',
        imagen: '/src/assets/images/Imagen de prueba.png', // Tu imagen principal del Jumbotron
        fecha: '30 AGO 2025',
        hora: '10:00 PM',
        porcentajeVendido: 100 // Ejemplo: 85% vendido
    };

    // 1. Actualizar la Imagen del Jumbotron (usando el ID 'jumbotron-img')
    const jumbotronImg = document.getElementById('jumbotron-img');
    if (jumbotronImg) {
        jumbotronImg.src = activeSorteoData.imagen;
        jumbotronImg.alt = activeSorteoData.titulo;
    } else {
        console.warn("Advertencia: Elemento con ID 'jumbotron-img' no encontrado.");
    }

    // 2. Actualizar Fecha y Hora del Jumbotron (usando los NUEVOS IDs 'jumbotron-fecha' y 'jumbotron-hora')
    const jumbotronFecha = document.getElementById('jumbotron-fecha');
    const jumbotronHora = document.getElementById('jumbotron-hora');
    if (jumbotronFecha) {
        jumbotronFecha.textContent = activeSorteoData.fecha;
    } else {
        console.warn("Advertencia: Elemento con ID 'jumbotron-fecha' no encontrado.");
    }
    if (jumbotronHora) {
        jumbotronHora.textContent = activeSorteoData.hora;
    } else {
        console.warn("Advertencia: Elemento con ID 'jumbotron-hora' no encontrado.");
    }

    // 3. Actualizar la Barra de Progreso (usando el NUEVO ID 'jumbotron-progress')
    const progressBar = document.getElementById('jumbotron-progress');
    if (progressBar) {
        progressBar.style.width = `${activeSorteoData.porcentajeVendido}%`;
        progressBar.textContent = `${activeSorteoData.porcentajeVendido}%`;
    } else {
        console.warn("Advertencia: Elemento con ID 'jumbotron-progress' no encontrado.");
    }

    // 4. Actualizar Título del Jumbotron (usando el NUEVO ID 'jumbotron-titulo')
    const jumbotronTitulo = document.getElementById('jumbotron-titulo');
    if (jumbotronTitulo) {
        jumbotronTitulo.textContent = activeSorteoData.titulo;
    } else {
        console.warn("Advertencia: Elemento con ID 'jumbotron-titulo' no encontrado.");
    }

    // 5. Actualizar Descripción del Jumbotron (usando el NUEVO ID 'jumbotron-description')
    const jumbotronDescription = document.getElementById('jumbotron-description');
    if (jumbotronDescription) {
        jumbotronDescription.textContent = activeSorteoData.descripcion;
    } else {
        console.warn("Advertencia: Elemento con ID 'jumbotron-description' no encontrado.");
    }
    
    // Si el sorteo activo está 100% vendido, cambiar el botón (usando el NUEVO ID 'btn-compra-rapida')
    if (activeSorteoData.porcentajeVendido >= 100) {
        const btnCompraRapida = document.getElementById('btn-compra-rapida'); // Usamos getElementById ahora
        if (btnCompraRapida) {
            btnCompraRapida.textContent = '¡Boletos Agotados!';
            btnCompraRapida.style.backgroundColor = '#d3d3d3';
            btnCompraRapida.style.pointerEvents = 'none'; // Deshabilita clics
        } else {
            console.warn("Advertencia: Botón con ID 'btn-compra-rapida' no encontrado.");
        }
    }
});