// Obtengo el carrito en objeto
const contenedorCarrito = document.querySelector('#items2'); // selecciono el div en el que pondre la tabla de productos
const footer2 = document.querySelector('#footer2');

let json = JSON.parse(localStorage.getItem('carritoDeCompras'));

const templateFooter2 = document.querySelector('#template-footer2');




document.addEventListener('DOMContentLoaded', () => {
    contenedorCarrito.innerHTML = '';

    mostrarCarrito2();
})
contenedorCarrito.addEventListener('click', html => {
    btnAccion2(html)
})
const btnAccion2 = (html) => {
    if (html.target.classList.contains('sumar')) {
        const producto = json[html.target.dataset.id] // accedo al dataset.id que tiene todo el objeto

        producto.cantidad++;
        
        mostrarCarrito2(); // Para que se muestre la cantidad actualizada
    }
    if (html.target.classList.contains('restar')) {
        const producto = json[html.target.dataset.id] // Obtengo el id del boton y como el id contiene la información del producto entonces lo guardo en una constante
        producto.cantidad--;

        if (producto.cantidad === 0) {
            delete json[html.target.dataset.id] // 
        }

        mostrarCarrito2(); // Para que se muestre la cantidad actualizada
    }
    localStorage.setItem('carritoDeCompras', JSON.stringify(json));
}


const mostrarCarrito2 = () => {
    contenedorCarrito.innerHTML = '';
        Object.values(json).forEach(producto => {

            contenedorCarrito.innerHTML += `<tr>
                    
            <td>${producto.nombre}</td>
            <td>${producto.cantidad}</td>
            <td>
                <button id="boton-sumar" data-id="${producto.id}"class="sumar">+</button><button id="boton-restar" data-id="${producto.id}"class="restar">-</button>
            </td>
            <td>${producto.cantidad * producto.precio}</td>
            </tr>`
            mostrarFooter2();
            localStorage.setItem('carritoDeCompras', JSON.stringify(json));
            
        })
        
               
}    





const mostrarFooter2 = () => {
            
            footer2.innerHTML = '';
            const productosTotal = Object.values(json).reduce((cantidadOld, producto) => {
                return cantidadOld + producto.cantidad;
            },0 )
            const precioTotal = Object.values(json).reduce((precioOld, producto) => {
                return precioOld + producto.precio * producto.cantidad;
            },0)
            
            footer2.innerHTML = `<th>Total productos</th>
            <td>${productosTotal}</td>
            <td>
                <button class="vaciar-todo" id="vaciar-carrito2">
                    vaciar todo
                </button>
            </td>
            <td class="precio-footer2">$ <span>${precioTotal}</span></td>`
            

            const vaciarCarrito = document.getElementById('vaciar-carrito2');
            
                vaciarCarrito.addEventListener('click', () => {
                    json = {};
                    json = localStorage.setItem('carritoDeCompras', JSON.stringify(json));
                    mostrarCarrito2();
                    // contenedorCarrito.innerHTML = '';
                })
            
            

            if(Object.values(json).length === 0) {
                footer2.innerHTML = `<th>Carrito vacío :(</th>`
            }
        
}
