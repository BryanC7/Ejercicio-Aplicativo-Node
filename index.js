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

// CIRCUITOS

const circuitos = require('./circuitos.json');

app.get("/carerras", (req, res) => {
    res.render("carreras", { circuitos });
});

console.log(circuitos)


// PRUEBA CON Otros archivos:

const circuits = require("./circuit.json");
const pilots = require("./pilots.json");

app.get("/pruebas", (req, res) => {
    const circuitRaces = circuits.map((circuit) => {
        const pilotsData = pilots.map((pilot) => {
            return {
                id: pilot.id,
                name: pilot.name,
                minutes: "",
                position:"",
                points: ""
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

// "SUMA valores"

// const combinados = require("./combinados.json");

// const scores = {};

// combinados.forEach((race) => {
//     race.pilots.forEach((pilot) => {
//         if (scores[pilot.id]) {
//             scores[pilot.id] += pilot.puntaje;
//         } else {
//             scores[pilot.id] = pilot.puntaje;
//         }
//     });
// });

// console.log(scores);

