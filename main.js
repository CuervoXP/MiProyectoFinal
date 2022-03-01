// Const

const contenedorCards = document.querySelector('.contenedor-cards');
const templateCard = document.querySelector('#template-card').content
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.querySelector('#template-carrito').content
const items = document.querySelector('#items');
const footer = document.getElementById('footer');
const fragment = document.createDocumentFragment();

// Let
let carrito = {};

// Eventos
contenedorCards.addEventListener('click', (html) => {
    addCarrito(html)
})

document.addEventListener('DOMContentLoaded', () => {
    obtenerDatos();
    if(localStorage.getItem('carritoDeCompras')) {
        carrito = JSON.parse(localStorage.getItem('carritoDeCompras')); // el valor de carrito va a pasar de texto plano, a un objeto,
        mostrarCarrito();
    }
})

items.addEventListener('click', html => {
    btnAccion(html)
})
const obtenerDatos = async() => {
    try {
        const res = await fetch('api.json'); // Espera a que se traiga a api.json
        const data = await res.json(); // Espera que respuesta sea json
        mostrarCards(data);
    } catch (error){ // De otro modo, mostrar error
        console.log(error);
    }
}

// Funciones

// Con querySelector obtengo las etiquetas, clases e ids de mi html
const mostrarCards = (data) => {
    data.forEach(producto => { // recorro data, que seria api.json
        templateCard.querySelector('.titulo-calza').textContent = producto.nombre;
        templateCard.querySelector('.card__precio-novedades').textContent = producto.precio;
        templateCard.querySelector('img').setAttribute("src", producto.img);
        templateCard.querySelector('button').dataset.id = producto.id;

        const clone = templateCard.cloneNode(true); // Clono la card tantas veces com el forEach pueda, actualizando para que no sea siempre la misma card con el mismo id, nombre, precio, etc

        fragment.appendChild(clone); // guardo el clone en un fragment para evitar o reducir el reflow
    });
    contenedorCards.appendChild(fragment); // pinto en contenedorCards la card que recorri con el forEach
}

const addCarrito = (html) => {
    if (html.target.classList.contains('boton-comprar')) { // Si el usuario hace click en una clase que contenga 'boton-comprar' entonces...
        setearCarrito(html.target.parentElement); // Obtengo todo el div padre
    }
    html.stopPropagation(); // Lo freno hasta ahi por si agrego mas eventos adentro de esta función.
}

const setearCarrito = objeto => { 
    const producto = { // Obtengo las etiquetas y con querySelector le asigno un valor a cada propiedad del objeto
        id: objeto.querySelector('.boton-comprar').dataset.id, 
        nombre: objeto.querySelector('.titulo-calza').textContent,
        precio: objeto.querySelector('.card__precio-novedades').textContent,
        cantidad: 1
    }

    if (carrito.hasOwnProperty(producto.id)) { // Si carrito ya tiene producto.id entonces...
        producto.cantidad = carrito[producto.id].cantidad + 1; // producto.cantidad va a ser igual a = accedo a la colección de objetos (carrito) despues accedo a la cantidad y le sumo 1
    }
    carrito[producto.id] = {...producto} // El id del producto va a contener la información de todo el producto "..."
    mostrarCarrito() // para ver los cambios, debo mostrar el carrito, asi que accedo a la funcio mostrarCarrito()
    // console.log(producto)
}

const mostrarCarrito = () => {
    items.innerHTML = '' // Para que no se sobreescriban los productos
    Object.values(carrito).forEach(producto => { // Accedo a mi template y le asigno el valor de producto.nombre, producto.cantidad, etc
        
        templateCarrito.querySelectorAll('td')[0].textContent = producto.nombre
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        templateCarrito.querySelectorAll('td')[3].textContent = producto.cantidad * producto.precio
        templateCarrito.querySelector('.sumar').dataset.id = producto.id
        templateCarrito.querySelector('.restar').dataset.id = producto.id

        const clone2 = templateCarrito.cloneNode(true); // Clono el template con sus propiedades y el forEach va cambiando la información de los elementos para que no sea siempre el mismo id, nombre, etc..
        fragment.appendChild(clone2); // guardo el clone en un fragment para evitar o reducir el reflow
    })
    items.appendChild(fragment); // pinto en contenedorCards la card que recorri con el forEach

    mostrarFooter(); // Muestro el footer

    localStorage.setItem('carritoDeCompras', JSON.stringify(carrito)); // seteo el item con una key llamada carritoDeCompras y paso a string el carrito
}

const mostrarFooter = () => {
    footer.innerHTML = ''; // para que no se sobreescriba la información
    

    // Aca use reduce, que basicamente compara todos los elementos de mi objeto, pero dentro del reduce especifico la propiedad cantidad y precio

    const productosTotal = Object.values(carrito).reduce((cantidadOld, producto) => {
        return cantidadOld + producto.cantidad;
    },0 )
    const precioTotal = Object.values(carrito).reduce((precioOld, producto) => {
        return precioOld + producto.precio * producto.cantidad;
    },0)
    // Pinto el productoTotal y precioTotal en el template

    templateFooter.querySelectorAll('td')[0].textContent = productosTotal;
    templateFooter.querySelectorAll('td')[2].textContent = precioTotal;

    const clone3 = templateFooter.cloneNode(true); // Lo clono cada vez que entre en mostrarCarrito()
    fragment.appendChild(clone3);
    footer.appendChild(fragment);

    const vaciarCarrito = document.getElementById('vaciar-carrito');
    vaciarCarrito.addEventListener('click', () => {
        carrito = {} // :)
        mostrarCarrito();
    })

    if(Object.values(carrito).length === 0) {
        footer.innerHTML = `<th>Carrito vacío :(</th>`
    }
}

const btnAccion = (html) => { // Una sola función que tenga dos if
    if (html.target.classList.contains('sumar')) {
        const producto = carrito[html.target.dataset.id] // accedo al dataset.id que tiene todo el objeto

        producto.cantidad++;
        
        mostrarCarrito(); // Para que se muestre la cantidad actualizada
    }
    if (html.target.classList.contains('restar')) {
        const producto = carrito[html.target.dataset.id] // Obtengo el id del boton y como el id contiene la información del producto entonces lo guardo en una constante
        producto.cantidad--;

        if (producto.cantidad === 0) {
            delete carrito[html.target.dataset.id] // 
        }

        mostrarCarrito(); // Para que se muestre la cantidad actualizada
    }
}