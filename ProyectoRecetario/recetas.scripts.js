let todasLasRecetas = [];

document.addEventListener('DOMContentLoaded', function() {
    fetch("recetas.json")
        .then(respuesta => respuesta.json())
        .then(datos => {
            todasLasRecetas = datos.recetas;
            renderizarTarjetas(todasLasRecetas);
        })
        .catch(error => {
            console.error("Error al cargar el JSON:", error);
        });

  document.querySelector('.buscador').addEventListener('input', function() {
        const termino = this.value.toLowerCase().trim();

        if (termino === "") {
            renderizarTarjetas(todasLasRecetas);
            return;
        }

        const filtradas = todasLasRecetas.filter(receta =>
            receta.nombre.toLowerCase().includes(termino) ||
            receta.descripcion.toLowerCase().includes(termino) ||
            receta.ingredientes.some(ing => ing.toLowerCase().includes(termino))
        );

        renderizarTarjetas(filtradas);
    });
});

function renderizarTarjetas(recetas) {
    const contenedor = document.getElementById("contenedor-tarjetas");

    if (recetas.length === 0) {
        // Mensaje cuando el buscador no encuentra nada
        contenedor.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; font-size: 18px; color: var(--color-secundario);">No se han encontrado recetas.</p>';
        return;
    }

    let htmlAcumulado = "";

    recetas.forEach(receta => {
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
                        <button class="btn-fav">🤍</button>
                    </div>
                </div>
            </div>
        `;
    });

    contenedor.innerHTML = htmlAcumulado;
}