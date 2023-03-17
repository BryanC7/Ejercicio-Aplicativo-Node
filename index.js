const express = require("express");
const app = express()
const hbs = require("hbs")
app.set('view engine', 'hbs');
app.set('views', './views');
app.use(express.static("public"))
hbs.registerPartials(__dirname + "/views/partials")

console.log("ASD")
const fs = require("fs");


app.listen(3000)

const equipos = JSON.parse(fs.readFileSync('equipos.json', 'utf-8'));
const pilotos = equipos.map(({ piloto1, piloto2 }) => [piloto1, piloto2]);
console.log(pilotos.flat());

// PILOTOS

app.get('/', (req, res) => {
    const pilotos = equipos.map(({ piloto1, piloto2 }) => ({ piloto1, piloto2 }));
    res.render('index', { pilotos });
});

// ESCUDERÍAS

const circuitos = require('./circuitos.json');

app.get("/carerras", (req, res) => {
    res.render("carreras", { circuitos });
});

console.log(circuitos)


// PRUEBA CON Otoros archivos:

const circuits = require("./circuit.json");
const pilots = require("./pilots.json");

app.get("/pruebas", (req, res) => {
    const circuitRaces = circuits.map((circuit) => {
        const pilotsData = pilots.map((pilot) => {
            return {
                id: pilot.id,
                name: pilot.name,
                minutes: Math.floor(Math.random() * 61) + 60, // generate random minutes between 60 and 120
                position: Math.floor(Math.random() * 20) + 1, // generate random position between 1 and 20
            };
        });
        return {
            id: circuit.id,
            name: circuit.name,
            pilots: pilotsData,
        };
    });
    res.render("pruebas", { circuitRaces });
});

