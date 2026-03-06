let todasLasRecetas = [];
let recetasVisibles = [];
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

document.addEventListener('DOMContentLoaded', function() {
    fetch("recetas.json")
        .then(respuesta => respuesta.json())
        .then(datos => {
            todasLasRecetas = datos.recetas;
            recetasVisibles = todasLasRecetas; 
            
            if (!localStorage.getItem('db_favoritos')) {
                localStorage.setItem('db_favoritos', JSON.stringify(datos.favoritos));
            }
            
            renderizarTarjetas(recetasVisibles);
        })
        .catch(error => console.error("Error al cargar el JSON:", error));

    document.querySelector('.buscador').addEventListener('input', function() {
        const termino = this.value.toLowerCase().trim();

        if (termino === "") {
            recetasVisibles = todasLasRecetas;
        } else {
            recetasVisibles = todasLasRecetas.filter(receta =>
                receta.nombre.toLowerCase().includes(termino) ||
                receta.descripcion.toLowerCase().includes(termino) ||
                receta.ingredientes.some(ing => ing.toLowerCase().includes(termino))
            );
        }
        renderizarTarjetas(recetasVisibles);
    });
});

function esRecetaFavorita(idReceta) {
    if (!USUARIO_ACTUAL) return false; 
    const favoritos = JSON.parse(localStorage.getItem('db_favoritos')) || [];
    return favoritos.some(fav => fav.idUsuario === USUARIO_ACTUAL.idUsuario && fav.idReceta === idReceta);
}

window.toggleFavorito = function(idReceta) {
    if (!USUARIO_ACTUAL) {
        alert("Debes iniciar sesión para guardar favoritos.");
        return;
    }
    
    const favoritos = JSON.parse(localStorage.getItem('db_favoritos')) || [];
    const index = favoritos.findIndex(fav => fav.idUsuario === USUARIO_ACTUAL.idUsuario && fav.idReceta === idReceta);
    
    if (index > -1) {
        favoritos.splice(index, 1);
    } else {
        favoritos.push({ idUsuario: USUARIO_ACTUAL.idUsuario, idReceta: idReceta });
    }
    
    localStorage.setItem('db_favoritos', JSON.stringify(favoritos));
    
    renderizarTarjetas(recetasVisibles); 
};

function renderizarTarjetas(recetas) {
    const contenedor = document.getElementById("contenedor-tarjetas");
    
    if (recetas.length === 0) {
        contenedor.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; font-size: 18px; color: var(--color-secundario);">No se han encontrado recetas.</p>';
        return;
    }

    let htmlAcumulado = "";
    recetas.forEach(receta => {
        const iconoCorazon = esRecetaFavorita(receta.idReceta) ? '❤️' : '🤍';
        
        let ingredientesHTML = "";
        receta.ingredientes.forEach(ing => {
            ingredientesHTML += `<li>${ing}</li>`;
        });

        htmlAcumulado += `
            <div class="tarjeta">
                <div class="tarjeta-img">
                    <img src="${receta.imagen.startsWith('http') ? receta.imagen : 'recursos/' + receta.imagen}" alt="${receta.nombre}" class="img-fluida">
                </div>
                <div class="tarjeta-contenido">
                    <h3>${receta.nombre}</h3>
                    <p>${receta.descripcion}</p>
                    <div class="tarjeta-ingredientes">
                        <strong>Ingredientes:</strong>
                        <ul>${ingredientesHTML}</ul>
                    </div>
                    <div class="botones-tarjeta">
                        <a href="Detalles.html?id=${receta.idReceta}" class="btn-ver-mas" style="text-decoration: none; text-align: center;">Ver más</a>
                        <button class="btn-fav" onclick="toggleFavorito(${receta.idReceta})">${iconoCorazon}</button>
                    </div>
                </div>
            </div>
        `;
    });
    contenedor.innerHTML = htmlAcumulado;
}