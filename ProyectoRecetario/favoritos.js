let db = null;
let recetasFavoritas = [];
const USUARIO_ACTUAL = AuthService.obtenerUsuarioActual();

// Redirigir si el usuario no está autenticado
document.addEventListener('DOMContentLoaded', function() {
    // Si no hay usuario logueado, redirigir a login
    if (!USUARIO_ACTUAL) {
        window.location.href = 'login.html';
        return;
    }

    // Mostrar información del usuario
    mostrarInfoUsuario();

 fetch("recetas.json")
    .then(respuesta => respuesta.json())
    .then(datos => {
        // Combinar recetas del JSON con las guardadas en localStorage
        const recetasLocales = JSON.parse(localStorage.getItem('misRecetas') || '[]');
        db = datos;
        db.recetas = [...datos.recetas, ...recetasLocales];

        if (!localStorage.getItem('db_favoritos')) {
            localStorage.setItem('db_favoritos', JSON.stringify(datos.favoritos));
        }

        obtenerRecetasFavoritas();
        renderizarFavoritos();
    })
    .catch(error => {
        console.error("Error al cargar las recetas:", error);
        mostrarError("No se pudieron cargar las recetas. Intenta más tarde.");
    });
});

/**
 * Muestra la información del usuario en el header
 */
function mostrarInfoUsuario() {
    const btnLogin = document.getElementById('btn-login');
    const usuarioInfo = document.getElementById('usuario-info');
    const nombreUsuario = document.getElementById('nombre-usuario');

    if (USUARIO_ACTUAL) {
        btnLogin.style.display = 'none';
        usuarioInfo.style.display = 'flex';
        nombreUsuario.textContent = `Hola, ${USUARIO_ACTUAL.nombre}`;

        // Evento para logout
        document.getElementById('btn-logout').addEventListener('click', function() {
            AuthService.logout();
            window.location.href = 'index.html';
        });
    }
}

/**
 * Obtiene las recetas favoritas del usuario actual desde localStorage
 */
function obtenerRecetasFavoritas() {
    if (!USUARIO_ACTUAL || !db) return;

    const favoritos = JSON.parse(localStorage.getItem('db_favoritos')) || [];
    const idUsuario = USUARIO_ACTUAL.idUsuario;

    // Filtrar los favoritos del usuario actual
    const idsFavoritosUsuario = favoritos
        .filter(fav => fav.idUsuario === idUsuario)
        .map(fav => fav.idReceta);

    // Obtener las recetas completas que son favoritos del usuario
    recetasFavoritas = db.recetas.filter(receta => 
        idsFavoritosUsuario.includes(receta.idReceta)
    );
}

/**
 * Renderiza las recetas favoritas o muestra un mensaje si no hay
 */
function renderizarFavoritos() {
    const contenedor = document.getElementById("contenedor-favoritos");
    const sinFavoritos = document.getElementById("sin-favoritos");

    if (recetasFavoritas.length === 0) {
        // Mostrar mensaje de sin favoritos
        contenedor.innerHTML = '';
        sinFavoritos.style.display = 'block';
        return;
    }

    // Ocultar mensaje de sin favoritos
    sinFavoritos.style.display = 'none';

    let htmlAcumulado = "";

    recetasFavoritas.forEach(receta => {
        let ingredientesHTML = "";
        receta.ingredientes.forEach(ing => {
            ingredientesHTML += `<li>${ing}</li>`;
        });

        htmlAcumulado += `
            <div class="tarjeta">
                <div class="tarjeta-img">
                    <img src="${receta.imagen.startsWith('http') ? receta.imagen : 'recursos/' + receta.imagen}" 
                         alt="${receta.nombre}" 
                         class="img-fluida"
                         onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22180%22%3E%3Crect fill=%22%23eee%22 width=%22200%22 height=%22180%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23999%22%3ESin imagen%3C/text%3E%3C/svg%3E'">
                </div>
                <div class="tarjeta-contenido">
                    <h3>${receta.nombre}</h3>
                    <p>${receta.descripcion}</p>
                    
                    <div class="tarjeta-ingredientes">
                        <strong>Ingredientes:</strong>
                        <ul>
                            ${ingredientesHTML}
                        </ul>
                    </div>
                    
                    <div class="botones-tarjeta">
                        <a href="Detalles.html?id=${receta.idReceta}" class="btn-ver-mas" style="text-decoration: none; text-align: center;">Ver más</a>
                        <button class="btn-fav" onclick="eliminarFavorito(${receta.idReceta})">❤️</button>
                    </div>
                </div>
            </div>
        `;
    });

    contenedor.innerHTML = htmlAcumulado;
}

