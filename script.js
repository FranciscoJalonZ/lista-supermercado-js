// Gestión de estados y selectores de UI
const form = document.getElementById('form-producto');
const listaContenedor = document.getElementById('lista-productos');

// Persistencia de datos local
let inventario = JSON.parse(localStorage.getItem('app_inventario')) || [];

/**
 * Persiste los cambios en el almacenamiento local y actualiza la vista
 */
const sincronizarDatos = () => {
    localStorage.setItem('app_inventario', JSON.stringify(inventario));
    render();
};

/**
 * Genera la interfaz de usuario basada en el estado actual del inventario
 */
const render = () => {
    listaContenedor.innerHTML = '';
    let totalComprados = 0;

    inventario.forEach((item, pos) => {
        const itemLi = document.createElement('li');
        if (item.completado) {
            itemLi.classList.add('producto-comprado');
            totalComprados++;
        }

        itemLi.innerHTML = `
            <span onclick="toggleStatus(${pos})" style="flex-grow: 1; cursor: pointer;">
                ${item.cant} x ${item.nombre}
            </span>
            <button class="btn-eliminar" onclick="remover(${pos})">Eliminar</button>
        `;
        listaContenedor.appendChild(itemLi);
    });

    // Actualización de indicadores
    document.getElementById('contador-total').textContent = inventario.length;
    document.getElementById('contador-comprados').textContent = totalComprados;
    document.getElementById('contador-pendientes').textContent = inventario.length - totalComprados;
};

// Controlador de envío de formulario
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = document.getElementById('nombre-producto').value.trim();
    const cant = parseInt(document.getElementById('cantidad-producto').value);

    if (nombre && cant > 0) {
        inventario.push({ nombre, cant, completado: false });
        document.getElementById('mensaje-error').classList.add('oculto');
        form.reset();
        sincronizarDatos();
    } else {
        document.getElementById('mensaje-error').classList.remove('oculto');
    }
});

// Funciones de control de artículos
window.toggleStatus = (i) => {
    inventario[i].completado = !inventario[i].completado;
    sincronizarDatos();
};

window.remover = (i) => {
    inventario.splice(i, 1);
    sincronizarDatos();
};

// Carga inicial de la aplicación
render();