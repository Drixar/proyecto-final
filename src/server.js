const express = require("express");
const handlebars = require('express-handlebars');
const {Server} = require("socket.io");
const path = require("path");
const manager = require('./ProductManager')
const productRouter = require("./routes/productRouter");
const cartRouter = require("./routes/cartRouter")
const viewsRouter = require('./routes/viewsRouter')

const app = express();

const productManager = new manager('./files/','productos.json');

const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, ()=>console.log(`listening on port ${PORT}`));
const io = new Server(server);

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use((req, res, next) => {
    req.io = io;
    return next();
  });

app.use(express.static(path.join(__dirname, '/public')))
app.engine('handlebars', handlebars.engine())
app.set('views', path.join(__dirname,'/views'))
app.set('view engine', 'handlebars')

app.use("/api/products", productRouter);
app.use("/api/carts/", cartRouter);
app.use("/", viewsRouter);

//trabajar con archivos estaticos de la carpeta public
app.use(express.static(__dirname+"/public"));

//websocket
io.on("connection",async (socket)=>{
    console.log("nuevo usuario conectado", socket.id);

    //enviar todos los productos al usuario cuando se conecte.
    const [status, message, productos]  = await productManager.getAll();
    socket.emit("products", productos)

    //recibimos el nuevo producto del cliente y lo guardamos
    socket.on("newProduct",async(data)=>{
        await productManager.addProduct(data);
        //enviamos la lista de productos actualizada a todos los sockets conectados
        io.sockets.emit("products", await productManager.getAll());
    })

    //enviar a todos menos al socket conectado
    socket.broadcast.emit("newUser");

})

module.exports = io;