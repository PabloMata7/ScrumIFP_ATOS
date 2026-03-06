let db = null;
let recetasFavoritas = [];
const USUARIO_ACTUAL = AuthService.obtenerUsuarioActual();

/* === 1. ACTUALIZACIÓN DEL HUD === */
function actualizarMenuUsuario() {
    const authContainer = document.querySelector('.auth');
    if (!authContainer) return;

    if (USUARIO_ACTUAL) {
        authContainer.innerHTML = `
            <span style="color: var(--color-secundario); margin-right: 15px; font-size: 15px;">
                Hola, <strong>${USUARIO_ACTUAL.nombre}</strong>
            </span>
            <button id="btn-logout" class="btn-ver-mas" style="background-color: var(--color-secundario);">
                Cerrar sesión
            </button>
        `;

        document.getElementById('btn-logout').addEventListener('click', () => {
            AuthService.logout(); 
            window.location.reload(); 
        });
        
    } else {
        authContainer.innerHTML = `
            <a href="login.html" style="text-decoration: none; color: var(--color-secundario); font-weight: bold; margin-right: 15px; transition: color 0.3s;">Iniciar sesión</a>
            <a href="registro.html" class="btn-ver-mas" style="text-decoration: none;">Registrarse</a>
        `;
    }
}

// Ejecutamos la actualización del HUD inmediatamente
actualizarMenuUsuario();

/* === 2. CARGA DE DATOS (Red / I/O) === */
document.addEventListener('DOMContentLoaded', function() {
    // Si no hay usuario logueado, redirigir a login de inmediato
    if (!USUARIO_ACTUAL) {
        window.location.href = 'login.html';
        return;
    }

    // Cargar la "base de datos"
    fetch("recetas.json")
        .then(respuesta => respuesta.json())
        .then(datos => {
            db = datos;

            if (!localStorage.getItem('db_favoritos')) {
                localStorage.setItem('db_favoritos', JSON.stringify(datos.favoritos));
            }

            // Una vez descargados los datos, buscamos y pintamos los favoritos
            obtenerRecetasFavoritas();
            renderizarFavoritos();
        })
        .catch(error => {
            console.error("Error al cargar las recetas:", error);
            mostrarError("No se pudieron cargar las recetas. Intenta más tarde.");
        });
});

/* === 3. LÓGICA DE NEGOCIO === */
function obtenerRecetasFavoritas() {
    if (!USUARIO_ACTUAL || !db) return;

    // Leemos del disco duro local
    const favoritos = JSON.parse(localStorage.getItem('db_favoritos')) || [];
    const idUsuario = USUARIO_ACTUAL.idUsuario;

    // Filtramos solo los IDs que le pertenecen a este usuario
    const idsFavoritosUsuario = favoritos
        .filter(fav => fav.idUsuario === idUsuario)
        .map(fav => fav.idReceta);

    // Cruzamos los IDs con el catálogo completo de recetas
    recetasFavoritas = db.recetas.filter(receta => 
        idsFavoritosUsuario.includes(receta.idReceta)
    );
}

window.eliminarFavorito = function(idReceta) {
    if (!USUARIO_ACTUAL) return;

    const favoritos = JSON.parse(localStorage.getItem('db_favoritos')) || [];
    const index = favoritos.findIndex(fav => 
        fav.idUsuario === USUARIO_ACTUAL.idUsuario && fav.idReceta === idReceta
    );

    if (index > -1) {
        // Borramos el registro y guardamos a disco
        favoritos.splice(index, 1);
        localStorage.setItem('db_favoritos', JSON.stringify(favoritos));
        
        // Recalculamos la memoria y repintamos
        obtenerRecetasFavoritas();
        renderizarFavoritos();

        mostrarNotificacion("Receta eliminada de favoritos");
    }
};

/* === 4. MOTOR DE RENDERIZADO VISUAL === */
function renderizarFavoritos() {
    const contenedor = document.getElementById("contenedor-favoritos");
    const sinFavoritos = document.getElementById("sin-favoritos");

    if (recetasFavoritas.length === 0) {
        // Mostramos la vista de "No hay favoritos"
        contenedor.innerHTML = '';
        sinFavoritos.style.display = 'block';
        return;
    }

    // Ocultamos el mensaje de error y dibujamos las tarjetas
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
                         alt="${receta.nombre}" class="img-fluida">
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

/* === 5. UTILIDADES (UI/UX) === */
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

// Inyección de animaciones CSS para la notificación
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
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