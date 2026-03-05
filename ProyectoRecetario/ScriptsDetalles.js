document.addEventListener('DOMContentLoaded', function () {
    // Gestión de visibilidad de imagen
    const img = document.getElementById('receta-img');
    const placeholder = document.getElementById('img-placeholder');

    img.addEventListener('load', function () {
        if (img.src && img.src !== window.location.href) {
            img.style.display = 'block';
            placeholder.style.display = 'none';
        }
    });

    img.addEventListener('error', function () {
        img.style.display = 'none';
        placeholder.style.display = 'flex';
    });

    // Numeración visual de los pasos
    const observer = new MutationObserver(() => {
        const pasos = document.querySelectorAll('#pasos li');
        pasos.forEach((li, i) => {
            if (!li.querySelector('.paso-num')) {
                const text = li.textContent;
                li.innerHTML = `<div class="paso-num">${i + 1}</div><div class="paso-text">${text}</div>`;
            }
        });
    });
    observer.observe(document.getElementById('pasos'), { childList: true });

    // Obtener el ID de la receta de la URL
    const params = new URLSearchParams(window.location.search);
    const idReceta = params.get('id');

    if (!idReceta) {
        document.getElementById('titulo').innerHTML = 'Error: No se especificó una receta.';
        return;
    }

    fetch("recetas.json")
        .then(respuesta => respuesta.json())
        .then(datos => {
            // Buscar la receta con el ID
            const receta = datos.recetas.find(r => r.idReceta === parseInt(idReceta));

            if (!receta) {
                document.getElementById('titulo').innerHTML = 'Error: Receta no encontrada.';
                return;
            }

            // Rellenar título y descripción
            document.getElementById('titulo').textContent = receta.nombre;
            document.getElementById('receta-img').src = receta.imagen;
            document.getElementById('receta-img').alt = receta.nombre;
            document.getElementById('descripcion').textContent = receta.descripcion;

            // Rellenar ingredientes
            let ingredientesHTML = receta.ingredientes.map(ing => `<li>${ing}</li>`).join('');
            document.getElementById('ingredientes').innerHTML = ingredientesHTML;

            // Rellenar pasos
            let pasosHTML = receta.pasos.map(paso => `<li>${paso}</li>`).join('');
            document.getElementById('pasos').innerHTML = pasosHTML;
        })
        .catch(error => {
            console.error("Error al cargar la receta:", error);
            document.getElementById('titulo').innerHTML = 'Error al cargar los datos.';
        });
});