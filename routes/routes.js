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
    let esc= JSON.parse(fs.readFileSync("./BD/equipos.json"))
    let equipos = []
    
    for (let index = 0; index < esc.equipos.length; index++) {
        const element = esc.equipos[index];
        equipos.push(element)
    }


    resultados.forEach(element =>{
        if(element.carrera == req.body.carrera){
           resultados.splice(resultados.indexOf(element),1)
        }
    })
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
        let escuderia;

        let piloto = pilotos[index];
        let hhCarrera = hh[index];
        let mmCarrera = mm[index];
        let ssCarrera = ss[index];
        let abandonoCarrera = abandono[index]

        equipos.forEach(element => {
            if(element.piloto1 == piloto || element.piloto2 == piloto){
                escuderia = element.escuderia
            }
        });
        if(piloto != ""){
            let tiempoSegundos = (hhCarrera*3600) + (mmCarrera*60) + ssCarrera
            resultadoCarrera.resultados.push({piloto:piloto, escuderia:escuderia, tiempo:tiempoSegundos, abandono:abandonoCarrera })
        }
        
    }          
    resultadoCarrera = resultadoCarrera.resultados.sort(((a, b) => a.tiempo - b.tiempo ))
    let puestos = []
    let abandonos = []
    let puntaje = [25,18,15,12,10,8,6,4,3,2,1]

    
    resultadoCarrera.forEach(element =>{
        if(element.tiempo !=0){
            puestos.push(element)
        }else{
            abandonos.push(element)
        }
    })

    for (let index = 0; index < puestos.length; index++) {
        let piloto = puestos[index];
        let puntos = puntaje[index]
        if(index < 10){
            piloto.puntos = puntos
        }else{
            piloto.puntos = 0
        }
    }

    abandonos.forEach(element =>{
        element.puntos = 0
    })
    
    resultadoCarrera = {
                            carrera:req.body.carrera,
                            resultados: puestos.concat(abandonos)
                        }
    
    

    resultados.push(resultadoCarrera)
    
    fs.writeFileSync("./BD/resultados.json",JSON.stringify(resultados))
    
})

router.get("/puntaje-piloto", (req, res) =>{
    let result = JSON.parse(fs.readFileSync("./BD/resultados.json"))
    let esc = JSON.parse(fs.readFileSync("./BD/equipos.json")).equipos
    let circuitos = JSON.parse(fs.readFileSync("./BD/circuitos.json"))
    let puntajes = []
    let banderas = []
    let pilotos = []
    let resultados= []

    for (let index = 0; index < result.length; index++) {
        const element = result[index];
        resultados.push(element)
    }
    for (let index = 0; index < circuitos.length; index++) {
        const element = circuitos[index];
        banderas.push({bandera:element.bandera})
    }
    
    for (let index = 0; index < esc.length; index++) {
        const element = esc[index];
        pilotos.push(element.piloto1)
        pilotos.push(element.piloto2)
    }

    pilotos.forEach(piloto =>{
        let a = {piloto:piloto,totalpuntos: 0, carreras:[]}
        circuitos.forEach(carrera =>{
            a.carreras.push("-")
        })
        puntajes.push(a)

    })
  
    
   //Total de puntajes por piloto
    resultados.forEach(result =>{
        result.resultados.forEach(carrera =>{
            puntajes.forEach(piloto =>{
                if(piloto.piloto == carrera.piloto){
                    piloto.totalpuntos += carrera.puntos
                }
            })
        })
    })
    
    
   
    

    puntajes.forEach(piloto =>{
        for (let index = 0; index < circuitos.length; index++) {
            const carrera = circuitos[index];
            let i = circuitos.indexOf(carrera)
            resultados.forEach(result =>{
                if(carrera.circuito == result.carrera){
                    result.resultados.forEach(resultadoPiloto =>{
                        if(piloto.piloto == resultadoPiloto.piloto){
                            piloto.carreras[i] = resultadoPiloto.puntos
                        }
                        
                    })
                }
            })
        }
    })
    
   puntajes = puntajes.sort((a, b) => b.totalpuntos - a.totalpuntos)
   
   let i = 1
   puntajes.forEach(piloto =>{
    piloto.posicion = i++
   })
   
   

    res.render("puntaje-piloto",{banderas,puntajes})
})


router.get("/puntaje-escuderia", (req, res) =>{

    let archivoResultados = JSON.parse(fs.readFileSync("./BD/resultados.json"))
    let archivoEquipos = JSON.parse(fs.readFileSync("./BD/equipos.json"))
    let resultados = []
    let equipos = []

    archivoResultados.forEach(element =>{
        element.resultados.forEach(piloto =>{
            resultados.push(piloto)
        })
    })

    for (let index = 0; index < archivoEquipos.equipos.length; index++) {
        const element = archivoEquipos.equipos[index];
        equipos.push(element)
    }
    
    let escuderias = []
    equipos.forEach(element =>{
        escuderias.push({escuderia:element.escuderia, puntaje:0})
    })


    escuderias.forEach(escuderia =>{
        let puntos = 0
        resultados.forEach(piloto =>{
            if(piloto.escuderia == escuderia.escuderia){
                puntos += piloto.puntos
            }
        })
        escuderia.puntaje = puntos
    })

    escuderias = escuderias.sort((a, b) => b.puntaje - a.puntaje)

    let i = 1
    escuderias.forEach(equipo =>{
        equipo.posicion = i
        i++
    })
    
    res.render("puntaje-escuderia",{escuderias})
})

router.get("/ranking-abandono", (req, res) =>{
    let archivoResultados = JSON.parse(fs.readFileSync("./BD/resultados.json"))
    let archivoEquipos = JSON.parse(fs.readFileSync("./BD/equipos.json"))
    let pilotos = []
    let resultados = []
    let abandonos = []

    archivoResultados.forEach(element =>{
        element.resultados.forEach(piloto =>{
            resultados.push(piloto)
        })
    })

    for (let index = 0; index < archivoEquipos.equipos.length; index++) {
        const element = archivoEquipos.equipos[index];
        pilotos.push(element)
    }
    
    
    pilotos.forEach(element =>{
        abandonos.push({piloto:element.piloto1, puntosabandono:0, escuderia:element.escuderia})
        abandonos.push({piloto:element.piloto2, puntosabandono:0, escuderia:element.escuderia})
    })

    abandonos.forEach(piloto =>{
        let cantAbandono = 0
        resultados.forEach(element =>{
           
            if(piloto.piloto == element.piloto && element.abandono == "si"){
                cantAbandono++
            }

        })
        piloto.puntosabandono = cantAbandono
    })

    abandonos = abandonos.sort((a, b) => b.puntosabandono - a.puntosabandono )
    let i = 1
    abandonos.forEach(equipo =>{
        equipo.posicion = i
        i++
    })
    res.render("ranking-abandono",{abandonos})
})

router.get("*", (req, res) =>{
    res.render("error")
})



export default router


