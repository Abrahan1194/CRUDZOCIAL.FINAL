// js/storage.js

/**
 * Inicializa los datos por defecto en localStorage si no existen.
 * Esto asegura que la aplicación tenga algunos datos precargados al inicio.
 */
function initializeData() {
    // Inicializar usuarios si no existen
    if (!localStorage.getItem('users')) {
        const defaultUsers = [
            { id: 1, nombre: 'Admin User', email: 'admin@crud.com', password: 'admin123', role: 'admin', pais: 'Colombia' },
            { id: 2, nombre: 'Juan Perez', email: 'juan@crud.com', password: 'user123', role: 'user', pais: 'México' }
        ];
        localStorage.setItem('users', JSON.stringify(defaultUsers));
    }

    // Inicializar notas si no existen
    if (!localStorage.getItem('notes')) {
        const defaultNotes = [
            { id: Date.now() + 1, userId: 2, text: '¡Esta es la primera nota en Crudzocial!', date: new Date().toLocaleString() },
            { id: Date.now() + 2, userId: 1, text: 'El administrador también puede publicar notas.', date: new Date().toLocaleString() }
        ];
        localStorage.setItem('notes', JSON.stringify(defaultNotes));
    }

    // Inicializar imágenes si no existen
    if (!localStorage.getItem('images')) {
        const defaultImages = [
            { id: Date.now() + 3, userId: 2, url: 'https://picsum.photos/id/237/400/300', date: new Date().toLocaleString() },
            { id: Date.now() + 4, userId: 1, url: 'https://picsum.photos/id/1/400/300', date: new Date().toLocaleString() }
        ];
        localStorage.setItem('images', JSON.stringify(defaultImages));
    }

    // Inicializar posts del administrador si no existen
    // Estos posts combinan notas e imágenes y se usan para el feed del administrador y el perfil de usuario.
    if (!localStorage.getItem('adminPosts')) {
        const defaultAdminPosts = [
            {
                id: Date.now() + 5,
                userId: 1,
                user: 'Admin User', // Nombre del admin
                note: '¡Bienvenido al panel de administración! Aquí podrás gestionar el contenido y los usuarios.',
                image: 'https://picsum.photos/id/1018/400/300', // Ejemplo de imagen por URL
                date: new Date().toLocaleString()
            },
            {
                id: Date.now() + 6,
                userId: 1,
                user: 'Admin User',
                note: 'Recordatorio: Mantén la comunidad segura y amigable. Publica contenido relevante y positivo.',
                image: null, // Solo nota
                date: new Date().toLocaleString()
            },
            {
                id: Date.now() + 7,
                userId: 1,
                user: 'Admin User',
                note: null, // Solo imagen
                image: 'https://picsum.photos/id/1025/400/300',
                date: new Date().toLocaleString()
            }
        ];
        localStorage.setItem('adminPosts', JSON.stringify(defaultAdminPosts));
    }
}

// Llama a la función de inicialización al cargar el script
initializeData();

/**
 * Objeto 'storage' para encapsular todas las operaciones de lectura/escritura en localStorage.
 * Proporciona una interfaz limpia para interactuar con los datos de la aplicación.
 */
const storage = {
    // --- Métodos para Usuarios ---
    getUsers: () => {
        return JSON.parse(localStorage.getItem('users')) || [];
    },
    saveUsers: (users) => {
        localStorage.setItem('users', JSON.stringify(users));
    },
    // Nota: La función deleteUser en admin.js maneja la lógica de filtro directamente.
    // Este método no es estrictamente necesario si siempre filtras en el JS principal.
    /* deleteUser: (id) => {
        let users = storage.getUsers();
        users = users.filter(user => user.id !== id);
        storage.saveUsers(users);
    }, */

    // --- Métodos para Notas (globales) ---
    getNotes: () => {
        return JSON.parse(localStorage.getItem('notes')) || [];
    },
    saveNotes: (notes) => {
        localStorage.setItem('notes', JSON.stringify(notes));
    },

    // --- Métodos para Imágenes (globales) ---
    getImages: () => {
        return JSON.parse(localStorage.getItem('images')) || [];
    },
    saveImages: (images) => {
        localStorage.setItem('images', JSON.stringify(images));
    },

    // --- Métodos para Publicaciones del Administrador (combinadas: nota +/o imagen) ---
    getAdminPosts: () => {
        return JSON.parse(localStorage.getItem('adminPosts')) || [];
    },
    saveAdminPosts: (posts) => {
        localStorage.setItem('adminPosts', JSON.stringify(posts));
    }
};

// Hacer el objeto 'storage' globalmente accesible para otros scripts.
// Esto es crucial si no estás utilizando módulos ES6 (import/export).
window.storage = storage;