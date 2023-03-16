// Requires
const express = require('express')
const app = express()
const hbs = require('hbs')
const fs = require("fs")
const path = require('path')
const bodyParser = require("body-parser")

// Lectura de archivos json
let pilotos = JSON.parse(fs.readFileSync('equipos.json', {encoding:"utf-8"}))
const circuitos = JSON.parse(fs.readFileSync('circuitos.json', {encoding:"utf-8"}))

// Use & set de express
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.set('view engine', 'hbs')
app.set('views', './views')
app.use(express.static(path.join(__dirname , 'node_modules/bootstrap/dist')))

// Registros en hbs
hbs.registerPartials(__dirname + '/views/partials')
hbs.registerHelper("suma", function(value, options) {return parseInt(value) + 1})

// Levantando el servicio
app.listen(3000)

// Unión de todos los pilotos
const pilotos1 = pilotos.map(equipo => equipo.piloto1)
const pilotos2 = pilotos.map(equipo => equipo.piloto2)
pilotos = (pilotos1.concat(...pilotos2))

// Renderizado de página index y traspaso de archivos json al index para la iteración
app.get('/', (req, res) => res.render('index', {pilotos: pilotos, carreras: circuitos}))

// Rescata los datos del formulario y los almacena en un nuevo archivo json
app.post("/cargar", (req, res) => {
    console.log(req)
})

// Muestra un mensaje si alguna ruta no se encontró
app.all("*", (req, res) => res.status(404).send("Página no encontrada"))