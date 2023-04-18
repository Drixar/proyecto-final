const express = require("express");
const manager = require('../ProductManager')
const viewsRouter = express.Router();
const productManager = new manager('./files/','productos.json');

viewsRouter.get("/", async(req, res, next) => {
    // const limit = req.query.limit? +req.query.limit : 0;
    const [status, message, productos] = await productManager.getAll();
    switch(status) {
        case '200': 
            res.render('index', {productos});
            return;
        case '404':
            res.status(404).send({
                message:message
            });
    }
})

viewsRouter.get("/realtimeproducts", async(req, res, next) => {
    // const limit = req.query.limit? +req.query.limit : 0;
    const [status, message, productos] = await productManager.getAll();
    switch(status) {
        case '200': 
            res.render('realTimeProducts', {productos});
            return;
        case '404':
            res.status(404).send({
                message:message
            });
    }
})


module.exports = viewsRouter;