// Requires
const express = require('express')
const app = express()
const hbs = require('hbs')
const fs = require('fs')
const path = require('path')
const bodyParser = require('body-parser')

// Lectura de archivos json
let pilotos = JSON.parse(fs.readFileSync('equipos.json', {encoding:'utf-8'}))
const circuitos = JSON.parse(fs.readFileSync('circuitos.json', {encoding:'utf-8'}))
const resultadosCarreras = JSON.parse(fs.readFileSync('resultados.json', {encoding:"utf-8"}))

// Use & set de express
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.set('view engine', 'hbs')
app.set('views', './views')
app.use(express.static(path.join(__dirname , 'node_modules/bootstrap/dist')))

// Registros en hbs
hbs.registerPartials(__dirname + '/views/partials')
hbs.registerHelper('suma', value => parseInt(value) + 1)

// Levantando el servicio
app.listen(3000)

// Unión de todos los pilotos
pilotos = pilotos.map(equipo => [equipo.piloto1, equipo.piloto2]).flat()

// Renderizado de página index y traspaso de archivos json al index para la iteración
app.get('/', (req, res) => res.render('index', {pilotos: pilotos, carreras: circuitos}))

// Rescata los datos del formulario y los almacena en un nuevo archivo json
app.post('/cargar', (req, res) => {
    const resultado = {
        piloto: req.body.piloto,
        carrera: req.body.carrera,
        posicion: req.body.posicion,
        abandono: req.body.abandono
    }

    resultadosCarreras.push(resultado)
    fs.writeFileSync('resultados.json', JSON.stringify(resultadosCarreras))
    res.send('Resultado almacenado correctamente')
})

// Muestra un mensaje si alguna ruta no se encontró
app.all('*', (req, res) => res.status(404).send('Página no encontrada'))