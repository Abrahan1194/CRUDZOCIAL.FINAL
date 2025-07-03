document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const errorMsg = document.getElementById('error-msg');

    // Manejar el formulario de inicio de sesión
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            const users = storage.getUsers();
            const user = users.find(u => u.email === email && u.password === password);

            if (user) {
                // Guardar sesión del usuario
                sessionStorage.setItem('currentUser', JSON.stringify(user));
                // Redirigir según el rol
                if (user.role === 'admin') {
                    window.location.href = 'admin.html';
                } else {
                    window.location.href = 'index.html';
                }
            } else {
                errorMsg.textContent = 'Email o contraseña incorrectos.';
            }
        });
    }

    // Manejar el formulario de registro
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nombre = document.getElementById('nombre').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            const users = storage.getUsers();
            if (users.find(u => u.email === email)) {
                errorMsg.textContent = 'El email ya está registrado.';
                return;
            }

            const newUser = {
                id: Date.now(), // ID único
                nombre,
                email,
                password,
                role: 'user', // Rol por defecto
                pais: ''
            };

            users.push(newUser);
            storage.saveUsers(users);

            // Iniciar sesión automáticamente y redirigir
            sessionStorage.setItem('currentUser', JSON.stringify(newUser));
            window.location.href = 'index.html';
        });
    }
});