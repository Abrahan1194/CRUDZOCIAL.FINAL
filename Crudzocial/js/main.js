document.addEventListener('DOMContentLoaded', () => {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const addNoteBtn = document.getElementById('add-note');
    const noteTextInput = document.getElementById('note-text');
    const noteListDiv = document.getElementById('note-list');

    const addImageBtn = document.getElementById('add-image');
    const imageUrlInput = document.getElementById('image-url');
    const imageListDiv = document.getElementById('image-list');
    
    const users = storage.getUsers();

    // ---- NOTAS ----
    const renderNotes = () => {
        const notes = storage.getNotes();
        noteListDiv.innerHTML = '';
        notes.slice().reverse().forEach(note => {
            const user = users.find(u => u.id === note.userId);
            const card = document.createElement('div');
            card.className = 'card mb-3';
            card.innerHTML = `
                <div class="card-body">
                    <p class="card-text">${note.text}</p>
                    <small class="text-muted">Publicado por: ${user ? user.nombre : 'Usuario desconocido'}</small>
                    ${note.userId === currentUser.id ? `<button class="btn btn-sm btn-outline-danger float-end" onclick="deleteNote(${note.id})"><i class="bi bi-trash"></i></button>` : ''}
                </div>
            `;
            noteListDiv.appendChild(card);
        });
    };

    addNoteBtn.addEventListener('click', () => {
        const text = noteTextInput.value.trim();
        if (text) {
            const notes = storage.getNotes();
            const newNote = {
                id: Date.now(),
                userId: currentUser.id,
                text
            };
            notes.push(newNote);
            storage.saveNotes(notes);
            noteTextInput.value = '';
            renderNotes();
        }
    });

    window.deleteNote = (id) => {
        let notes = storage.getNotes();
        notes = notes.filter(note => note.id !== id);
        storage.saveNotes(notes);
        renderNotes();
    };

    // ---- IMÁGENES ----
    const renderImages = () => {
        const images = storage.getImages();
        imageListDiv.innerHTML = '';
        images.slice().reverse().forEach(image => {
            const user = users.find(u => u.id === image.userId);
            const col = document.createElement('div');
            col.className = 'col';
            col.innerHTML = `
                <div class="card">
                    <img src="${image.url}" class="card-img-top" alt="Imagen" onerror="this.src='https://via.placeholder.com/400x300.png?text=Imagen+no+disponible'">
                    <div class="card-body">
                        <small class="text-muted">De: ${user ? user.nombre : 'Usuario desconocido'}</small>
                        ${image.userId === currentUser.id ? `<button class="btn btn-sm btn-outline-danger float-end" onclick="deleteImage(${image.id})"><i class="bi bi-trash"></i></button>` : ''}
                    </div>
                </div>
            `;
            imageListDiv.appendChild(col);
        });
    };

    addImageBtn.addEventListener('click', () => {
        const url = imageUrlInput.value.trim();
        if (url) {
            const images = storage.getImages();
            const newImage = {
                id: Date.now(),
                userId: currentUser.id,
                url
            };
            images.push(newImage);
            storage.saveImages(images);
            imageUrlInput.value = '';
            renderImages();
        }
    });

    window.deleteImage = (id) => {
        let images = storage.getImages();
        images = images.filter(img => img.id !== id);
        storage.saveImages(images);
        renderImages();
    };

    // Render inicial
    renderNotes();
    renderImages();
});