// js/session.js

// Escucha cuando el DOM esté completamente cargado para ejecutar el script
document.addEventListener('DOMContentLoaded', () => {
    // Obtiene el usuario actual de sessionStorage
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    // Obtiene el nombre del archivo de la página actual (ej. 'admin.html', 'profile.html')
    const currentPage = window.location.pathname.split('/').pop();

    // Define las páginas que requieren que un usuario esté autenticado
    const protectedPages = ['dashboard.html', 'profile.html', 'admin.html']; 
    
    // Protege las páginas generales que requieren autenticación
    // Si la página actual está en protectedPages Y no hay un usuario logueado, redirige a login.html
    if (protectedPages.includes(currentPage) && !currentUser) {
        window.location.href = 'login.html';
        return; // Detiene la ejecución del script
    }

    // Protege específicamente la página de administración
    // Si la página actual es admin.html Y (no hay usuario logueado O el rol del usuario no es 'admin'), redirige
    if (currentPage === 'admin.html' && (!currentUser || currentUser.role !== 'admin')) {
        window.location.href = 'dashboard.html'; // Redirige a los no-administradores a su panel principal
        return; // Detiene la ejecución del script
    }

    // Maneja la funcionalidad del botón de cerrar sesión
    const logoutButton = document.getElementById('logout');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            // Elimina el usuario actual de sessionStorage
            sessionStorage.removeItem('currentUser');
            // Redirige a la página de login después de cerrar sesión
            window.location.href = 'login.html';
        });
    }
});

/**
 * Función global para obtener el usuario actualmente logueado.
 * Esto facilita que otros scripts (como admin.js y profile.js) accedan a los datos del usuario.
 * @returns {Object|null} El objeto del usuario actual si ha iniciado sesión, de lo contrario null.
 */
function getCurrentUser() {
    // Recupera y parsea el elemento 'currentUser' de sessionStorage
    return JSON.parse(sessionStorage.getItem('currentUser'));
}

// Hace la función getCurrentUser globalmente accesible.
// Esto es crucial para admin.js y profile.js que dependen de ella.
window.getCurrentUser = getCurrentUser;

// (Opcional) También podrías exponer un objeto 'Session' para consistencia,
// aunque getCurrentUser() como función global es suficiente para tus necesidades actuales.
/*
const Session = {
    getCurrentUser: () => JSON.parse(sessionStorage.getItem('currentUser')),
    setCurrentUser: (user) => sessionStorage.setItem('currentUser', JSON.stringify(user)),
    logoutUser: () => sessionStorage.removeItem('currentUser')
};
window.Session = Session;
*/