/**
 * Elimina una receta de favoritos
 */
window.eliminarFavorito = function(idReceta) {
    if (!USUARIO_ACTUAL) {
        alert("Debes iniciar sesión.");
        return;
    }

    const favoritos = JSON.parse(localStorage.getItem('db_favoritos')) || [];
    const index = favoritos.findIndex(fav => 
        fav.idUsuario === USUARIO_ACTUAL.idUsuario && fav.idReceta === idReceta
    );

    if (index > -1) {
        favoritos.splice(index, 1);
        localStorage.setItem('db_favoritos', JSON.stringify(favoritos));
        
        // Volver a renderizar
        obtenerRecetasFavoritas();
        renderizarFavoritos();

        // Animación de retroalimentación
        mostrarNotificacion("Receta eliminada de favoritos");
    }
};

/**
 * Muestra una notificación temporal
 */
function mostrarNotificacion(mensaje) {
    const notif = document.createElement('div');
    notif.textContent = mensaje;
    notif.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: var(--color-primario);
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        animation: slideIn 0.3s ease;
        font-weight: 600;
    `;

    document.body.appendChild(notif);

    setTimeout(() => {
        notif.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notif.remove(), 300);
    }, 2000);
}

/**
 * Muestra un mensaje de error
 */
function mostrarError(mensaje) {
    const contenedor = document.getElementById("contenedor-favoritos");
    contenedor.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
            <span style="font-size: 50px; display: block; margin-bottom: 20px;">⚠️</span>
            <h2 style="color: var(--color-secundario); margin-bottom: 10px;">Error</h2>
            <p style="color: #999; font-size: 16px;">${mensaje}</p>
        </div>
    `;
}

// Agregar estilos para animaciones de notificación
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
function abrirModal() {
    document.getElementById('modal-añadir').classList.remove('oculto');
}

function cerrarModal() {
    document.getElementById('modal-añadir').classList.add('oculto');
}

function guardarReceta() {
    const nombre = document.getElementById('input-nombre').value.trim();
    const imagen = document.getElementById('input-imagen').value.trim();
    const descripcion = document.getElementById('input-descripcion').value.trim();
    const ingredientes = document.getElementById('input-ingredientes').value
        .split('\n').filter(i => i.trim() !== '');
    const pasos = document.getElementById('input-pasos').value
        .split('\n').filter(p => p.trim() !== '');

    if (!nombre || !descripcion || ingredientes.length === 0 || pasos.length === 0) {
        alert('Rellena todos los campos obligatorios');
        return;
    }

    const nuevaReceta = {
        idReceta: Date.now(),
        nombre,
        imagen: imagen || '',
        descripcion,
        ingredientes,
        pasos
    };

    // Guardar la receta en db
    db.recetas.push(nuevaReceta);

    // Guardar la receta también en localStorage
const recetasGuardadas = JSON.parse(localStorage.getItem('misRecetas') || '[]');
recetasGuardadas.push(nuevaReceta);
localStorage.setItem('misRecetas', JSON.stringify(recetasGuardadas));

    // Añadir a favoritos del usuario actual
    const favoritos = JSON.parse(localStorage.getItem('db_favoritos')) || [];
    favoritos.push({ idUsuario: USUARIO_ACTUAL.idUsuario, idReceta: nuevaReceta.idReceta });
    localStorage.setItem('db_favoritos', JSON.stringify(favoritos));

    // Volver a renderizar
    obtenerRecetasFavoritas();
    renderizarFavoritos();

    cerrarModal();
    mostrarNotificacion('Receta añadida a favoritos');
}