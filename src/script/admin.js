document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.admin-nav-item');
    const sections = document.querySelectorAll('.admin-section');
    const formSorteoContainer = document.getElementById('form-sorteo-container');
    const formSorteo = document.getElementById('form-sorteo');
    const sorteoImagenInput = document.getElementById('sorteo-imagen');
    const sorteoImagenPreview = document.querySelector('#sorteo-imagen-preview img');
    const btnFinalizarSorteo = document.getElementById('btn-finalizar-sorteo'); // Nuevo botón

    // Simulación de datos del sorteo activo (en un backend, esto vendría de la DB)
    let currentActiveSorteo = {
        id: 'activo-1', // Un ID fijo para el sorteo activo
        titulo: 'Gran Rifa de Verano: Gana un Viaje al Caribe',
        descripcion: '¡Participa en nuestro increíble sorteo de verano y podrías ganar un viaje todo incluido para dos personas a las paradisíacas playas del Caribe!',
        imagen: '/src/assets/images/sorteo-verano-caribe.jpg', // Ruta de imagen de ejemplo
        fecha_cierre: '2025-12-31',
        hora_cierre: '22:00',
        min_boletos: 1,
        precio_boleto: 2.50,
        total_boletos: 10000,
        boletos_vendidos: 7500, // Datos simulados
        estado: 'activo'
    };

    // Función para cargar los datos del sorteo activo en el formulario
    const loadActiveSorteoForm = () => {
        if (currentActiveSorteo) {
            document.getElementById('sorteo-id').value = currentActiveSorteo.id;
            document.getElementById('sorteo-titulo').value = currentActiveSorteo.titulo;
            document.getElementById('sorteo-descripcion').value = currentActiveSorteo.descripcion;
            document.getElementById('sorteo-fecha-cierre').value = currentActiveSorteo.fecha_cierre;
            document.getElementById('sorteo-hora-cierre').value = currentActiveSorteo.hora_cierre;
            document.getElementById('sorteo-min-boletos').value = currentActiveSorteo.min_boletos;
            document.getElementById('sorteo-precio-boleto').value = currentActiveSorteo.precio_boleto;
            document.getElementById('sorteo-total-boletos').value = currentActiveSorteo.total_boletos;
            document.getElementById('sorteo-estado').value = currentActiveSorteo.estado;

            if (currentActiveSorteo.imagen) {
                sorteoImagenPreview.src = currentActiveSorteo.imagen;
                sorteoImagenPreview.style.display = 'block';
            } else {
                sorteoImagenPreview.style.display = 'none';
            }
        } else {
            // Si no hay sorteo activo, el formulario se reinicia para crear uno nuevo
            formSorteo.reset();
            sorteoImagenPreview.style.display = 'none';
        }
    };

    // --- Navegación entre secciones ---
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.getAttribute('href').substring(1); 
            
            navItems.forEach(nav => nav.classList.remove('active'));
            sections.forEach(sec => sec.classList.remove('active-section'));

            item.classList.add('active');
            document.getElementById(targetId).classList.add('active-section');

            // Si se va a la sección de gestionar sorteo, cargar los datos
            if (targetId === 'gestion-sorteos') {
                loadActiveSorteoForm();
            }
        });
    });

    // Asegurarse de que la primera sección (Gestión de Sorteo Activo) esté activa al cargar
    if (navItems.length > 0 && sections.length > 0) {
        navItems[0].classList.add('active');
        sections[0].classList.add('active-section');
        loadActiveSorteoForm(); // Cargar el formulario al inicio
    }

    // --- Vista previa de la imagen del sorteo ---
    sorteoImagenInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                sorteoImagenPreview.src = e.target.result;
                sorteoImagenPreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        } else {
            sorteoImagenPreview.src = '';
            sorteoImagenPreview.style.display = 'none';
        }
    });

    // --- Lógica de Formulario para Guardar/Actualizar Sorteo ---
    formSorteo.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Aquí obtendrías los datos del formulario
        const formData = new FormData(formSorteo);
        const sorteoData = {};
        for (let [key, value] of formData.entries()) {
            sorteoData[key] = value;
        }

        // Simulación: Actualizar el sorteo activo localmente
        currentActiveSorteo = { ...currentActiveSorteo, ...sorteoData };
        alert('Datos del sorteo guardados (simulado). Necesitas un backend para la persistencia.');
        console.log('Sorteo Actualizado:', currentActiveSorteo);

        // En un entorno real, enviarías esto al backend:
        // fetch('/api/sorteo-activo', { 
        //     method: 'POST', // o PUT si es actualización
        //     body: JSON.stringify(sorteoData),
        //     headers: { 'Content-Type': 'application/json' }
        // })
        // .then(response => response.json())
        // .then(data => { /* Manejar respuesta */ })
        // .catch(error => console.error('Error:', error));
    });

    // --- Lógica para Finalizar Sorteo (nuevo botón) ---
    btnFinalizarSorteo.addEventListener('click', () => {
        if (confirm('¿Estás seguro de que quieres FINALIZAR el sorteo actual? Esto detendrá las ventas.')) {
            // Simulación: Cambiar estado a finalizado y limpiar datos para un nuevo sorteo
            if (currentActiveSorteo) {
                currentActiveSorteo.estado = 'finalizado';
                // En un sistema real, guardarías este sorteo finalizado
                // y luego podrías crear uno nuevo o marcar uno como activo
                alert(`Sorteo "${currentActiveSorteo.titulo}" FINALIZADO (simulado).`);
                
                // Opcional: limpiar el formulario para iniciar uno nuevo
                currentActiveSorteo = null; // Reiniciar para el próximo sorteo
                loadActiveSorteoForm(); // Cargar formulario vacío
            } else {
                alert('No hay un sorteo activo para finalizar.');
            }
        }
    });

    // --- Funcionalidad de Botones de Tabla (Pagos) ---
    // (Estos solo mostrarán un alert, la lógica real iría con llamadas al backend)
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-verify')) {
            const id = e.target.dataset.id;
            if (confirm(`¿Marcar pago con ID: ${id} como VERIFICADO? Esto marcará los boletos como pagados.`)) {
                alert(`Verificar pago con ID: ${id} (simulado).`);
                // fetch(`/api/pagos/${id}/verificar`, { method: 'PUT' })
                // .then(() => {
                //    // Aquí actualizarías la lista de pagos pendientes y boletos vendidos
                // })
            }
        } else if (e.target.classList.contains('btn-reject')) {
            const id = e.target.dataset.id;
            if (confirm(`¿Rechazar pago con ID: ${id}?`)) {
                alert(`Rechazar pago con ID: ${id} (simulado).`);
                // fetch(`/api/pagos/${id}/rechazar`, { method: 'PUT' })
            }
        } else if (e.target.id === 'logout-btn') {
            alert('Cerrar sesión (simulado).');
            // Aquí se ejecutaría la lógica de cerrar sesión, ej. limpiar tokens, redirigir
            // window.location.href = 'login.html'; // Redirigir a la página de login
        }
    });

    // --- Lógica para cargar boletos vendidos (simulado) ---
    const loadSoldTickets = () => {
        const tableBody = document.querySelector('#lista-boletos-vendidos tbody');
        tableBody.innerHTML = ''; // Limpiar tabla
        const noBoletosMsg = document.getElementById('no-boletos-vendidos-msg');

        if (currentActiveSorteo && currentActiveSorteo.boletos_vendidos > 0) {
            noBoletosMsg.style.display = 'none';
            // Simulación de algunos boletos vendidos
            for (let i = 1; i <= Math.min(5, currentActiveSorteo.boletos_vendidos); i++) { // Mostrar solo 5 ejemplos
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${1000 + i}</td>
                    <td>Comprador ${i}</td>
                    <td>Pagado</td>
                    <td>${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</td>
                `;
                tableBody.appendChild(row);
            }
             if (currentActiveSorteo.boletos_vendidos > 5) {
                const moreRow = document.createElement('tr');
                moreRow.innerHTML = `<td colspan="4" style="text-align: center;">... y ${currentActiveSorteo.boletos_vendidos - 5} boletos más</td>`;
                tableBody.appendChild(moreRow);
             }
        } else {
            noBoletosMsg.style.display = 'block';
        }
    };
    loadSoldTickets(); // Cargar al inicio
});

async function cargarSorteos() {
    const res = await fetch('/api/sorteos', {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('adminToken')
        }
    });
    const data = await res.json();
    if (res.ok) {
        // Renderiza los sorteos en tu panel
        console.log('Sorteos:', data.sorteos);
    } else {
        alert(data.error || 'No autorizado');
        if (res.status === 401 || res.status === 403) {
            window.location.href = '/src/assets/pages/admin_login.html';
        }
    }
}

async function cargarPagos() {
    const res = await fetch('/api/pagos', {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('adminToken')
        }
    });
    const data = await res.json();
    if (res.ok) {
        // Renderiza los pagos en tu panel
        console.log('Pagos:', data.pagos);
    } else {
        alert(data.error || 'No autorizado');
        if (res.status === 401 || res.status === 403) {
            window.location.href = '/src/assets/pages/admin_login.html';
        }
    }
}