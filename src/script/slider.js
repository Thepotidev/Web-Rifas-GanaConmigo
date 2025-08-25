document.addEventListener('DOMContentLoaded', () => {
    // Seleccionamos todos los elementos de diapositiva
    const slides = document.querySelectorAll('.slider-container .slide');
    let currentSlide = 0; // Índice del slide que se está mostrando actualmente
    const slideInterval = 3000; // Intervalo de tiempo entre cambios de diapositiva de 3 segundos

    // --- INICIO DE LA VERIFICACIÓN CLAVE ---
    if (slides.length === 0) {
        console.error("Error: No se encontraron slides. Asegúrate de que los elementos '.slider-container .slide' existen en el HTML.");
        return; // Salir del script si no hay slides
    }
    // --- FIN DE LA VERIFICACIÓN CLAVE ---

    // Función para mostrar un slide específico
    function showSlide(index) {
        // Aseguramos de que el índice está dentro del rango
        if (index < 0 || index >= slides.length) {
            console.warn(`Advertencia: Intento de mostrar slide con índice ${index}, que está fuera de rango.`);
            return;
        }

        slides.forEach((slide) => {
            slide.classList.remove('active');
        });

        // Mostrar el slide en el índice dado añadiendo la clase 'active'
        slides[index].classList.add('active');
    }

    // Función para avanzar al siguiente slide
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length; // Calcula el índice del siguiente slide
        // El operador '%' (módulo) asegura que el índice vuelva a 0 si llega al final.
        showSlide(currentSlide); // Muestra el siguiente slide
    }

    // Inicializar el slider: mostrar el primer slide al cargar la página
    showSlide(currentSlide);

    // Iniciar el cambio automático de slides
    let sliderTimer = setInterval(nextSlide, slideInterval);

    const sliderCta = document.querySelector('.slider-cta');
    if (sliderCta) {
        sliderCta.addEventListener('mouseenter', () => {
            clearInterval(sliderTimer);
        });
        sliderCta.addEventListener('mouseleave', () => {
            sliderTimer = setInterval(nextSlide, slideInterval); // Reasignar aquí
        });
    }
});