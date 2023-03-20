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



// PRUEBA CON archivos CIRCUIT and PILOTS:

const circuits = require("./circuit.json");
const pilots = require("./pilots.json");

app.get("/pruebas", (req, res) => {
    const circuitRaces = circuits.map((circuit) => {
        const pilotsData = pilots.map((pilot) => {
            return {
                id: pilot.id,
                name: pilot.name,
                minutes: "",
                position: "",
                points: ""
            };
        });
        return {
            id: circuit.id,
            name: circuit.Racename,
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


const data = require('./combinados.json');
const races = data.map((race) => ({
    name: race.Racename,
    id: race.id,
    pilots: race.pilots,
  }));

  app.get('/combinados', (req, res) => {
    res.render('combinados', { races });
  });

  const bodyParser = require('body-parser');
  app.use(bodyParser.urlencoded({ extended: true }));

  app.post('/update-minutes/:raceId/:pilotId', (req, res) => {
    const raceId = Number(req.params.raceId);
    const pilotId = Number(req.params.pilotId);
    const minutes = Number(req.body.minutes);
    const raceIndex = data.findIndex((race) => race.id === raceId);
    if (raceIndex !== -1) {
      const pilotIndex = data[raceIndex].pilots.findIndex((pilot) => pilot.id === pilotId);
      if (pilotIndex !== -1) {
        data[raceIndex].pilots[pilotIndex].minutes = minutes;
        // Save updated data to the JSON file
        fs.writeFileSync('combinados.json', JSON.stringify(data));
      }
    }
    // res.redirect('/');
});
 