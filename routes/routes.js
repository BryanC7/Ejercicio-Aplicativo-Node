import { Router } from "express";

import fs from "fs";

import bodyParser from "body-parser";

const router = Router()

router.use(bodyParser.urlencoded({ extended: false }));

router.get("/", (req, res) =>{
    res.render("index",{"titulo": "F1 Info"})
    
})

router.get("/ingresar-resultados", (req, res) =>{
    let infoPilotos = JSON.parse(fs.readFileSync("./BD/equipos.json"))
    console.log(infoPilotos)
    let equipos = infoPilotos.equipos
    let escuderias = []
    let pilotos = equipos.map(escuderia =>[escuderia.piloto1, escuderia.piloto2]).flat()

    let nombresPilotos = []
    pilotos.forEach(element =>{
        nombresPilotos.push({"piloto":element})
    })

    let i = 0
    equipos.forEach(element => {
        i++
        escuderias.push({"numero":i,"escuderia":element.escuderia,"piloto":element.piloto1,"pilotos":nombresPilotos})
        i++
        escuderias.push({"numero":i,"escuderia":element.escuderia,"piloto":element.piloto2,"pilotos":nombresPilotos})
    });
    res.render("ingresar-resultados",{"escuderias":escuderias, "script":"/public/js/formularioIngreso.js"})
})


router.post("/resultados-carrera", (req, res) =>{
    
    console.log(req.body)
    
    res.send("asasd")
})
router.get("*", (req, res) =>{
    res.render("error")
})

export default router


//escritura de json con resultados

/*app.post('/cargar', (req, res) => {
    const resultado = {
        piloto: req.body.piloto,
        carrera: req.body.carrera,
        posicion: req.body.posicion,
        abandono: req.body.abandono
    }

    resultadosCarreras.push(resultado)
    fs.writeFileSync('resultados.json', JSON.stringify(resultadosCarreras))
    res.send('Resultado almacenado correctamente')
})*/