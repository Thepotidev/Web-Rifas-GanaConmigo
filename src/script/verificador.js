document.getElementById('form-verificador').addEventListener('submit', async function(e) {
    e.preventDefault();
    const input = document.getElementById('verificar-boleto').value.trim();
    const resultadoDiv = document.getElementById('resultado-verificador');
    resultadoDiv.innerHTML = 'Buscando...';

    let url = '/api/verificador?';
    if (input.length >= 7) { // Asumimos teléfono si tiene 7 o más dígitos
        url += `telefono=${encodeURIComponent(input)}`;
    } else if (input.length > 0) {
        url += `numero=${encodeURIComponent(input)}`;
    } else {
        resultadoDiv.innerHTML = '<span style="color:red;">Debes ingresar teléfono o número de boleto.</span>';
        return;
    }

    try {
        const res = await fetch(url);
        const data = await res.json();
        if (res.ok) {
            resultadoDiv.innerHTML = `
                <div class="tarjeta-verificador">
                    <p><strong>Nombre:</strong> ${data.nombre}</p>
                    <p><strong>Cédula:</strong> ${data.cedula}</p>
                    <p><strong>Teléfono:</strong> ${data.telefono}</p>
                    <p><strong>Boletos:</strong> ${data.boletos.join(', ')}</p>
                </div>
            `;
        } else {
            resultadoDiv.innerHTML = `<span style="color:red;">${data.error}</span>`;
        }
    } catch (err) {
        resultadoDiv.innerHTML = '<span style="color:red;">Error de conexión con el servidor.</span>';
    }
});