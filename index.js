const express = require("express");
const hbs = require("hbs");
const { join } = require("path");
const path = require("path")
const data = require("./data/circuitos.json")
const data1 = require("./data/equipos.json");
const app = express()

//Settings
app.set("views", "./views")
app.set("view engine", "hbs")
app.set(express.static(join(__dirname, "/node_modules/bootstrap/dist")))
app.set(express.static(join(__dirname, "/node_modules/jquery/dist")))
app.set(express.static("/public"))
hbs.registerPartials(__dirname + "/views/partials")



//Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.disabled("etag")
app.listen(3000)


//Routes

app.get("/", (req, res) => {

    let pilotos = data1.equipos.reduce((acc, equipo) => {
        return acc.concat([equipo.piloto1, equipo.piloto2])
    }, []);

    let banderas = [];
    
    for (let i = 0; i < data.carrera.length; i++) {
        banderas.push(data.carrera[i].bandera);
    }
    
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

    res.render("ingresotiempos", { pilotos, circuito })
})

app.get("/ranking", (req, res) => {
    let escuderia = [];
    let logo = [];
    for (let i = 0; i < data1.equipos.length; i++) {
        escuderia.push(data1.equipos[i].escuderia)
        logo.push(data1.equipos[i].logo)
    }

    res.render("ptosescud", { escuderia, logo })
})



