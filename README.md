# Primera entrega del Proyecto Final

Esta es la primera entrega del Proyecto Final

## Comenzando 🚀

La persistencia está implementada con File System e NODE

## Pre-requisitos 📋

El servidor está implementado con Express 
Las rutas est´pan implementadas con Express-Router

## Instalación 🔧

Para Clonar el Proyecto desde la terminal ejecutar:
1) git clone https://github.com/Drixar/proyecto-final.git
2) npm Install (para instalar las dependencias)

## Ejecutando las pruebas ⚙️

Las pruebas se realizaron con la extensión Thunder Client para Visual Studio Code

## Archivo de ejemplo para ejecutar Pruebas 🔩

Se incluye en el directorio raíz del pryecto un archivo con datos de ejemplo, para ejecturar las pruebas.

## El Formato de los archivos ⌨️

### Objeto product en el archivo productos.json

```sh
*{
		"id": Number,
		"title": String,
		"description": String,
		"code": String,
		"price": Number,
		"status": Boolean,
		"stock": Number,
		"category": String,
		"thumbnail": String
}*
```

# Objeto cart en el archivo carrito.json

```sh
*{
    {
    "id": Number,
    "products": [
      {
        "id": Number,
        "quantity": Number
      }
    ]
  }
}*
```

## Endpoints Implementados 📦

### Products  
**router en /api/products/**

**GET /** Lista todos los productos de la base productos.json
> Se puede limitar la cantidad de registros que se quieren Listar pasando por query params mediante al asignaciónde valor a la variable limit (por ejemplo **/api/products/?limit=3** listará los primero 3 productos )

**GET /:id**  Lista sólo el producto con el id proporcionado

**POST /**    Agrega un nuevo producto a la base de datos
> El campo id, se auto-genera asegurando que no se repita.
> Se verifica que todos los campos obligatorios sean proporcionados.

**PUT /:id**  Actualiza el producto cuyo *id* se suministra, actualizando los campos suministrados desde el body.
>Solamente se actualizan los campos suministrados, los otros permanecen tal como estaban almacenados.

**DELETE /:id** Borra el producto cuyo *id* se suministra.

### Carts  
**router en /api/carts/**

**GET /:id** Lista todos los productos del carrito cuyo id se suministra

**POST /:id/product/:id** Agregar el producto, cuyo id se suminitra, al arreglo “products” del carrito seleccionado,
> la cantidad del producto agregado se suminstra por body en formato.json *{ "quantity": 2}*, ya que no se espécificaba.
