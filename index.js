const express = require("express");
const hbs = require("hbs");
const fs = require("fs")
const data = require("./data/circuitos.json")
const data1 = require("./data/equipos.json");
const app = express()

//Settings
app.set("view engine", "hbs")
app.set("views", "./views")
app.set(express.static("public"))

//Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
hbs.registerPartials(__dirname + "./views/partials")
app.listen(3000)

 
//Routes
app.get("/", (req, res) => {
    
    let pilotos = data1.equipos.reduce((acc, equipo) => {
        return acc.concat([equipo.piloto1, equipo.piloto2])
        }, []);

    let banderas = [];
    console.log(banderas)
    for (let i = 0; i  < data.carrera.length; i++) {
    banderas.push(data.carrera[i].bandera);
    console.log(banderas)
    }
    console.log(banderas)
    
    res.render("index", { pilotos, banderas })
})

app.get("/ingresar-tiempos", (req, res) => {
    let pilotos = data1.equipos.reduce((acc, equipo) => {
        return acc.concat([equipo.piloto1, equipo.piloto2])
        }, []);

        let circuito = [];
    for (let i = 0; i < data.carrera.length; i++) {
        circuito.push(data.carrera[i].circuito)
    }

    res.render("ingresotiempos", { pilotos, circuito})
})


