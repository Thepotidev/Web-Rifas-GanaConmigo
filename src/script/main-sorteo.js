document.addEventListener('DOMContentLoaded', () => {
    async function cargarSorteoActivo() {
        try {
            const res = await fetch('/api/public/activos');
            const data = await res.json();
            if (res.ok && data.sorteos && data.sorteos.length > 0) {
                const activeSorteoData = data.sorteos[0];
                window.sorteoActivoId = activeSorteoData.id;

                // Actualiza el jumbotron con los datos reales
                const jumbotronImg = document.getElementById('jumbotron-img');
                if (jumbotronImg && activeSorteoData.imagen) {
                    jumbotronImg.src = activeSorteoData.imagen;
                    jumbotronImg.alt = activeSorteoData.titulo;
                }
                const jumbotronFecha = document.getElementById('jumbotron-fecha');
                if (jumbotronFecha) jumbotronFecha.textContent = activeSorteoData.fecha;
                const jumbotronHora = document.getElementById('jumbotron-hora');
                if (jumbotronHora) jumbotronHora.textContent = activeSorteoData.hora;
                const progressBar = document.getElementById('jumbotron-progress');
                if (progressBar) {
                    progressBar.style.width = `${activeSorteoData.porcentajeVendido}%`;
                    progressBar.textContent = `${activeSorteoData.porcentajeVendido}%`;
                }
                const jumbotronTitulo = document.getElementById('jumbotron-titulo');
                if (jumbotronTitulo) jumbotronTitulo.textContent = activeSorteoData.titulo;
                const jumbotronDescription = document.getElementById('jumbotron-description');
                if (jumbotronDescription) jumbotronDescription.textContent = activeSorteoData.descripcion;

                // Deshabilita el botón si está agotado
                if (activeSorteoData.porcentajeVendido >= 100) {
                    const btnCompraRapida = document.getElementById('btn-compra-rapida');
                    if (btnCompraRapida) {
                        btnCompraRapida.textContent = '¡Boletos Agotados!';
                        btnCompraRapida.style.backgroundColor = '#d3d3d3';
                        btnCompraRapida.style.pointerEvents = 'none';
                    }
                }
            }
        } catch (err) {
            console.error('No se pudo obtener el sorteo activo');
        }
    }
    cargarSorteoActivo();
});