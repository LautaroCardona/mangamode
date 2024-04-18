let label = document.getElementById('label');
let tiendaCarrito = document.getElementById('tiendacarrito');
let basket = JSON.parse(localStorage.getItem("compras")) || [];

let tiendaItemsData = [];
let tiendaItemsDataJewelry = [];
let tiendaItemsDatasweater = [];

function buscarJSON(){
    fetch("https://raw.githubusercontent.com/LautaroCardona/mangamode/340ec3eed04ea73f46801272257761ddafe9515c/db.json")
        .then((res) => {
            if (!res.ok) {
                throw new Error('error HTTP!');
            }
            return res.json();
        })
        .then((data) => {
            data.tiendaItemsData.forEach( element => {
                tiendaItemsData.push(element);
            });
            data.tiendaItemsDataJewelry.forEach( element => {
                tiendaItemsDataJewelry.push(element);
            });
            data.tiendaItemsDatasweater.forEach( element => {
                tiendaItemsDatasweater.push(element);
            });
            mostrarFormulario();
            SumarPrecios();
        })
        .catch((error) => console.error("No se pueden recuperar datos:", error));
}

buscarJSON();

function mostrarFormulario() {
    // Construir el formulario
    let formularioHTML = `
        <form id="formularioCompra">
            <label for="nombre">Nombre:</label>
            <input type="text" id="nombre" name="nombre" required><br><br>
            
            <label for="dni">DNI:</label>
            <input type="text" id="dni" name="dni" required><br><br>
            
            <label for="tarjeta">Tarjeta de crédito:</label>
            <select id="tarjeta" name="tarjeta" required>
                <option value="visa">Visa</option>
                <option value="mastercard">MasterCard</option>
                <option value="debito">Tarjeta de Débito</option>
            </select><br><br>
            
            <label for="numeroTarjeta">Número de tarjeta:</label>
            <input type="text" id="numeroTarjeta" name="numeroTarjeta" required><br><br>
            
            <input type="submit" value="Finalizar compra">
        </form>
    `;

    // Mostrar el formulario
    label.innerHTML = formularioHTML;

    // Agregar evento para manejar el envío del formulario
    document.getElementById("formularioCompra").addEventListener("submit", function(event) {
        event.preventDefault();
        finalizarCompra(
            document.getElementById("nombre").value,
            document.getElementById("dni").value,
            document.getElementById("tarjeta").value,
            document.getElementById("numeroTarjeta").value
        );
    });
}

function finalizarCompra(nombre, dni, tarjeta, numeroTarjeta) {
    // Limpiar el carrito
    basket = [];
    localStorage.removeItem("compras");

    // Actualizar el contador del carrito a cero
    let cartIcon = document.getElementById("Amount");
    cartIcon.innerHTML = "0";

    // Guardar los datos del usuario en el almacenamiento local
    let userData = {
        nombre: nombre,
        dni: dni,
        tarjeta: tarjeta,
        numeroTarjeta: numeroTarjeta
    };
    localStorage.setItem("userData", JSON.stringify(userData));

    // Mostrar mensaje de éxito
    let mensajeExito = document.createElement("div");
    mensajeExito.textContent = `¡Tu compra fue realizada con éxito, ${nombre}!`;
    mensajeExito.style.color = "white";
    mensajeExito.style.marginTop = "50px";
    mensajeExito.style.fontSize = "30px";
    label.innerHTML = ""; // Limpiamos el contenido del label
    label.appendChild(mensajeExito);

    // Ocultar el formulario
    let formulario = document.getElementById("formularioCompra");
    formulario.style.display = "none";
}

function SumarPrecios() {
    if (basket.length !== 0) {
        let cantidad = basket.map((x) => {
            let {item, id} = x;
            let buscar = tiendaItemsData.find((y) => y.id === id) || tiendaItemsDataJewelry.find((y) => y.id === id) || tiendaItemsDatasweater.find((y) => y.id === id);
            return item * buscar.price;
        }).reduce((x, y) => x + y, 0);

        let saldoTotal = document.createElement("h2");
        saldoTotal.textContent = `Saldo total: $${cantidad.toFixed(2)}`;
        label.appendChild(saldoTotal);
    } else {
        label.innerHTML = `
            <h2> No hay nada en el carrito </h2>
            <a href="index.html">
                <button class="HomeBtn"> VOLVER AL INICIO</button>
            </a>
        `;
    }
}

let calculo =()=>{
    let cartIcon = document.getElementById("Amount")
    cartIcon.innerHTML = basket.map((x) => x.item).reduce((x,y) => x + y, 0);
};
calculo();





