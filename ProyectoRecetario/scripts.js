let todasLasRecetas = [];

document.addEventListener('DOMContentLoaded', function() {
    fetch("recetas.json")
        .then(respuesta => respuesta.json())
        .then(datos => {
            todasLasRecetas = datos.recetas;
            renderizarTarjetas(todasLasRecetas);
        })
        .catch(error => {
            console.error("Error crítico al cargar el JSON:", error);
        });

    document.querySelector('.buscador').addEventListener('input', function() {
        const termino = this.value.toLowerCase().trim();

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
        contenedor.innerHTML = '<p>No se han encontrado recetas.</p>';
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
                <div class="tarjeta-img">Img</div>
                <h3>${receta.nombre}</h3>
                <p>${receta.descripcion}</p>
                <div class="tarjeta-ingredientes">
                    <strong>Ingredientes:</strong>
                    <ul>${ingredientesHTML}</ul>
                </div>
                <div class="botones-tarjeta">
                    <button class="btn-ver-mas">Ver más</button>
                    <button class="btn-fav">🤍</button>
                </div>
            </div>
        `;
    });

    contenedor.innerHTML = htmlAcumulado;
}