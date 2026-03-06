document.addEventListener('DOMContentLoaded', () => {
    // 1. Guarda de seguridad: Si el usuario ya está logueado, lo expulsamos del login y lo mandamos a la Home
    if (AuthService.obtenerUsuarioActual()) {
        window.location.href = 'index.html';
        return;
    }

    // 2. Punteros a los elementos del DOM (Interfaz)
    const form = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');
    const successMessage = document.getElementById('success-message');

    // 3. Evento de envío del formulario
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Evita que el navegador recargue la página automáticamente

        // Limpiamos mensajes de intentos anteriores
        errorMessage.style.display = 'none';
        successMessage.style.display = 'none';

        // Leemos los valores que ha escrito el usuario
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        // 4. Llamamos a nuestra API de autenticación
        const resultado = AuthService.login(email, password);

        // 5. Gestionamos la respuesta
        if (resultado.exito) {
            // Mostramos feedback positivo
            successMessage.textContent = `¡Bienvenido de nuevo, ${resultado.usuario.nombre}! Redirigiendo...`;
            successMessage.style.display = 'block';
            
            // Hacemos una pausa de 1 segundo para que el usuario pueda leer el mensaje antes de cambiar de página
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
            
        } else {
            // Mostramos el error (correo o contraseña incorrectos)
            errorMessage.textContent = resultado.mensaje;
            errorMessage.style.display = 'block';
        }
    });
});