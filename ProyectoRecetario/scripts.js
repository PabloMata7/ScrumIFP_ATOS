fetch("recetas.json")
.then(respuesta => respuesta.json())
.then(datos => {

    const contenedor = document.getElementById("contenedor-recetas");

    datos.recetas.forEach(receta => {

        let ingredientes = "";

        receta.ingredientes.forEach(ing => {
            ingredientes += `<li>${ing}</li>`;
        });

        let htmlReceta = `
            <div>
                <h2>${receta.nombre}</h2>
                <p>${receta.descripcion}</p>
                <ul>${ingredientes}</ul>
            </div>
        `;

        contenedor.innerHTML += htmlReceta;

    });

});