document.addEventListener('DOMContentLoaded', () => {
    const sorteosContainer = document.querySelector('#ultimos-sorteos .sorteos-container');
    sorteosContainer.innerHTML = ''; // Limpiar cualquier contenido estático

    // Simulación de datos de sorteos finalizados (en un backend, esto vendría de la DB)
    const finalizadosData = [
        {
            id: '1',
            titulo: 'Bronco Loco',
            fecha: '29/07/2025',
            imagen: '/assets/images/Bronco Loco.png', 
            estado: 'sold out'
        },
        {
            id: '2',
            titulo: 'Tundra Tuya',
            fecha: '30/06/2025',
            imagen: '/assets/images/Tundra Tuya.png',
            estado: 'sold out'
        },
        // Puedes agregar más sorteos finalizados aquí para la demostración
    ];

    finalizadosData.forEach(sorteo => {
        const cardLink = document.createElement('a');
        // El href apunta a la página de detalles con el ID del sorteo
        cardLink.href = `/assets/pages/sorteo-detalles.html?id=${sorteo.id}`; 
        cardLink.classList.add('sorteo-card-link');

        cardLink.innerHTML = `
            <div class="sorteo-card">
                <img src="${sorteo.imagen}" alt="${sorteo.titulo}">
                <h3 class="sorteo-titulo">${sorteo.titulo}</h3>
                <p class="sorteo-fecha">Fecha: ${sorteo.fecha}</p>
                <span class="sorteo-estado ${sorteo.estado}">${sorteo.estado.toUpperCase()}</span>
            </div>
        `;
        sorteosContainer.appendChild(cardLink);
    });

    // Lógica de paginación básica (requiere backend para funcionar completamente)
    const btnAnterior = document.getElementById('sorteos-anterior');
    const btnSiguiente = document.getElementById('sorteos-siguiente');

    if (btnAnterior) btnAnterior.addEventListener('click', () => alert('Cargar sorteos anteriores (requiere backend)'));
    if (btnSiguiente) btnSiguiente.addEventListener('click', () => alert('Cargar sorteos siguientes (requiere backend)'));
});