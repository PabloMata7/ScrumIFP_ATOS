let listaRecetas = []; 
let recetaDestacadaIndex = 0;

fetch("recetas.json")
    .then(respuesta => respuesta.json())
    .then(datos => {
        listaRecetas = datos.recetas;

        const contenedor = document.getElementById("contenedor-tarjetas"); 
        
        let htmlAcumulado = ""; 

        listaRecetas.forEach(receta => {
            let ingredientes = "";
            
            receta.ingredientes.forEach(ing => {
                ingredientes += `<li>${ing}</li>`;
            });

            htmlAcumulado += `
                <div class="tarjeta">
                    <div class="tarjeta-img">Img</div>
                    <h3>${receta.nombre}</h3>
                    <p>${receta.descripcion}</p>
                    <ul style="margin-left: 20px; font-size: 12px;">${ingredientes}</ul>
                </div>
            `;
        });

        contenedor.innerHTML = htmlAcumulado;

        actualizarCarrusel();
    })
    .catch(error => console.error("Error cargando el JSON:", error));


function actualizarCarrusel() {
    if (listaRecetas.length === 0) return; 
    
    const display = document.getElementById("carrusel-display");
    const recetaActual = listaRecetas[recetaDestacadaIndex];
    
    display.innerText = `Foto de: ${recetaActual.nombre}`;
}

document.getElementById("btn-next").addEventListener("click", () => {
    if (listaRecetas.length === 0) return;
    
    recetaDestacadaIndex = (recetaDestacadaIndex + 1) % listaRecetas.length;
    actualizarCarrusel();
});

document.getElementById("btn-prev").addEventListener("click", () => {
    if (listaRecetas.length === 0) return;
    
    recetaDestacadaIndex = (recetaDestacadaIndex - 1 + listaRecetas.length) % listaRecetas.length;
    actualizarCarrusel();
});
    