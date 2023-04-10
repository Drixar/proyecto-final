const express = require("express");
const manager = require('../CartManager')
const cartRouter = express.Router();
const cartManager = new manager('./files/','carrito.json');



cartRouter.get("/:id", async(req,res, next)=>{
    const {id} = req.params;
    console.log("id", id)
    const [status, message, carrito] = await cartManager.getById(parseInt(id));
    switch(status) {
        case '200': 
            res.status(200).send({
                message:message,
                response: carrito.products
            });
            return;
        case '404':
            res.status(404).send({
                message:message
            });
            next();
    }
})

cartRouter.get("/", async(req, res, next) => {
    const limit = req.query.limit? +req.query.limit : 0;
    const [status, message, carritos] = await cartManager.getAll();
    switch(status) {
        case '200': 
            res.status(200).send({
                message:"Listado de Carritos",
                response: carritos.length > limit && limit > 0 ? carritos.slice(0,limit) : carritos
            });
            return;
        case '404':
            res.status(404).send({
                message:message
            });
    }
})

cartRouter.post("/",async(req,res,next)=>{
    const products = req.body;
    const [status, message, carritos] = await cartManager.addCart(products);
    switch(status) {
        case '200': 
            res.status(200).send({
                message:message,
                response: carritos
            });
            return
        case '400':
            res.status(400).send({
                message:message
            });

    }
})

cartRouter.put("/:id", async(req,res)=>{
    const {id} = req.params;
    const products = req.body;
    const [status, message, CarritoActualizado] = await cartManager.updateById(parseInt(id),products);
    switch(status) {
        case '200': 
            res.status(200).send({
                message:message,
                response: CarritoActualizado
            });
            return
        case '404':
            res.status(400).send({
                message:message
            });

    }
})

cartRouter.delete("/:id", async(req,res)=>{
    const {id} = req.params;
        const [status, message, carritos] = await cartManager.deleteById(parseInt(id));
        switch(status) {
            case '200': 
                res.status(200).send({
                    message:message,
                    response: carritos
                });
                return
            case '404':
                res.status(400).send({
                    message:message
                });
    
        }
})

cartRouter.post("/:cid/products/:pid", async(req,res)=>{
    const cid = +req.params.cid;
    const pid = +req.params.pid;
    const productQuantity = req.body.quantity;  // la cantidad de productos se pasa por body params ya que en la consigna no se especifica 
                                                // la pasé en formato.json { "quantity": 2}
    const [status, message, CarritoActualizado] = await cartManager.updateById(cid,{id: pid, quantity: productQuantity});
    switch(status) {
        case '200': 
            res.status(200).send({
                message:message,
                response: CarritoActualizado
            });
            return
        case '404':
            res.status(400).send({
                message:message
            });

    }
})
module.exports = cartRouter;