let db = null; 
const USUARIO_ACTUAL = 1;

// Carrousel ----------------------------
let recetaDestacadaIndex = 0;
const imagenes = [
    "recursos/tortilla-patata.png",
    "recursos/paella-valenciana.png",
    "recursos/Gazpacho.png",     
    "recursos/croquetas.png",
    "recursos/Ensalada-cesar.png" 
];
//-----------------------------------------

fetch("recetas.json")
    .then(respuesta => respuesta.json())
    .then(datos => {
        db = datos; 
        
        renderizarTarjetas();
        actualizarCarrusel();
    })
    .catch(error => console.error("Error cargando el JSON:", error));

function esRecetaFavorita(idReceta) {
    if (!db || !db.favoritos) return false; 
    
    return db.favoritos.some(fav => fav.idUsuario === USUARIO_ACTUAL && fav.idReceta === idReceta);
}

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

function renderizarTarjetas() {
    if (!db) return;
    
    const contenedor = document.getElementById("contenedor-tarjetas"); 
    let htmlAcumulado = ""; 

    db.recetas.forEach(receta => {
        const iconoCorazon = esRecetaFavorita(receta.idReceta) ? '❤️' : '🤍';
        
        let ingredientes = "";
        receta.ingredientes.forEach(ing => {
            ingredientes += `<li>${ing}</li>`;
        });

        htmlAcumulado += `
            <div class="tarjeta">
                <div class="tarjeta-img">Img</div>
                <h3>${receta.nombre}</h3>
                <p>${receta.descripcion}</p>
                
                <ul style="margin-left: 20px; margin-bottom: 15px; font-size: 12px; flex: 1;">
                    ${ingredientes}
                </ul>
                
                <div class="botones-tarjeta">
                    <button class="btn-ver-mas">Ver más</button>
                    <button class="btn-fav" onclick="toggleFavorito(${receta.idReceta})">${iconoCorazon}</button>
                </div>
            </div>
        `;
    });

    contenedor.innerHTML = htmlAcumulado;
}


//lo hacemos sin bbdd 
function actualizarCarrusel() {
    //if (!db || db.recetas.length === 0) return; 
    
    const display = document.getElementById("carrusel-display");

   
    //const recetaActual = db.recetas[recetaDestacadaIndex]
    display.innerHTML= `<img src="${imagenes[recetaDestacadaIndex]}" alt="Receta">`;
}

//boton para ver siguiente
document.getElementById("btn-next").addEventListener("click", () => {
    //if (!db) return;
    recetaDestacadaIndex = (recetaDestacadaIndex + 1) % imagenes.length;
    actualizarCarrusel();
});

//boton para ver anterior
document.getElementById("btn-prev").addEventListener("click", () => {
    //if (!db) return;
    recetaDestacadaIndex = (recetaDestacadaIndex - 1 + imagenes.length) % imagenes.length;
    actualizarCarrusel();
});

actualizarCarrusel(); //renderizamos el carrousel