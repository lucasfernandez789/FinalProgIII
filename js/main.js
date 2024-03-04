let productos = [];//creo como array vacio

//se utiliza para realizar peticiones http asincronicas
fetch("./js/productos.json")//fetch con el direccionamiento
    .then(response => response.json())
    .then(data => {
        productos = data;
        cargarProductos(productos);
    })


const contenedorProductos = document.querySelector("#contenedor-productos"); //trae las cosas del html
const botonesCategorias = document.querySelectorAll(".boton-categoria"); //trae el array con todos los botones  //2--
const tituloPrincipal = document.querySelector("#titulo-principal"); // utilizo para cambiarle el nombre en botonesCategoria //2--
let botonesAgregar = document.querySelectorAll(".producto-agregar"); //let para luego ir cambiando x id
const numerito = document.querySelector("#numerito"); //traer el numero del producto del carrito


botonesCategorias.forEach(boton => boton.addEventListener("click", () => {
    aside.classList.remove("aside-visible");
}))

//funcion que carga de la card con cada producto
function cargarProductos(productosElegidos) {

    contenedorProductos.innerHTML = ""; //utilizo para "resetear el html" y que no se duplique con el append

    productosElegidos.forEach(producto => {

        const div = document.createElement("div");//createElement para crear el div
        div.classList.add("producto");//para agregar el nombre de la clase del div, innerhtml para agregar/modificar el contenido de la etiqueta div
        div.innerHTML = `
            <img class="producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
            <div class="producto-detalles">
                <h3 class="producto-titulo">${producto.titulo}</h3>
                <p class="producto-precio">$${producto.precio}</p>
                <button class="producto-agregar" id="${producto.id}">Agregar</button>
            </div>
        `;

        contenedorProductos.append(div); //append se utiliza para incluirlo en el documento html exactamente en el contenedor-productos
    })

    actualizarBotonesAgregar(); //para volver a mostrar el boton agregar ya que se resetea el html
}

//animacion de los botones en el aside y titulo
botonesCategorias.forEach(boton => {            //--2
    boton.addEventListener("click", (e) => {    //event listener hace que al momento de hacer click pase algo,

        botonesCategorias.forEach(boton => boton.classList.remove("active")); //utilizo clase active para que cambie en caso de hacer click y la utilizo para sacar la clase active del clickeado anteriormente
        e.currentTarget.classList.add("active"); //current target se utiliza para ser objetivo en el preciso elemento(botonesCategorias)
                                //todos se refiere al id html del boton "todos los productos"
        if (e.currentTarget.id != "todos") { //utilizado para filtrar los productos por categoria, al hacer click en el aside
            const productoCategoria = productos.find(producto => producto.categoria.id === e.currentTarget.id); //busco la categoria por id en donde estoy posicionado por event
            tituloPrincipal.innerText = productoCategoria.categoria.nombre; //utilizo para el cambio de nombre del titulo por nombre de categoria
            const productosBoton = productos.filter(producto => producto.categoria.id === e.currentTarget.id); //recorre cada producto y busca que el id de cada categoria sea igual que la del boton
            cargarProductos(productosBoton);
        } else {
            tituloPrincipal.innerText = "Todos los productos";
            cargarProductos(productos);
        }

    })
});

//funcion que agrega los botones agregar al carrito en cada card
function actualizarBotonesAgregar() {
    botonesAgregar = document.querySelectorAll(".producto-agregar");//trae todos los botones agregar al carrito del html cargar productos

    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", agregarAlCarrito); //ejecuta la funcion agregar al carrito en el momento del click gracias a eventListener *linea86
    });
}


let productosEnCarrito;
let productosEnCarritoLS = localStorage.getItem("productos-en-carrito");//traigo los productos en carrito del localstorage
if (productosEnCarritoLS) { //condicion que hace que producto en carrito sea igual a producto en carrito que esta en el localstorage
    productosEnCarrito = JSON.parse(productosEnCarritoLS);
    actualizarNumerito();//ejecuto la funcion para actualizar el numerito en base al numero de productos en carrito en el localstorage
} else { 
    productosEnCarrito = []; // en caso que no traiga un producto del localstorage el array estara vacio
}

//funcion para agregar productos al carrito
function agregarAlCarrito(e) {

    Toastify({
        text: "Producto agregado",
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

    const idBoton = e.currentTarget.id; // para traer el id del boton en cada producto
    const productoAgregado = productos.find(producto => producto.id === idBoton); // busca el producto donde sea igual que el id del boton

    if(productosEnCarrito.some(producto => producto.id === idBoton)) { // metodo que busca que coincida un producto con el id true o false
        const index = productosEnCarrito.findIndex(producto => producto.id === idBoton); //aumenta la cantidad de productos en carrito discriminando por id
        productosEnCarrito[index].cantidad++;
    } else {
        productoAgregado.cantidad = 1; //agrega cantidad al array de los productos discriminado por id
        productosEnCarrito.push(productoAgregado);
    }

    actualizarNumerito();

    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito)); //cada vez que ejecute agregarAlCarrito guarde en el localstorage con el metodo setItem
}

function actualizarNumerito() {
    let nuevoNumerito = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0); //para actualizar el numero de products. utiliza el metodo reduce al array productos en carrito pasa como parametro el acumulador y la cantidad de producto y se inicializa en 0
    numerito.innerText = nuevoNumerito;//utilizo para escribir el nuevo numero del carrito
}