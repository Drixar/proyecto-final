const socketClient = io();

// let user;
// Swal.fire({
//     title:"Hola usuario",
//     text:"bienvenido, ingresa tu usuario",
//     input:"text",
//     allowOutsideClick:false
// }).then(respuesta=>{
//     user = respuesta.value;
// });

// const productForm = document.getElementById("productForm");
// productForm.addEventListener("submit",(evt)=>{
//     evt.preventDefault();
//     const product ={
//         title: document.getElementById("title").value,
//         price: document.getElementById("price").value,
//         thumbnail: document.getElementById("thumbnail").value
//     }
//     socketClient.emit("newProduct",product);
//     document.getElementById("title").value = "";
//     document.getElementById("price").value = "";
//     document.getElementById("thumbnail").value = "";
// })

const createTable = async(data)=>{
    const response = await fetch("./templates/table.handlebars");
    const result = await response.text();
    const template = Handlebars.compile(result);
    const html = template({products:data});
    return html;
}

const productsContainer = document.getElementById("productsContainer");
socketClient.on("products",async(data)=>{
    console.log(await data)
    //generar el html basado en la plantilla de hbs con todos los productos
    const htmlProducts = await createTable(data);
    productsContainer.innerHTML = htmlProducts;
})

socketClient.on("connection",async(data)=>{
    console.log(await data)
    //generar el html basado en la plantilla de hbs con todos los productos
    const htmlProducts = await createTable(data);
    productsContainer.innerHTML = htmlProducts;
})



