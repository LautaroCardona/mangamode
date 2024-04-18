let tienda = document.getElementById("tienda");


let basket = JSON.parse(localStorage.getItem("compras")) || [];
let tiendaItemsDataJewelry = [];

function buscarJSON(){
    fetch("https://raw.githubusercontent.com/LautaroCardona/mangamode/340ec3eed04ea73f46801272257761ddafe9515c/db.json")
     .then((res) => {
      if (!res.ok) {
       throw new Error('Error HTTP: ' + res.status);
      }
      return res.json();
     })
     .then((data) => {
        try {
            data.tiendaItemsDataJewelry.forEach( element => {
                tiendaItemsDataJewelry.push(element);
            });
            generateTienda();
        } catch (error) {
            console.error("Error al procesar los datos:", error);
        } finally {
            console.log("La búsqueda de JSON ha finalizado");
        }
     })
     .catch((error) => {
         console.error("No se pueden recuperar datos:", error);
     });
}

buscarJSON();
   

let generateTienda = () => {
    return (tienda.innerHTML = tiendaItemsDataJewelry.map((x)=>{
        let{id,name,price,desc,img}=x;
        let buscar = basket.find((x)=>x.id === id) || [];
        return `
        <div id="producto-id-${id}" 
         class="item" onmouseover="zoomIn('${id}')" onmouseout="zoomOut('${id}')">
         <div class="image-container">
          <img width="215" src="${img}" alt="" id="img-${id}">
         <div class="zoom-overlay" id="zoom-${id}"></div>
       </div>
            <div class="detalles">
             <h3>${name}</h3>
             <p>${desc}</p>
                <div class="precio_cantidad">
                    <h2>$ ${price}</h2>
                    <div class="button">
                     <i  onclick="detrimento(${id})" class="bi bi-dash-lg"></i>
                     <div id=${id} class="quantity">
                     ${buscar.item === undefined ? 0: buscar.item}
                     </div>
                     <i onclick="incremento(${id})" class="bi bi-plus-lg"></i>
                    </div>
                </div>
            </div>
        </div>
        `;
    }).join("")); 
};


generateTienda();



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

   
    update(selectedItem.id);

    localStorage.setItem("compras",JSON.stringify(basket));
};

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

    
   
    localStorage.setItem("compras",JSON.stringify(basket));
};

let update =(id)=>{
    let buscar = basket.find((x)=>x.id === id);
    
    document.getElementById(id).innerHTML = buscar.item;
    calculo()
};



let calculo =()=>{
    let cartIcon = document.getElementById("Amount")
    cartIcon.innerHTML = basket.map((x) => x.item).reduce((x,y) => x + y, 0);
};

calculo();



let zoomIn = (id) => {
    let image = document.getElementById(`img-${id}`);
    let zoomOverlay = document.getElementById(`zoom-${id}`);
    zoomOverlay.style.backgroundImage = `url('${image.src}')`;
    zoomOverlay.style.display = 'block';
  };
  
  let zoomOut = (id) => {
    let zoomOverlay = document.getElementById(`zoom-${id}`);
    zoomOverlay.style.display = 'none';
  };



