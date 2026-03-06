document.addEventListener('DOMContentLoaded', () => {
    // 1. Guarda de seguridad: Si el usuario ya está logueado, lo expulsamos a la Home
    if (AuthService.obtenerUsuarioActual()) {
        window.location.href = 'index.html';
        return;
    }

    // 2. Referencias a los nodos del DOM
    const form = document.getElementById('registro-form');
    const errorMessage = document.getElementById('error-message');
    const successMessage = document.getElementById('success-message');

    // 3. Interceptamos el evento Submit
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Evitamos el recargo por defecto de la página

        // Reseteamos el estado visual de los mensajes
        errorMessage.style.display = 'none';
        successMessage.style.display = 'none';

        // Extraemos los valores de los inputs
        const nombre = document.getElementById('nombre').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('password-confirm').value;

        // --- 4. FASE DE VALIDACIÓN ---
        
        // Comprobamos la restricción de longitud (indicada en tu HTML)
        if (password.length < 6) {
            errorMessage.textContent = "La contraseña debe tener al menos 6 caracteres.";
            errorMessage.style.display = 'block';
            return; // Cortamos la ejecución prematuramente (Early return)
        }

        // Comprobamos que las contraseñas coinciden
        if (password !== passwordConfirm) {
            errorMessage.textContent = "Las contraseñas no coinciden. Vuelve a intentarlo.";
            errorMessage.style.display = 'block';
            return;
        }

        // --- 5. FASE DE ESCRITURA A DISCO ---
        const resultado = AuthService.registrar(nombre, email, password);

        // 6. Gestionamos el resultado de la operación
        if (resultado.exito) {
            successMessage.textContent = "¡Cuenta creada con éxito! Redirigiendo al login...";
            successMessage.style.display = 'block';
            
            // Pausamos la ejecución 1.5 segundos para que el usuario lea el mensaje de éxito
            setTimeout(() => {
                window.location.href = 'login.html'; // Le enviamos a iniciar sesión
            }, 1500);
            
        } else {
            // El error más común aquí será que el correo ya exista en el array
            errorMessage.textContent = resultado.mensaje;
            errorMessage.style.display = 'block';
        }
    });
});