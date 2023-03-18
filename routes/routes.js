import { Router } from "express";

import fs from "fs";

import bodyParser from "body-parser";

const router = Router()

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json())

router.get("/", (req, res) =>{
    res.render("index",{"titulo": "F1 Info"})
    
})

router.get("/ingresar-resultados", (req, res) =>{
    let infoPilotos = JSON.parse(fs.readFileSync("./BD/equipos.json"))
    let carreras = JSON.parse(fs.readFileSync("./BD/circuitos.json"))

    let circuitos = []

    carreras.forEach(carrera =>{
        circuitos.push({"carrera":carrera.circuito})
    })
    
    
    let equipos = infoPilotos.equipos
    let escuderias = []
    let pilotos = equipos.map(escuderia =>[escuderia.piloto1, escuderia.piloto2]).flat()

    let nombresPilotos = []
    pilotos.forEach(element =>{
        nombresPilotos.push({"piloto":element})
    })

    let i = 0
    equipos.forEach(element => {
    
       
        escuderias.push({"numero":i,"escuderia":element.escuderia,"piloto":element.piloto1,"pilotos":nombresPilotos})
        i++
        
        escuderias.push({"numero":i,"escuderia":element.escuderia,"piloto":element.piloto2,"pilotos":nombresPilotos})
        
        i++
    });

    
    
    res.render("ingresar-resultados",{"escuderias":escuderias,"circuitos":circuitos, "script":"/public/js/formularioIngreso.js"})
})


router.post("/resultados-carrera", (req, res) =>{

    let resultados = JSON.parse(fs.readFileSync("./BD/resultados.json"))

    let resultadoCarrera =  {
                                carrera:req.body.carrera,
                                resultados: []
                            }
    
    let pilotos = req.body.pilotos
    let hh = req.body.hh
    let mm = req.body.mm
    let ss = req.body.ss
    let abandono = req.body.abandono

    for (let index = 0; index < pilotos.length; index++) {
        let piloto = pilotos[index];
        let hhCarrera = hh[index];
        let mmCarrera = mm[index];
        let ssCarrera = ss[index];
        let abandonoCarrera = abandono[index]
        if(piloto != ""){
            let tiempoSegundos = (hhCarrera*3600) + (mmCarrera*60) + ssCarrera
            resultadoCarrera.resultados.push({piloto:piloto, tiempo:tiempoSegundos, abandono:abandonoCarrera })
        }
        
    }          

    resultados.push(resultadoCarrera)
    
    fs.writeFileSync("./BD/resultados.json",JSON.stringify(resultados))
    
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