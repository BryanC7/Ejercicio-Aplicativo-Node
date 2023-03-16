const express = require('express')
const hbs = require('hbs')
const fs = require("fs");
const app = express()
const path = require('path')
let pilotos = JSON.parse(fs.readFileSync('equipos.json', {encoding:"utf-8"}))
const circuitos = JSON.parse(fs.readFileSync('circuitos.json', {encoding:"utf-8"}))

app.set('view engine', 'hbs')
app.set('views', './views')
app.use(express.static(path.join(__dirname , 'node_modules/bootstrap/dist')))

hbs.registerPartials(__dirname + '/views/partials')
hbs.registerHelper("suma", function(value, options) {return parseInt(value) + 1})
app.listen(3000)

const pilotos1 = pilotos.map(equipo => equipo.piloto1)
const pilotos2 = pilotos.map(equipo => equipo.piloto2)
pilotos = (pilotos1.concat(...pilotos2))

app.get('/', (req, res) => res.render('index', {pilotos: pilotos, carreras: circuitos}))

// Ruta para mostrar un mensaje si la página no se encontró
app.all("*", (req, res) => res.status(404).send("Página no encontrada"))