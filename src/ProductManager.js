const fs = require("fs");

class ProductManager{
    constructor(dirFile,nameFile){
        this.nameFile = nameFile;
        this.path = dirFile;    
    }

    addProduct = async(product)=>{
        try {
            //leer el archivo existe
            if(fs.existsSync(this.path.concat('', this.nameFile))){
                const [status, message, productos] = await this.getAll();

                if (!product.title || !product.description || !product.code || !product.price || !product.status || !product.stock || !product.category) {
                    console.error("Campos Incompletos");
                    return ['400', "Campos Incompletos", null];
                }        
                if (productos.filter(e => e.code === product.code).length > 0) {
                    console.error("Código Repetido");
                    return ['400', "Código Repetido", null];
                }
                const lastIdAdded = productos.reduce((acc,item)=>item.id > acc ? acc = item.id : acc, 0);
                const newProduct={
                    id: lastIdAdded+1,
                    ...product
                }
                productos.push(newProduct);
                await fs.promises.writeFile(this.path.concat('', this.nameFile), JSON.stringify(productos, null, 2))
                return ['200', "Producto creado Correctamente", productos];
            } else{
                // si el archivo no existe

                const newProduct={
                    id:1,
                    ...product
                }
                //creamos el archivo
                await fs.promises.writeFile(this.path.concat('', this.nameFile), JSON.stringify([newProduct], null, 2));
                return ['200', "Archivo y Producto creado Correctamente", newProduct];
            }
        } catch (error) {
            console.log(error);
        }
    }

    getById = async(id)=>{
        try {

            if(fs.existsSync(this.path.concat('', this.nameFile))){
                const [status, message, productos] = await this.getAll();

                const producto = productos.find(item=>item.id===id);
                if (producto){
                    return ['200', "Producto encontrado", producto];
                } else {
                    return ['404', "Producto no encontrado", producto];
                } 
            } else {
                return ['404', "Archivo de Productos no existe", null];
            }
        } catch (error) {
            console.log(error)
        }
    }

    getAll = async()=>{
        try {
            //leer el archivo existe
            // console.log(this.path.concat('', this.nameFile))
            // console.log(fs.existsSync(this.path.concat('', this.nameFile)))
            if(fs.existsSync(this.path.concat('', this.nameFile))){
                // console.log(await fs.promises.readFile(this.path.concat('', this.nameFile), 'utf-8'))
                const contenido = await (fs.promises.readFile(this.path.concat('', this.nameFile), 'utf-8'));
                // console.log(JSON.parse(contenido))
                const productos = JSON.parse(contenido);
                return ['200', "Archivo de Productos leído Correctamente", productos];
            } else{
                // si el archivo no existe
                return ['404', "Archivo de Productos No Existe", null];
            }
        } catch (error) {
            console.log(error);
        }}

    deleteById = async(id)=>{
        try {
            if(fs.existsSync(this.path.concat('', this.nameFile))){
                const [status, message, productos] = await this.getAll();
                const productPos = productos.findIndex(elm=>elm.id === id);
                if (productos[productPos]){
                    const [status, message, productos] = await this.getAll();
                    const newProducts = productos.filter(item=>item.id!==id);
                    await fs.promises.writeFile(this.path.concat('', this.nameFile), JSON.stringify(newProducts, null, 2));
                    return ['200', "Producto eliminnado", null];
                } else {
                    return ['404', "Producto no encontrado", null];
                } 
            } else {
                return ['404', "Archivo de Productos no existe", null];
            }
        } catch (error) {
            console.log(error)
        }
    }

    deleteAll = async()=>{
        try {
            await fs.promises.writeFile(this.path.concat('', this.nameFile), JSON.stringify([]));
        } catch (error) {
            console.log(error)
        }
    }

    updateById = async(id, body)=>{
        try {
            if(fs.existsSync(this.path.concat('', this.nameFile))){
                const [status, message, productos] = await this.getAll();
                const productPos = productos.findIndex(elm=>elm.id === id);
                if (productos[productPos]){
                    productos[productPos] = {
                        id:id,
                        title: body.title ? body.title : productos[productPos].title,
                        description: body.description ? body.description : productos[productPos].description,
                        code: body.code ? body.code : productos[productPos].code,
                        price: body.price ? body.price : productos[productPos].price,
                        status: body.status ? body.status : productos[productPos].status,
                        stock: body.stock ? body.stock : productos[productPos].stock,
                        category: body.category ? body.category : productos[productPos].category,                    
                        thumbnail: body.thumbnail ? body.thumbnail : productos[productPos].thumbnail
                    };
                    await fs.promises.writeFile(this.path.concat('', this.nameFile), JSON.stringify(productos, null, 2))
                    return ['200', "Producto encontrado", productos[productPos]];
                } else {
                    return ['404', "Producto no encontrado", null];
                } 
            } else {
                return ['404', "Archivo de Productos no existe", null];
            }
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = ProductManager;