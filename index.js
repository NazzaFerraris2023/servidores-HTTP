import express from "express";

// creando servidor con express
const app = express();

//Nunca olvidarse de esta funcion:
app.use(express.urlencoded({extended : true})) // se encarga de crear el body y resolver todo el lio de los chunks cuando venga info via formulario

// Como hacer para decodificar la informacion que me viene via JSON:
app.use(express.json())

//Esto app.use(express.urlencoded({extended : true})) y esto app.use(express.json()) me devuelve el mismo objeto

// Contruyendo nuestro propio middlewere
//Forma 1 => todo encapsulado ahi adentro // tiene que estar arriba de todo
// app.use((req,res,next) => {
//     // el next es obligatorio de usar, el req y res no
//     console.log("El metodo es: ",req.method)

//     //Si al req le quiero agregar una propiedad: 
//     req.saludar = "Hola equipo"
//     //Si no pongo el next() el servidor se queda procesando
//     next()
// }) // este middlewere va a afectar a los metodos de abajo

//Forma 2: 
const methodLogger = (req,res,next) => {
    // el next es obligatorio de usar, el req y res no
    console.log("El metodo es: ",req.method)

    //Si al req le quiero agregar una propiedad: 
    req.saludar = "Hola a todos"
    //Si no pongo el next() el servidor se queda procesando
    next()
}

//app.use(methodLogger)





//hacer un get :
//Cuando se hace hace un request en el get que no esta esperando ningun parametro, params tiene a req como un objeto vacio
// parametro nos referimos a: "/:id/productos" => hay dos parametros
app.get("/", (req, res) => {
    console.log(req)
  res.status(200).send("get all"); //a traves del get analiza el metodo, a traves del string sabe cual es la url, el status manda el estado, el send envia un mensaje
});

//get by id => Si en el cliente trueno pongo localhost:8080/(cuelquier cosa) me va a traer el "get by id"
// lo que devuelve request es un objeto, por lo tanto lo puedo ir modificando (conviene agregarle cosas)
// Si hago un req.params puedo acceder directamente al objeto
app.use(methodLogger)
app.get("/:id", (req, res) => {
  res.status(200).send("get by id");
//   console.log(req.params)
});

//Si via get quiero enviar query params en cliente trueno tengo que ir a query y llenar el formulario. automaticamente me crea la URL:



//Usar el metodo POST:

app.post("/", (req,res) =>{
        // console.log(req)
    res.status(200).send("post")
    //Acabo de mandar la data pero no se encuentra todavia


})

//Middleweres => Son funciones que tienen acceso al req,res y next() => ejecuta lo que sigue...
//Ejemplos de Middlewere:

// app.use(express.urlencoded({extended : true}))
// app.use(express.json())
// para que afecte a las rutas que elija, lo tengo que poner por encima de la ruta (si quiero que afecte solo al /:id, pongo el middlewere dsp del get /, pero antes del get /:id)





//Pongo a escuchar el servidor:

app.listen(8080, () => {});
