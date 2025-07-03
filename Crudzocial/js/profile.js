document.addEventListener('DOMContentLoaded', () => {
    // Asegúrate de que 'getCurrentUser' y 'storage' estén disponibles globalmente
    // (desde session.js y storage.js que se cargan antes)

    const currentUser = getCurrentUser(); // Obtiene el usuario actual de la sesión

    // Redirige al login si no hay un usuario logueado
    if (!currentUser) {
        window.location.href = 'login.html'; // Ajusta la ruta a tu página de login si es diferente
        return;
    }

    // Elementos del DOM para la información del perfil
    const profileUsernameSpan = document.getElementById('profile-username');
    const profileEmailSpan = document.getElementById('profile-email');
    const profileRoleSpan = document.getElementById('profile-role');
    const logoutButton = document.getElementById('logout');

    // Elemento del DOM para el feed de publicaciones del administrador
    const adminPostsFeed = document.getElementById('admin-posts-feed');

    // --- Rellenar la información del perfil del usuario ---
    profileUsernameSpan.textContent = currentUser.nombre || currentUser.username; // Usa nombre o username
    profileEmailSpan.textContent = currentUser.email;
    profileRoleSpan.textContent = currentUser.role;

    // --- Función para mostrar una publicación individual del administrador ---
    const displayAdminPost = (post) => {
        const colDiv = document.createElement("div");
        // Usamos col-md-6 y col-lg-4 para un diseño responsivo en cuadrícula
        colDiv.className = "col-md-6 col-lg-4 mb-4"; 

        const cardDiv = document.createElement("div");
        cardDiv.className = "card h-100 shadow-sm rounded-3"; // h-100 asegura que todas las tarjetas tengan la misma altura

        let cardBodyContent = '';

        if (post.image) {
            cardBodyContent += `<img src="${post.image}" class="card-img-top img-fluid rounded-top-3" alt="Publicación del Administrador">`;
        }

        cardBodyContent += `
            <div class="card-body d-flex flex-column">
                ${post.note ? `<p class="card-text">${post.note}</p>` : ''}
                <div class="mt-auto pt-2 border-top text-muted text-end">
                    <small>${post.user} - ${post.date}</small>
                </div>
            </div>
        `;
        
        cardDiv.innerHTML = cardBodyContent;
        colDiv.appendChild(cardDiv);
        adminPostsFeed.appendChild(colDiv);
    };

    // --- Cargar y mostrar todas las publicaciones del administrador ---
    const loadAndDisplayAdminPosts = () => {
        adminPostsFeed.innerHTML = ''; // Limpiar el feed antes de cargar nuevas publicaciones
        const adminPosts = storage.getAdminPosts() || []; // Obtener posts del administrador

        if (adminPosts.length === 0) {
            adminPostsFeed.innerHTML = '<div class="col-12 text-center text-muted">No hay publicaciones del administrador disponibles aún.</div>';
            return;
        }

        // Mostrar las publicaciones más recientes primero
        adminPosts.slice().reverse().forEach(displayAdminPost); 
    };

    // --- Manejar el cierre de sesión ---
    logoutButton.addEventListener('click', () => {
        // Llama a la función de cierre de sesión de session.js
        if (typeof Session !== 'undefined' && typeof Session.logoutUser === 'function') {
            Session.logoutUser();
        } else {
            // Fallback si Session.logoutUser no existe (ej. borrar currentUser de sessionStorage)
            sessionStorage.removeItem('currentUser');
        }
        window.location.href = 'login.html'; // Redirige a la página de login
    });

    // --- Ejecutar funciones al cargar la página ---
    loadAndDisplayAdminPosts(); // Cargar las publicaciones del administrador al inicio
});