document.addEventListener('DOMContentLoaded', function() {
    fetch("recetas.json")
        .then(respuesta => respuesta.json())
        .then(datos => {
            const contenedor = document.getElementById("contenedor-tarjetas");
            
            let htmlAcumulado = "";

            datos.recetas.forEach(receta => {
                
                let ingredientesHTML = "";
                receta.ingredientes.forEach(ing => {
                    ingredientesHTML += `<li>${ing}</li>`;
                });

                htmlAcumulado += `
                    <div class="tarjeta">
                        <div class="tarjeta-img">Img</div>
                        <h3>${receta.nombre}</h3>
                        <p>${receta.descripcion}</p>
                        
                        <div class="tarjeta-ingredientes">
                            <strong>Ingredientes:</strong>
                            <ul>
                                ${ingredientesHTML}
                            </ul>
                        </div>

                        <div class="botones-tarjeta">
                            <a href="Detalles.html?id=${receta.idReceta}" class="btn-ver-mas">Ver más</a>
                            <button class="btn-fav">🤍</button>
                        </div>
                    </div>
                `;
            });

            contenedor.innerHTML = htmlAcumulado;

        })
        .catch(error => {
            console.error("Error crítico al cargar el JSON:", error);
        });
});