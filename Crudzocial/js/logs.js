// Registra una accion en el historial de logs
function logAction(email, action) {
    const logs = getData('logs'); // Obtiene los logs almacenados
    logs.push({
        usuario: email,
        fecha: new Date().toLocaleString(), // Fecha y hora actual
        accion: action
    });
    setData('logs', logs); // Guarda los logs actualizados
}

// Muestra los logs en el contenedor indicado
function renderLogs(containerId, isAdmin) {
    const container = document.getElementById(containerId); // Contenedor destino
    const sessionUser = getSessionUser(); // Usuario actual en sesion
    const logs = getData('logs'); // Todos los logs

    // Filtra los logs segun si es admin o no
    const filtered = isAdmin ? logs : logs.filter(log => log.usuario === sessionUser.email);

    // Genera el HTML con los logs filtrados
    container.innerHTML = filtered.map(log => 
        `<div class="border-bottom py-2">
            <strong>${log.usuario}</strong> - ${log.accion} 
            <br><small>${log.fecha}</small>
        </div>`
    ).join('');
}

