// El evento DOMContentLoaded asegura que el HTML esté completamente 
// dibujado en pantalla antes de que JS intente modificarlo.
document.addEventListener('DOMContentLoaded', iniciarApp);

async function iniciarApp() {
    // 1. Solicitamos el archivo JSON (Operación I/O asíncrona)
    const respuesta = await fetch('recetas.json');
    
    // 2. Deserializamos el texto JSON a objetos nativos de JavaScript
    const recetas = await respuesta.json();
    
    // 3. Pintamos la interfaz
    renderizarRecetas(recetas);
}

function renderizarRecetas(recetas) {
    const contenedor = document.getElementById('contenedor-recetas');
    
    // Iteramos sobre el array de objetos
    recetas.forEach(receta => {
        // Creamos un elemento div en el DOM para cada receta
        const tarjeta = document.createElement('div');
        tarjeta.className = 'tarjeta-receta';
        
        // Verificamos si esta receta está en favoritos (explicado abajo)
        const esFavorita = chequearSiEsFavorita(receta.id) ? '❤️' : '🤍';
        
        // Usamos Template Literals para inyectar los datos del JSON al HTML
        tarjeta.innerHTML = `
            <h2>${receta.titulo}</h2>
            <p>Tiempo: ${receta.tiempo}</p>
            <button onclick="alternarFavorito(${receta.id})">${esFavorita}</button>
        `;
        
        // Adjuntamos el nuevo nodo al árbol del DOM (la pantalla)
        contenedor.appendChild(tarjeta);
    });
}

function chequearSiEsFavorita(id) {
    // Leemos la memoria del navegador. Si no hay nada, devolvemos un array vacío '[]'
    const favoritos = JSON.parse(localStorage.getItem('misFavoritos')) || [];
    
    // Retorna true si el ID existe en el array
    return favoritos.includes(id);
}

function alternarFavorito(id) {
    let favoritos = JSON.parse(localStorage.getItem('misFavoritos')) || [];
    
    if (favoritos.includes(id)) {
        // Si ya era favorita, la sacamos del array (lógica de borrado)
        favoritos = favoritos.filter(favId => favId !== id);
    } else {
        // Si no era favorita, hacemos un push del ID al array
        favoritos.push(id);
    }
    
    // Volvemos a guardar el array actualizado en el navegador, serializado a String
    localStorage.setItem('misFavoritos', JSON.stringify(favoritos));
    
    // Recargamos la interfaz para actualizar los corazones
    // En una app real (React/Vue), esto es automático gracias al Virtual DOM.
    // Aquí limpiamos el contenedor y volvemos a llamar a iniciarApp().
    document.getElementById('contenedor-recetas').innerHTML = '';
    iniciarApp();
}