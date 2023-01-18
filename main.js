const express = require("express");
const bodyParser = require("body-parser");
const pg = require('pg');

const config = {
  user: 'registro_db_user',
  database: 'registro_db',
  password: 'xjW70QRKl639VfrzIDWGTYBzOu8CBOrE',
  host: 'dpg-cf2n4k1gp3jl0q2e1b7g-a.oregon-postgres.render.com',
  port: 5432,
  ssl: true,
  idleTimeoutMillis: 3000
}

const client = new pg.Pool(config)

// Modelo
class UsuarioModel {
  constructor() {
    this.usuarios = [];
  }

  async getUsuarios(){
    const res = await client.query('select * from usuarios;')
    console.log(res);
    return res.rows
  }

  async addUsuario(usuarioText, edadInteger) {
    const query = 'INSERT INTO usuarios(id, nombres, edad) VALUES($1, $2, $3) RETURNING *';
    const values = [Math.floor(1000 + Math.random() * 9000), usuarioText, edadInteger]
    const res = await client.query(query, values)
    return res;
  }

  // editTodo(index, todoText) {
  //   this.todos[index].text = todoText;
  // }

  // deleteTodo(index) {
  //   this.todos.splice(index, 1);
  // }

  // toggleTodo(index) {
  //   this.todos[index].completed = !this.todos[index].completed;
  // }
}

// Controlador
class UsuarioController {
  constructor(model) {
    this.model = model;
  }

  async getUsuarios() {
   return await this.model.getUsuarios();
  }

  async addUsuario(usuarioText, edadInteger) {
    await this.model.addUsuario(usuarioText, edadInteger);
  }

  async getStatus(){
    return await {nombre: 'Christian Roberto Arnez Serrano', email: 'codevitax@gmail.com'};
  }

  // editTodo(index, todoText) {
  //   this.model.editTodo(index, todoText);
  // }

  // deleteTodo(index) {
  //   this.model.deleteTodo(index);
  // }

  // toggleTodo(index) {
  //   this.model.toggleTodo(index);
  // }
}

// Vistas (Rutas)
const app = express();
const usuarioModel = new UsuarioModel();
const usuarioController = new UsuarioController(usuarioModel);

app.use(bodyParser.json());

app.get("/usuarios",async  (req, res) => {
  const response = await usuarioController.getUsuarios()
  res.json(response)
});

app.get("/status",async  (req, res) => {
  const response = await usuarioController.getStatus()
  res.json(response)
});

// Vistas (Rutas) (continuación)
app.post("/usuarios", (req, res) => {
  const usuarioText = req.body.nombres;
  const usuarioInteger = req.body.edad;
  console.log(req.body)
  console.log(req.body.nombres)
  console.log(req.body.edad)
  usuarioController.addUsuario(usuarioText, usuarioInteger);
  res.sendStatus(200);
});

// app.put("/todos/:index", (req, res) => {
//   const index = req.params.index;
//   const todoText = req.body.text;
//   todoController.editTodo(index, todoText);
//   res.sendStatus(200);
// });

// app.delete("/todos/:index", (req, res) => {
//   const index = req.params.index;
//   todoController.deleteTodo(index);
//   res.sendStatus(200);
// });

// app.patch("/todos/:index", (req, res) => {
//   const index = req.params.index;
//   todoController.toggleTodo(index);
//   res.sendStatus(200);
// });

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});