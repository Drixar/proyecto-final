const express = require("express");
const manager = require('../ProductManager')
const productsRouter = express.Router();
const productManager = new manager('./files/','productos.json');
const io = require('../server')


productsRouter.get("/:id", async(req,res, next)=>{
    const {id} = req.params;
    console.log("id", id)
    const [status, message, product] = await productManager.getById(parseInt(id));
    switch(status) {
        case '200': 
            res.status(200).send({
                message:message,
                response: product
            });
            return;
        case '404':
            res.status(404).send({
                message:message
            });
            next();
    }
})

productsRouter.get("/", async(req, res, next) => {
    const limit = req.query.limit? +req.query.limit : 0;
    const [status, message, productos] = await productManager.getAll();
    switch(status) {
        case '200': 
            res.status(200).send({
                message:"Listado de Productos",
                response: productos.length > limit && limit > 0 ? productos.slice(0,limit) : productos
            });
            return;
        case '404':
            res.status(404).send({
                message:message
            });
    }
})

productsRouter.post("/",async(req,res,next)=>{
    const newProduct = req.body;
    const [status, message, productos] = await productManager.addProduct(newProduct);
    switch(status) {
        case '200': 
        req.io.emit("products", productos);
                res.status(200).send({
                message:message,
                response: productos
            });
            return
        case '400':
            res.status(400).send({
                message:message
            });

    }
})

productsRouter.put("/:id", async(req,res)=>{
    const {id} = req.params;
    const newInfo = req.body;
    const [status, message, productosActualizados]  = await productManager.updateById(parseInt(id),newInfo);
    switch(status) {
        case '200': 
        req.io.emit("products", productosActualizados);
            res.status(200).send({
                message:message,
                response: productosActualizados
            });
            return
        case '404':
            res.status(400).send({
                message:message
            });
    }
})

productsRouter.delete("/:id", async(req,res)=>{
    const {id} = req.params;
        const [status, message, productosActualizados]  = await productManager.deleteById(parseInt(id));
        switch(status) {
            case '200': 
                res.status(200).send({
                    message:message,
                    response: productosActualizados
                });
                return
            case '404':
                res.status(400).send({
                    message:message
                });
        }
})


module.exports = productsRouter;