// Carrito almacenado en localStorage
let carrito;
try {
    carrito = JSON.parse(localStorage.getItem('carrito')) || [];
} catch (e) {
    console.error('Error al parsear el carrito desde localStorage:', e);
    carrito = [];
}
// Función para agregar un producto al carrito
function comprar(producto, precio) {
    const index = carrito.findIndex(item => item.producto === producto);

    if (index !== -1) {
        // Si el producto ya está en el carrito, incrementa la cantidad
        carrito[index].cantidad += 1;
        carrito[index].subtotal += precio;
    } else {
        // Si no está, agrega un nuevo objeto
        carrito.push({ producto, precio, cantidad: 1, subtotal: precio });
    }
    console.log(`Producto: ${producto}, Precio: ${precio}`);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    alert(`${producto} ha sido agregado al carrito.`);
}

// Función para mostrar el carrito en el HTML
function mostrarCarrito() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    if (carrito.length === 0) {
        cartItems.innerHTML = '<tr><td colspan="4">No hay productos en el carrito.</td></tr>';
        cartTotal.textContent = '0';
        return;
    }

    // Mostrar los productos con sus columnas
    cartItems.innerHTML = carrito
        .map((item, index) => `
            <tr>
                <td>${item.producto}</td>
                <td>$${item.precio}</td>
                <td>
                    <button onclick="actualizarCantidad(${index}, -1)" class="btn btn-sm btn-danger">-</button>
                    ${item.cantidad}
                    <button onclick="actualizarCantidad(${index}, 1)" class="btn btn-sm btn-success">+</button>
                </td>
                <td>$${item.subtotal}</td>
            </tr>
        `)
        .join('');

    // Calcular el total
    const total = carrito.reduce((sum, item) => sum + item.subtotal, 0);
    cartTotal.textContent = total;
}
mostrarCarrito();
// Función para actualizar la cantidad de un producto
function actualizarCantidad(index, cambio) {
    if (index < 0 || index >= carrito.length) {
        console.error('Índice fuera de rango:', index);
        return;
    }
    carrito[index].cantidad += cambio;

    if (carrito[index].cantidad <= 0) {
        // Si la cantidad llega a 0, eliminar el producto
        carrito.splice(index, 1);
    } else {
        // Actualizar el subtotal
        carrito[index].subtotal = carrito[index].cantidad * carrito[index].precio;
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    mostrarCarrito(); // Actualiza la vista
}

// Si estamos en carrito.html, mostrar el carrito al cargar la página
if (document.getElementById('cart')) {
    mostrarCarrito();
}

// Función para vaciar el carrito con confirmación usando SweetAlert
function vaciarCarrito() {
    Swal.fire({
        title: '¿Estás seguro?',
        text: 'Se eliminarán todos los productos del carrito.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, vaciar carrito',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            // Vaciar el carrito
            carrito = [];
            localStorage.removeItem('carrito');
            mostrarCarrito(); // Actualiza la vista

            // Mostrar alerta de éxito
            Swal.fire(
                'Carrito vacío',
                'El carrito se ha vaciado correctamente.',
                'success'
            );
        }
    });
}

// Botón para finalizar la compra con sweet Alert
const finalizarCompraBtn = document.getElementById('finalizar-compra').addEventListener('click', () => {
    Swal.fire({
        title: 'Compra Procesada',
        text: 'Se ha procesado la compra #1200. Serás redireccionado para completar el pago.',
        icon: 'success',
        confirmButtonText: 'Aceptar'
    });

    // Limpiar el carrito después de finalizar la compra
    localStorage.removeItem('carrito');

    // Redirigir al inicio despues de 4 segundos
    setTimeout(() => {
        window.location.href = 'formDeCompra.html';
    }, 4000);
});