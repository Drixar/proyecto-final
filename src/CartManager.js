const fs = require("fs");

class CartManager{
    constructor(dirFile,nameFile){
        this.nameFile = nameFile;
        this.path = dirFile;    
    }

    addCart = async(products)=>{ // products es un Array de Objetos {id: id del producto a agrgar, quantity: cantidad a agregar}
        try {
            const newproducts = products.filter(item=>item.id > 0 && item.quantity > 0);
            if (newproducts.length > 0 )
                {
                    //leer el archivo existe
                    if(fs.existsSync(this.path.concat('', this.nameFile))){
                        const [status, message, carritos] = await this.getAll();
                        const lastIdAdded = carritos.reduce((acc,item)=>item.id > acc ? acc = item.id : acc, 0);
                        const newCart={
                            id: lastIdAdded+1,
                            products: newproducts
                        }
                        carritos.push(newCart);
                        await fs.promises.writeFile(this.path.concat('', this.nameFile), JSON.stringify(carritos, null, 2))
                        return ['200', "Carrito de Compras creado Correctamente", carritos];
                    } else{
                        // si el archivo no existe
                        const newCart={
                            id:1,
                            products: newproducts
                        }
                        //creamos el archivo
                        await fs.promises.writeFile(this.path.concat('', this.nameFile), JSON.stringify([newCart], null, 2));
                        return ['200', "Archivo y Producto creado Correctamente", newCart];
                    }
                }
        } catch (error) {
            console.log(error);
        }
    }

    getById = async(id)=>{
        try {

            if(fs.existsSync(this.path.concat('', this.nameFile))){
                const [status, message, carritos] = await this.getAll();

                const carrito = carritos.find(item=>item.id===id);
                if (carrito){
                    return ['200', "Carrito de Compras encontrado", carrito];
                } else {
                    return ['404', "Carrito de Compras no encontrado", null];
                } 
            } else {
                return ['404', "Archivo de Carritos de Compras no existe", null];
            }
        } catch (error) {
            console.log(error)
        }
    }

    getAll = async()=>{
        try {
            //leer el archivo existe
            if(fs.existsSync(this.path.concat('', this.nameFile))){
                const contenido = await fs.promises.readFile(this.path.concat('', this.nameFile),"utf8");
                const carritos = JSON.parse(contenido);
                return ['200', "Archivo de Carritos de Compras leído Correctamente", carritos];
            } else{
                // si el archivo no existe
                return ['404', "Archivo de Carritos de Compras No Existe", null];
            }
        } catch (error) {
            console.log(error);
        }}

    updateById = async(id, newProduct)=>{
        try {
            if (newProduct.id > 0 && newProduct.quantity > 0 ) // verificamos que el ID y la cantidad a agregar sean valores válidos
            {
                if(fs.existsSync(this.path.concat('', this.nameFile))){
                    const [status, message, carritos] = await this.getAll();
                    const cartPosition = carritos.findIndex(elm=>elm.id === id);
                    if (carritos[cartPosition]){
                        const productos = carritos[cartPosition].products;
                        if (productos.find(item=>item.id===newProduct.id)) {
                            const productPosition = productos.findIndex(elm=>elm.id === newProduct.id);
                            carritos[cartPosition].products[productPosition].quantity += newProduct.quantity
                        } else {
                            carritos[cartPosition].products.push(newProduct);
                        }
                        await fs.promises.writeFile(this.path.concat('', this.nameFile), JSON.stringify(carritos, null, 2))
                        return ['200', `El carrito con el id ${id} fue actualizado`, carritos[cartPosition].products];
                    } else {
                        return ['404', "Carrito de Compras no encontrado", null];
                    } 
                } else {
                    return ['404', "Archivo de Carritos de Compras no existe", null];
                }
            }
        } catch (error) {
            console.log(error)
        }
    }
}

// deleteById = async(id)=>{
//     try {
//         if(fs.existsSync(this.path.concat('', this.nameFile))){
//             const [status, message, carritos] = await this.getAll();
//             const position = carritos.findIndex(elm=>elm.id === id);
//             if (carritos[position]){
//                 const carritos = await this.getAll();
//                 const newcarts = carritos.filter(item=>item.id!==id);
//                 await fs.promises.writeFile(this.path.concat('', this.nameFile), JSON.stringify(newcarts, null, 2));
//                 return ['200', `El Carrito de Compras con el id ${id} fue eliminado`, newcarts];
//             } else {
//                 return ['404', "Carrito de Compras no encontrado", null];
//             } 
//         } else {
//             return ['404', "Archivo de Carritos de Compras no existe", null];
//         }
//     } catch (error) {
//         console.log(error)
//     }
// }

// deleteAll = async()=>{
//     try {
//         if(fs.existsSync(this.path.concat('', this.nameFile))){
//             await fs.promises.writeFile(this.path.concat('', this.nameFile), JSON.stringify([]));
//         } else {
//             return ['404', "Archivo de Carritos de Compras no existe", null];
//         }
//     } catch (error) {
//         console.log(error)
//     }
// }

module.exports = CartManager;