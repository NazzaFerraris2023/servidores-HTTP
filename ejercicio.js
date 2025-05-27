import express from "express";
import { v4 as uuid } from "uuid";
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Middlewere:
const methodLogger = (req, res, next) => {
  const fechaPeticion = new Date();
  const method = req.method;
  const url = req.originalUrl;

  console.log(
    "Fecha de la peticion: ",
    fechaPeticion,
    " Metodo utilizado: ",
    method,
    " URL de donde sale la info: ",
    url
  );

  next();
};
app.use(methodLogger);

//Rutas
let libros = [
  {
    id: uuid(),
    titulo: "Libro numero 1",
    autor: "autor numero 1",
  },
  {
    id: uuid(),
    titulo: "Libro numero 2",
    autor: "autor numero 2",
  },
  {
    id: uuid(),
    titulo: "Libro numero 3",
    autor: "autor numero 3",
  },
  {
    id: uuid(),
    titulo: "Libro numero 4",
    autor: "autor numero 4",
  },
];

//GET
app.get("/:libros", (req, res) => {
  res.status(200).json(libros);
  console.log(libros);
});

//Get id:
app.get("/:libros/:id", (req, res) => {
  try {
    const libro = libros.find((l) => l.id === req.params.id);
    if (!libro) {
      console.log("No se encontro el libro");
      return res.status(400).json({ mesanje: "No se encontro el libro" });
    }
    console.log(libro);
    res.status(200).json(libro);
  } catch (error) {
    console.log("El error es el siguiente", error);
  }
});
//Delete
app.delete("/libros/:id", (req, res) => {
  const id = req.params.id;
  const libro = libros.find((l) => l.id === id);
  if (!libro) {
    return res.status(404).json({ mensaje: "Libro no encontrado" });
  }

  libros = libros.filter((l) => l.id !== id);
  res.status(204).send();
  console.log(libros);
});

//Middleware para Validar el Cuerpo de la Petición en POST y PUT:
const dataValidation = (req, res, next) => {
  const method = req.method;

  if (method === "POST") {
    try {
      const { titulo, autor } = req.body;
      if (!autor || !titulo || titulo.trim() === "" || autor.trim() === "") {
        return res
          .status(400)
          .json({ mensaje: "El título y el autor son obligatorios" });
      }

      next();
    } catch (error) {
      console.log("El error es el siguiente: ", error);
    }
  }

  if (method === "PUT") {
    const { titulo, autor } = req.body;
    if ((!titulo ||titulo.trim() === "") && (!autor || autor.trim() === "")){
      return res
        .status(400)
        .json({
          mensaje:
            "Debe proporcionar al menos un título o autor para actualizar",
        });
    }
   
    next();
  }
};
//POST
app.post("/:libros", dataValidation, (req, res) => {
  try {
    const nuevoLibro = {
      id: uuid(),
      titulo: req.body.titulo,
      autor: req.body.autor,
    };

    const exist = libros.some((libro) => libro.titulo === req.body.titulo);
    if (exist) {
      console.log("El libro ya esta creado");
      return res.status(400).json({ mensaje: "El libro ya fue creado" });
    }
    libros.push(nuevoLibro);
    res.status(201).json(libros);
    console.log("Libro creado");
  } catch (error) {
    console.log("El error es el siguiente: ", error);
  }
});
//PUT
app.put("/libros/:id", dataValidation, (req, res) => {
  try {
    const libro = libros.find((l) => l.id === req.params.id);

    if (!libro) {
      return res.status(404).json({ mensaje: "Libro no encontrado" });
    }
    if (req.body.titulo === libro.titulo && req.body.autor === libro.autor) {
      return res.status(400).json({ mensaje: "No se realizo ningun cambio" });
    }

    if (req.body.titulo !== "") {
      libro.titulo = req.body.titulo;
    }
    if (req.body.autor !== "") {
      libro.autor = req.body.autor;
    }
    res.status(200).json(libro);
  } catch (error) {
    console.log("El error es el siguiente: ", error);
  }
});

app.listen(8080, () => {});
