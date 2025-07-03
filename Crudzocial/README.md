# 🧠 CRUDZOCIAL - Red Social CRUD

CRUDZOCIAL es una aplicación web tipo red social que permite a los usuarios registrarse, iniciar sesión, agregar imágenes y notas, y visualizar su perfil como una galería personal. También incluye un panel de administración y registro de logs. Todo se guarda usando `localStorage` y `sessionStorage`.

---

## 🚀 Funcionalidades principales

- 🔐 Login con validación de correo y contraseña.
- 📝 Registro de usuarios con rol (`usuario` o `admin`).
- 👤 Perfil con galería de imágenes y notas personales.
- 🧾 Logs de acciones (login, creación de notas, etc).
- 🛠️ Panel de administración exclusivo para admins.
- 💾 Persistencia de datos en `localStorage`.
- 🔄 Control de sesión en `sessionStorage`.

---

## 📁 Estructura del proyecto

Crudzocial/
├── login.html
├── register.html
├── index.html
├── profile.html
├── admin.html
├── css/
│ └── *.css
├── js/
│ ├── auth.js
│ ├── profile.js
│ ├── admin.js
│ ├── logs.js
│ ├── session.js
│ └── storage.js

yaml
Copiar
Editar

---

## 👤 Usuario por defecto

Puedes usar este usuario para probar la app como administrador:

- **Correo:** `admin@crudzocial.com`
- **Contraseña:** `admin123`

---

## 🧪 Cómo usar el proyecto

1. Abre `login.html` en un navegador moderno.
2. Inicia sesión o regístrate como nuevo usuario.
3. Navega por las diferentes secciones: galería, notas, admin.

---

## ⚙️ Tecnologías usadas

- HTML, CSS y JavaScript
- Bootstrap (opcional)
- localStorage y sessionStorage (Web Storage API)

---

## 📄 Licencia

Este proyecto fue creado con fines educativos. Libre para modificar y mejorar.