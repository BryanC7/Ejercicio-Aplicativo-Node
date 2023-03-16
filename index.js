const express = require('express')
const hbs = require('hbs')
const fs = require("fs");
const app = express()
const json = JSON.parse(fs.readFileSync('equipos.json', {encoding:"utf-8"}))

app.set('view engine', 'hbs')
app.set('views', './views')
app.listen(3000)

app.get('/', (req, res) => res.render('index', {resultado: json}))

// Ruta para mostrar un mensaje si la página no se encontró
app.all("*", (req, res) => res.status(404).send("Página no encontrada"))