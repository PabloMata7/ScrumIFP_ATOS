document.addEventListener("DOMContentLoaded", function () {

    const parametros = new URLSearchParams(window.location.search);
    const id = parametros.get("id");

    fetch("recetas.json")
        .then(res => res.json())
        .then(datos => {

            const receta = datos.recetas.find(r => r.idReceta == id);

            document.getElementById("titulo").textContent = receta.nombre;
            document.getElementById("descripcion").textContent = receta.descripcion;

            const listaIngredientes = document.getElementById("ingredientes");
            receta.ingredientes.forEach(ing => {
                const li = document.createElement("li");
                li.textContent = ing;
                listaIngredientes.appendChild(li);
            });

            const listaPasos = document.getElementById("pasos");
            receta.pasos.forEach(paso => {
                const li = document.createElement("li");
                li.textContent = paso;
                listaPasos.appendChild(li);
            });

        });

});