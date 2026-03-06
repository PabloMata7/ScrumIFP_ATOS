const USUARIO_ACTUAL = AuthService.obtenerUsuarioActual();

function actualizarMenuUsuario() {
    // Buscamos el puntero al contenedor de la esquina superior derecha
    const authContainer = document.querySelector('.auth');
    if (!authContainer) return;

    if (USUARIO_ACTUAL) {
        // Estado: Jugador logueado
        // Inyectamos su nombre y un botón para cerrar sesión
        authContainer.innerHTML = `
            <span style="color: var(--color-secundario); margin-right: 15px; font-size: 15px;">
                Hola, <strong>${USUARIO_ACTUAL.nombre}</strong>
            </span>
            <button id="btn-logout" class="btn-ver-mas" style="background-color: var(--color-secundario);">
                Cerrar sesión
            </button>
        `;

        // Le asignamos el evento de clic al nuevo botón
        document.getElementById('btn-logout').addEventListener('click', () => {
            AuthService.logout(); // Destruimos el token en disco
            window.location.reload(); // Recargamos la escena para volver al estado base
        });
        
    } else {
        // Estado: Invitado (Puntero a nulo)
        // Mostramos los enlaces normales hacia las páginas de tus compañeros
        authContainer.innerHTML = `
            <a href="login.html" style="text-decoration: none; color: var(--color-secundario); font-weight: bold; margin-right: 15px; transition: color 0.3s;">Iniciar sesión</a>
            <a href="registro.html" class="btn-ver-mas" style="text-decoration: none;">Registrarse</a>
        `;
    }
}

// Ejecutamos la actualización del HUD inmediatamente
actualizarMenuUsuario();

document.addEventListener('DOMContentLoaded', function () {
    // Obtener el ID de la receta de la URL
    const params = new URLSearchParams(window.location.search);
    const idReceta = params.get('id');

    if (!idReceta) {
        document.getElementById('titulo').innerHTML = 'Error: No se especificó una receta.';
        return;
    }

    fetch("recetas.json")
        .then(respuesta => respuesta.json())
        .then(datos => {
            // Buscar la receta con el ID
            const receta = datos.recetas.find(r => r.idReceta === parseInt(idReceta));

            if (!receta) {
                document.getElementById('titulo').innerHTML = 'Error: Receta no encontrada.';
                return;
            }

            // Rellenar título y descripción
            document.getElementById('titulo').textContent = receta.nombre;
            const imgEl = document.getElementById('receta-img');
            const placeholder = document.getElementById('img-placeholder');
            const src = receta.imagen.startsWith('http') ? receta.imagen : 'recursos/' + receta.imagen;
            imgEl.src = src;
            imgEl.alt = receta.nombre;
            imgEl.onload = function () {
                imgEl.style.display = 'block';
                if (placeholder) placeholder.style.display = 'none';
            };
            imgEl.onerror = function () {
                imgEl.style.display = 'none';
                if (placeholder) placeholder.style.display = 'flex';
            };
            document.getElementById('descripcion').textContent = receta.descripcion;

            // Rellenar ingredientes
            let ingredientesHTML = receta.ingredientes.map(ing => `<li>${ing}</li>`).join('');
            document.getElementById('ingredientes').innerHTML = ingredientesHTML;

            // Rellenar pasos
            let pasosHTML = receta.pasos.map((paso, index) => `<li data-number="${index + 1}">${paso}</li>`).join('');
            document.getElementById('pasos').innerHTML = pasosHTML;
        })
        .catch(error => {
            console.error("Error al cargar la receta:", error);
            document.getElementById('titulo').innerHTML = 'Error al cargar los datos.';
        });
});