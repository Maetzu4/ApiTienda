//------ rutas.js----------------------------------------
//--- Rutas de acceso a nuestra API y sus métodos CRUD
const route = require("express").Router();
const customerController = require("../controller/customersController");

// Usar el controlador de clientes para las rutas de la API
route.use("/", customerController); // http://localhost:3300/

module.exports = route;
