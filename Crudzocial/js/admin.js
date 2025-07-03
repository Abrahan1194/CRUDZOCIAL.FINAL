document.addEventListener('DOMContentLoaded', () => {
    // Asegúrate de que storage y getCurrentUser estén disponibles globalmente
    // (desde storage.js y session.js que se cargan antes)

    const currentUser = getCurrentUser();

    // Redireccionar si no es admin o no hay sesión
    if (!currentUser || currentUser.role !== 'admin') {
        window.location.href = 'login.html'; // Ajusta la ruta a tu página de login si es diferente
        return; // Detener la ejecución del script
    }

    // Elementos del DOM
    const logoutButton = document.getElementById('logout');
    const adminPostForm = document.getElementById('admin-post-form');
    const adminNoteInput = document.getElementById('admin-note');
    const adminImageInput = document.getElementById('admin-image');
    const adminImageUrlInput = document.getElementById('admin-image-url');

    const adminPostsContainer = document.getElementById('admin-posts'); // Contenedor para el feed del admin
    const userList = document.getElementById('user-list');
    const noteList = document.getElementById('note-list');
    const imageList = document.getElementById('image-list');

    // --- Funciones de Gestión de Sesión ---
    logoutButton.addEventListener('click', () => {
        // Llama a la función de cierre de sesión de session.js
        if (typeof Session !== 'undefined' && typeof Session.logoutUser === 'function') {
            Session.logoutUser();
        } else {
            // Fallback si Session.logoutUser no existe (ej. borrar manualmente el usuario actual de sessionStorage)
            sessionStorage.removeItem('currentUser');
        }
        window.location.href = 'login.html';
    });

    // --- Funciones de Renderizado ---

    // Renderiza la lista de usuarios
    const renderUsers = () => {
        const users = storage.getUsers();
        userList.innerHTML = '';
        if (users.length === 0) {
            userList.innerHTML = '<li class="list-group-item text-muted">No hay usuarios registrados.</li>';
            return;
        }
        users.forEach(user => {
            const item = document.createElement('li');
            item.className = 'list-group-item d-flex justify-content-between align-items-center';
            item.innerHTML = `
                <span>${user.nombre} (${user.email}) - <strong>${user.role}</strong></span>
                ${user.role !== 'admin' ? `<button class="btn btn-sm btn-danger" onclick="deleteUser(${user.id})"><i class="bi bi-trash"></i></button>` : ''}
            `;
            userList.appendChild(item);
        });
    };

    // Renderiza la lista de notas del sistema
    const renderNotes = () => {
        const notes = storage.getNotes();
        const users = storage.getUsers(); // Necesario para buscar el nombre del usuario
        noteList.innerHTML = '';
        if (notes.length === 0) {
            noteList.innerHTML = '<li class="list-group-item text-muted">No hay notas publicadas en el sistema.</li>';
            return;
        }
        notes.forEach(note => {
            const user = users.find(u => u.id === note.userId);
            const item = document.createElement('li');
            item.className = 'list-group-item d-flex justify-content-between align-items-center';
            item.innerHTML = `
                <span>"${note.text}" (Por: ${user ? user.nombre : 'N/A'})</span>
                <button class="btn btn-sm btn-danger" onclick="deleteNote(${note.id})"><i class="bi bi-trash"></i></button>
            `;
            noteList.appendChild(item);
        });
    };

    // Renderiza la lista de imágenes del sistema
    const renderImages = () => {
        const images = storage.getImages();
        const users = storage.getUsers(); // Necesario para buscar el nombre del usuario
        imageList.innerHTML = '';
        if (images.length === 0) {
            imageList.innerHTML = '<li class="list-group-item text-muted">No hay imágenes publicadas en el sistema.</li>';
            return;
        }
        images.forEach(image => {
            const user = users.find(u => u.id === image.userId);
            const item = document.createElement('li');
            item.className = 'list-group-item d-flex justify-content-between align-items-center';
            item.innerHTML = `
                <span><a href="${image.url}" target="_blank">Ver Imagen</a> (De: ${user ? user.nombre : 'N/A'})</span>
                <button class="btn btn-sm btn-danger" onclick="deleteImage(${image.id})"><i class="bi bi-trash"></i></button>
            `;
            imageList.appendChild(item);
        });
    };

    // Función para mostrar una publicación individual en el feed del administrador
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
        adminPostsContainer.appendChild(colDiv);
    };

    // Cargar publicaciones del administrador al inicio
    const loadAndDisplayAdminPosts = () => {
        adminPostsContainer.innerHTML = ''; // Limpiar antes de cargar
        const savedPosts = storage.getAdminPosts() || []; // Usar storage.getAdminPosts()

        if (savedPosts.length === 0) {
            adminPostsContainer.innerHTML = '<div class="col-12 text-center text-muted">No has realizado publicaciones como administrador.</div>';
            return;
        }
        // Mostrar las publicaciones más recientes primero
        savedPosts.slice().reverse().forEach(displayAdminPost);
    };

    // --- Funciones de Eliminación (accesibles globalmente para onclick) ---
    // Estas funciones son llamadas directamente desde el HTML con onclick.
    // Se aseguran de que los datos se eliminen del storage y las vistas se actualicen.
    window.deleteUser = (id) => {
        if (confirm('¿Estás seguro de que quieres eliminar a este usuario? Esta acción es irreversible.')) {
            let users = storage.getUsers();
            users = users.filter(user => user.id !== id);
            storage.saveUsers(users);
            renderAll(); // Volver a renderizar todo para reflejar el cambio
            alert('Usuario eliminado con éxito.');
        }
    };

    window.deleteNote = (id) => {
        if (confirm('¿Estás seguro de que quieres eliminar esta nota?')) {
            let notes = storage.getNotes();
            notes = notes.filter(note => note.id !== id);
            storage.saveNotes(notes);
            // También eliminar del feed de admin si es una publicación de admin asociada
            let adminPosts = storage.getAdminPosts();
            adminPosts = adminPosts.filter(post => post.id !== id); // Filtrar por el mismo ID
            storage.saveAdminPosts(adminPosts);
            renderAll();
            alert('Nota eliminada con éxito.');
        }
    };

    window.deleteImage = (id) => {
        if (confirm('¿Estás seguro de que quieres eliminar esta imagen?')) {
            let images = storage.getImages();
            images = images.filter(img => img.id !== id);
            storage.saveImages(images);
            // También eliminar del feed de admin si es una publicación de admin asociada
            let adminPosts = storage.getAdminPosts();
            adminPosts = adminPosts.filter(post => post.id !== id); // Filtrar por el mismo ID
            storage.saveAdminPosts(adminPosts);
            renderAll();
            alert('Imagen eliminada con éxito.');
        }
    };

    // --- Renderizado Inicial y Completo ---
    // Función que se llama para renderizar todos los elementos del panel.
    const renderAll = () => {
        renderUsers();
        renderNotes();
        renderImages();
        loadAndDisplayAdminPosts(); // Cargar y mostrar el feed del admin
    };

    // Render inicial al cargar la página
    renderAll();

    // --- Manejo del Formulario de Publicación del Administrador ---
    adminPostForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const noteText = adminNoteInput.value.trim();
        const imageFile = adminImageInput.files[0];
        const imageUrl = adminImageUrlInput.value.trim(); // Obtener la URL del input

        // Validar que al menos uno de los campos (nota, imagen local, URL) tenga contenido
        if (!noteText && !imageFile && !imageUrl) {
            alert('Por favor, ingresa una nota, sube una imagen o proporciona una URL de imagen para publicar.');
            return;
        }

        let imageToSave = null;

        // Prioridad: 1. Imagen local, 2. URL de imagen
        if (imageFile) {
            // Leer imagen local como Base64 (async)
            imageToSave = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = () => {
                    console.error("Error al leer el archivo de imagen.");
                    alert("No se pudo cargar la imagen desde el dispositivo.");
                    resolve(null);
                };
                reader.readAsDataURL(imageFile);
            });
        } else if (imageUrl) {
            // Usar la URL directamente
            imageToSave = imageUrl;
        }

        // Generar un ID único para la nueva publicación
        const newPostId = Date.now(); 

        const newPost = {
            id: newPostId,
            userId: currentUser.id, // Asociar al admin actual
            user: currentUser.nombre || 'Administrador', // Nombre del admin
            note: noteText,
            image: imageToSave,
            date: new Date().toLocaleString() // Fecha y hora de la publicación
        };

        // Guardar la publicación en el almacenamiento de posts del admin
        let adminPosts = storage.getAdminPosts() || [];
        adminPosts.push(newPost);
        storage.saveAdminPosts(adminPosts);

        // Si hay texto, guardarlo también como una nota global
        if (noteText) {
            const newNote = {
                id: newPostId, // Usar el mismo ID para correlacionar con el post
                userId: currentUser.id,
                text: noteText,
                date: newPost.date
            };
            let notes = storage.getNotes();
            notes.push(newNote);
            storage.saveNotes(notes); 
        }

        // Si hay imagen, guardarla también como una imagen global
        if (imageToSave) {
            const newImage = {
                id: newPostId, // Usar el mismo ID para correlacionar con el post
                userId: currentUser.id,
                url: imageToSave,
                date: newPost.date
            };
            let images = storage.getImages();
            images.push(newImage);
            storage.saveImages(images); 
        }

        // Limpiar el formulario después de la publicación
        adminNoteInput.value = '';
        adminImageInput.value = ''; 
        adminImageUrlInput.value = ''; 

        renderAll(); // Volver a renderizar todas las listas para reflejar los cambios
        alert('Publicación creada con éxito!');
    });
});
