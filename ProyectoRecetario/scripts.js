/* === 1. ESTADO GLOBAL (Memoria) === */
let db = null; 
const USUARIO_ACTUAL = 1;

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
        renderizarTarjetas();
        actualizarCarrusel();
    })
    .catch(error => console.error("Error crítico cargando el JSON:", error));

/* === 3. LÓGICA DE NEGOCIO === */
function esRecetaFavorita(idReceta) {
    if (!db || !db.favoritos) return false; 
    return db.favoritos.some(fav => fav.idUsuario === USUARIO_ACTUAL && fav.idReceta === idReceta);
}

// Función global para el botón de favoritos
window.toggleFavorito = function(idReceta) {
    if (!db) return; 
    
    const index = db.favoritos.findIndex(fav => fav.idUsuario === USUARIO_ACTUAL && fav.idReceta === idReceta);
    
    if (index > -1) {
        db.favoritos.splice(index, 1);
    } else {
        db.favoritos.push({ idUsuario: USUARIO_ACTUAL, idReceta: idReceta });
    }
    
    renderizarTarjetas();
};

/* === 4. MOTOR DE RENDERIZADO VISUAL === */
function renderizarTarjetas() {
    if (!db) return;
    
    const contenedor = document.getElementById("contenedor-tarjetas"); 
    if (!contenedor) return; // Guarda de seguridad para la página que no lo tenga

    let htmlAcumulado = ""; 

    db.recetas.forEach(receta => {
        const iconoCorazon = esRecetaFavorita(receta.idReceta) ? '❤️' : '🤍';
        
        let ingredientesHTML = "";
        receta.ingredientes.forEach(ing => {
            ingredientesHTML += `<li>${ing}</li>`;
        });

        // FUSIÓN: Estructura mejorada + Enlace Detalles.html (Desde rama origin/DJ)
        htmlAcumulado += `
            <div class="tarjeta">
                <div class="tarjeta-img">
                    <img src="recursos/${receta.imagen}" alt="${receta.nombre}" class="img-fluida">
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
    if (!display) return; // Evita el crasheo en recetas.html
   
    // Inyectamos la imagen estática correspondiente al índice
    display.innerHTML= `<img src="${imagenes[recetaDestacadaIndex]}" alt="Receta" style="width: 100%; height: 100%; object-fit: cover; border-radius: 12px;">`;
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