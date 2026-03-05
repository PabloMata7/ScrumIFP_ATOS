/* === 1. ESTADO GLOBAL (Memoria) === */
let db = null; 
const USUARIO_ACTUAL = AuthService.obtenerUsuarioActual();

// Carrousel estático (Desde rama HEAD)
let recetaDestacadaIndex = 0;
const imagenes = [
    "recursos/tortilla-patata.png",
    "recursos/paella-valenciana.png",
    "recursos/Gazpacho.png",     
    "recursos/croquetas.png",
    "recursos/Ensalada-cesar.png" 
];

/* === 2. INICIALIZACIÓN (Red) === */
fetch("recetas.json")
    .then(respuesta => respuesta.json())
    .then(datos => {
        db = datos; 

        if (!localStorage.getItem('db_favoritos')) {
            localStorage.setItem('db_favoritos', JSON.stringify(datos.favoritos));
        }

        renderizarTarjetas();
        actualizarCarrusel();
    })
    .catch(error => console.error("Error crítico cargando el JSON:", error));

/* === 3. LÓGICA DE NEGOCIO === */
function esRecetaFavorita(idReceta) {
    if (!USUARIO_ACTUAL) return false; 
    const favoritos = JSON.parse(localStorage.getItem('db_favoritos')) || [];
    return favoritos.some(fav => fav.idUsuario === USUARIO_ACTUAL.idUsuario && fav.idReceta === idReceta);
}

window.toggleFavorito = function(idReceta) {
    if (!USUARIO_ACTUAL) {
        alert("Debes iniciar sesión para poder guardar recetas en favoritos.");
        return; 
    }
    
    const favoritos = JSON.parse(localStorage.getItem('db_favoritos')) || [];
    const index = favoritos.findIndex(fav => fav.idUsuario === USUARIO_ACTUAL.idUsuario && fav.idReceta === idReceta);
    
    if (index > -1) {
        favoritos.splice(index, 1); 
    } else {
        favoritos.push({ idUsuario: USUARIO_ACTUAL.idUsuario, idReceta: idReceta }); 
    }
    
    // Escritura a disco (I/O)
    localStorage.setItem('db_favoritos', JSON.stringify(favoritos));
    
    // Repintamos la interfaz
    renderizarTarjetas();
};

/* === 4. MOTOR DE RENDERIZADO VISUAL === */
function renderizarTarjetas() {
    if (!db) return;
    
    const contenedor = document.getElementById("contenedor-tarjetas"); 
    if (!contenedor) return; 

    let htmlAcumulado = ""; 

    const recetasPreview = db.recetas.slice(0, 4);

    recetasPreview.forEach(receta => {
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
                        <ul>
                            ${ingredientesHTML}
                        </ul>
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

/* === 5. CARRUSEL Y EVENTOS === */
function actualizarCarrusel() {
    const display = document.getElementById("carrusel-display");
    if (!display) return; 
   
    // Solo inyectamos la estructura semántica. El CSS se encargará de las dimensiones.
    display.innerHTML = `<img src="${imagenes[recetaDestacadaIndex]}" alt="Receta destacada">`;
}

// Botones del carrusel protegidos contra punteros nulos
const btnNext = document.getElementById("btn-next");
const btnPrev = document.getElementById("btn-prev");

if (btnNext) {
    btnNext.addEventListener("click", () => {
        recetaDestacadaIndex = (recetaDestacadaIndex + 1) % imagenes.length;
        actualizarCarrusel();
    });
}

if (btnPrev) {
    btnPrev.addEventListener("click", () => {
        recetaDestacadaIndex = (recetaDestacadaIndex - 1 + imagenes.length) % imagenes.length;
        actualizarCarrusel();
    });
}

// Renderizamos el carrusel inicial (antes del fetch, porque usa array local)
actualizarCarrusel();