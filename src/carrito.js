// Seleccionar elementos del DOM/////////////////////////////////////////////////////////////////////
let label = document.getElementById('label'); 
let tiendaCarrito = document.getElementById('tiendacarrito'); 
let basket = JSON.parse(localStorage.getItem("compras")) || []; 
let tiendaItemsData = [];
let tiendaItemsDataJewelry = [];
let tiendaItemsDatasweater = [];





// Función para obtener datos desde un archivo JSON ////////////////////////////////////////////////////

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
            gerateCarritoItems();
            SumarPrecios();
        })
        .catch((error) => 
            console.error("No se pueden recuperar datos:", error));
}
buscarJSON();




// Función para actualizar el contador del carrito/////////////////////////////////////////////////////

let calculo =()=>{
    let cartIcon = document.getElementById("Amount")
    cartIcon.innerHTML = basket.map((x) => x.item).reduce((x,y) => x + y, 0);
};
calculo();




// Función para generar los elementos del carrito///////////////////////////////////////////////////

let gerateCarritoItems = () => {
    if (basket.length !== 0) {
        return (tiendaCarrito.innerHTML = basket
            .map((x)=>{
                let {id,item} = x;
                let buscar = tiendaItemsData.find((y)=>y.id === id) || tiendaItemsDataJewelry.find((y)=>y.id === id) || tiendaItemsDatasweater.find((y)=>y.id === id);
                // >>>>> estructura HTML para el carrito
                return `
                    <div class="carritoitem">
                        <img width="100" src=${buscar.img} alt=""/>
                        <div class="details">
                            <div class="title-price-x">
                                <h4 class="title-price">
                                    <p> ${buscar.name}</p>
                                    <p class="cart-tittle-price">$${buscar.price}</p>
                                </h4>
                                <i onclick = "removeItem(${id})" class="bi bi-x-lg"></i>
                            </div>
                            <div class="button">
                                <i  onclick="detrimento(${id})" class="bi bi-dash-lg"></i>
                                <div id=${id} class="quantity">${item}</div>
                                <i onclick="incremento(${id})" class="bi bi-plus-lg"></i>
                            </div>
                            <h3>$${item * buscar.price}</h3>
                        </div>
                    </div>
                `;
            }).join(""));
    } else {
        
        tiendacarrito.innerHTML = ``;
        label.innerHTML = `
            <h2> No hay nada en el carrito </h2>
            <a href="index.html">
                <button class="HomeBtn"> VOLVER AL INICIO</button>
            </a>
        `;
    }
};






// Función que incrementa la cantidad de un producto en el carrito////////////////////////////////////////////

let incremento =(id)=>{
    let selectedItem = id;
    let buscar = basket.find((x)=> x.id === selectedItem.id);

    if(buscar === undefined){
        basket.push({
            id:selectedItem.id,
            item:1,
        });
    }
    else{
        buscar.item += 1;
    }

    gerateCarritoItems();
    update(selectedItem.id);

    localStorage.setItem("compras",JSON.stringify(basket));
};




// Función para decrementar la cantidad de un producto /////////////////////////////////////////////////
let detrimento =(id)=>{
    let selectedItem = id;
    let buscar = basket.find((x)=> x.id === selectedItem.id);

    if (buscar === undefined) return;
    else if(buscar.item === 0) return;
    else{
        buscar.item -= 1;
    }
    update(selectedItem.id);
    basket = basket.filter((x) => x.item !==0);

    gerateCarritoItems();
   
    localStorage.setItem("compras",JSON.stringify(basket));
};




// Función para actualizar la cantidad de un producto en el carrito////////////////////////////////////////////
let update =(id)=>{
    let buscar = basket.find((x)=>x.id === id);
    document.getElementById(id).innerHTML = buscar.item;
    calculo();
    SumarPrecios();
};




// Función para eliminar un producto ///////////////////////////////////////////////////////////
let removeItem=(id)=>{
    let selectedItem = id;
    basket = basket.filter((x)=>x.id!== selectedItem.id);
    gerateCarritoItems();
    SumarPrecios();
    calculo();
    localStorage.setItem("compras",JSON.stringify(basket));
};




// Función para limpiar el carrito/////////////////////////////////////////////////////////////////
let limpiarCarrito =()=>{
    basket = [];
    gerateCarritoItems();
    calculo();
    localStorage.setItem("compras",JSON.stringify(basket));
};




// Función para sumar los precios de los productos //////////////////////////////////////////////

let SumarPrecios =()=>{
    if(basket.length !==0){
        let cantidad = basket.map((x)=>{
            let{item,id}=x;
            let buscar = tiendaItemsData.find((y)=>y.id === id) || tiendaItemsDataJewelry.find((y)=>y.id === id) || tiendaItemsDatasweater.find((y)=>y.id === id);
            return item * buscar.price;
        })
        .reduce((x,y) => x + y, 0);

        label.innerHTML = `
            <h2>Saldo : $ ${cantidad}</h2>
            <a href="finalizar.html"><button class ="compra">comprar</button></a>
            <button  onclick="limpiarCarrito()" class ="removeAll">Limpiar carrito</button>
        `;
    }else return;
};
