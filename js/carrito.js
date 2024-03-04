let productosEnCarrito = localStorage.getItem("productos-en-carrito"); //trae los productos en carrito agregados por los botones en main
productosEnCarrito = JSON.parse(productosEnCarrito);

const contenedorCarritoVacio = document.querySelector("#carrito-vacio");//los divs que hay que traer del html
const contenedorCarritoProductos = document.querySelector("#carrito-productos");//
const contenedorCarritoAcciones = document.querySelector("#carrito-acciones");//
const contenedorCarritoComprado = document.querySelector("#carrito-comprado");//
let botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");//traer todos los botones para eliminar
const botonVaciar = document.querySelector("#carrito-acciones-vaciar");
const contenedorTotal = document.querySelector("#total");
const botonComprar = document.querySelector("#carrito-acciones-comprar");


function cargarProductosCarrito() { //funcion para cargar los productos cada vez que se modifique el localstorage
    if (productosEnCarrito && productosEnCarrito.length > 0) {

        contenedorCarritoVacio.classList.add("disabled");//disabled para ocultar el mensaje de que el carrito esta vacio en caso de que se cumpla la condicion
        contenedorCarritoProductos.classList.remove("disabled");//remove para remover el disabled y que muestre los productos del carrito 
        contenedorCarritoAcciones.classList.remove("disabled");//remove para remover el disabled y que muestre las acciones
        contenedorCarritoComprado.classList.add("disabled");//para ocultar el mensaje de gracias por la compra
    
        contenedorCarritoProductos.innerHTML = "";//utilizado para limpiar el html como en productos 
    
        productosEnCarrito.forEach(producto => { //para cada producto crea la class div.carritoProducto
    
            const div = document.createElement("div");//creacion del div
            div.classList.add("carrito-producto");//la clase del div
            //div con la creacion y valores del objeto
            div.innerHTML = `
                <img class="carrito-producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
                <div class="carrito-producto-titulo">
                    <small>Título</small>
                    <h3>${producto.titulo}</h3>
                </div>
                <div class="carrito-producto-cantidad">
                    <small>Cantidad</small>
                    <p>${producto.cantidad}</p>
                </div>
                <div class="carrito-producto-precio">
                    <small>Precio</small>
                    <p>$${producto.precio}</p>
                </div>
                <div class="carrito-producto-subtotal">
                    <small>Subtotal</small>
                    <p>$${producto.precio * producto.cantidad}</p>
                </div>
                <button class="carrito-producto-eliminar" id="${producto.id}"><i class="bi bi-trash-fill"></i></button>
            `;
    
            contenedorCarritoProductos.append(div); //append para duplicar
        })
    
    actualizarBotonesEliminar();
    actualizarTotal();
	
    } else {
        contenedorCarritoVacio.classList.remove("disabled");
        contenedorCarritoProductos.classList.add("disabled");
        contenedorCarritoAcciones.classList.add("disabled");
        contenedorCarritoComprado.classList.add("disabled");
    }

}

cargarProductosCarrito();

function actualizarBotonesEliminar() {
    botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");

    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", eliminarDelCarrito);//funcion que declaramos adelante para buscar y borrar
    });
}

function eliminarDelCarrito(e) {
    Toastify({
        text: "Producto eliminado",
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "linear-gradient(to right, #4b33a8, #785ce9)",
          borderRadius: "2rem",
          textTransform: "uppercase",
          fontSize: ".75rem"
        },
        offset: {
            x: '1.5rem', // horizontal axis - can be a number or a string indicating unity. eg: '2em'
            y: '1.5rem' // vertical axis - can be a number or a string indicating unity. eg: '2em'
          },
        onClick: function(){} // Callback after click
      }).showToast();

    const idBoton = e.currentTarget.id; //devuelve el id del event en donde me estoy posicionando con el click
    const index = productosEnCarrito.findIndex(producto => producto.id === idBoton); //index para ubicar y comparar el id del boton con el id del producto 
    
    productosEnCarrito.splice(index, 1);//metodo splice para borrar el elemento de ubicado por index previamente
    cargarProductosCarrito();//ejecuto la funcion de carga de los productos en el carrito

    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));//settear el cambio en ls

}

botonVaciar.addEventListener("click", vaciarCarrito);//ejecuto la funcion vaciar carrito al hacer click en el boton
function vaciarCarrito() {
    
    productosEnCarrito.length=0;//cambia el valor de productos en carrito a 0
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito)); //setitem se utiliza para guardar un valor en el ls--stringify convierte el objeto js a json
    cargarProductosCarrito();
/*
    Swal.fire({
        title: '¿Estás seguro?',
        icon: 'question',
        html: `Se van a borrar ${productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0)} productos.`,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No'
    }).then((result) => {
        if (result.isConfirmed) {
            productosEnCarrito.length = 0;
            localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
            cargarProductosCarrito();
        }
      })*/
}


function actualizarTotal() {
    const totalCalculado = productosEnCarrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0); //reduce para operar con los nuevos productos que se cargan al array
    total.innerText = `$${totalCalculado}`;//escribimos el total calculado con el metodo reduce en la etiqueta total
}

botonComprar.addEventListener("click", comprarCarrito);
function comprarCarrito() {

    productosEnCarrito.length = 0;
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
    
    contenedorCarritoVacio.classList.add("disabled");
    contenedorCarritoProductos.classList.add("disabled");
    contenedorCarritoAcciones.classList.add("disabled");
    contenedorCarritoComprado.classList.remove("disabled");

}