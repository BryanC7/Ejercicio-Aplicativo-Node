

let select = document.getElementsByClassName("selector")

let arregloSelect = []

for (let index = 0; index < select.length; index++) {
  const element = select[index];
  arregloSelect.push(element)
}

let pilotosIngresados = []

let optionPilotos = document.getElementsByTagName("option")

let selectAbandono = document.getElementsByClassName("abandono")

arregloSelect.forEach(element =>{
  //Deshabilitar option de los nombres de pilotos ya ingresados
  element.addEventListener("change", function(){
    if(pilotosIngresados.includes(this.value)){
      for (let index = 0; index < optionPilotos.length; index++) {
        let option = optionPilotos[index];
        if(option.value == this.value){
          option.disabled = true
        }
      }
      
    }else{
      pilotosIngresados.push(this.value)
      if(pilotosIngresados.includes(this.value)){
        for (let index = 0; index < optionPilotos.length; index++) {
          let option = optionPilotos[index];
          if(option.value == this.value){
            option.disabled = true
          }
        }
      }
    }  
  })
  


  //hacer required los campos de tiempo en caso de ingresar piloto
  element.addEventListener("change", function(){
    let inputTiempo = document.getElementsByClassName(`tiempo${this.id}`)
    for (let index = 0; index < inputTiempo.length; index++) {
      let input = inputTiempo[index];
      input.required = true
    }
  })

  

  //Habilitar option de select en caso de error al seleccionar
  let valueSelect;
  element.addEventListener("click", function(){
    valueSelect = this.value
  })
  element.addEventListener("change", function(){
    
    if(pilotosIngresados.includes(valueSelect)){
      pilotosIngresados.splice(pilotosIngresados.indexOf(valueSelect),1)
      for (let index = 0; index < optionPilotos.length; index++) {
        let option = optionPilotos[index];
        if(option.value == valueSelect){
          option.disabled = false
        }
      }
    }
  })
  
})



let arregloSelectAbandono = []
for (let index = 1; index < selectAbandono.length; index++) {
  let element = selectAbandono[index];
  arregloSelectAbandono.push(element)
}

arregloSelectAbandono.forEach(select => {
  select.addEventListener("change", function(){
    let id = select.id.slice(select.id.length - 2)
    let inputTiempo = document.getElementsByClassName(`tiempo${id}`)
    
    for (let index = 0; index < inputTiempo.length; index++) {
      let input = inputTiempo[index];
      input.value = 0
    }
  })
});


//Envio de inputs formateados
let formulario = document.getElementById("ingresoDatos")

formulario.addEventListener("submit", evento =>{
  evento.preventDefault()
  let carrera = document.getElementById("carrera")
  if(carrera.value == "Carrera"){
    evento.preventDefault()
    alert("Ingrese Carrera")
  }else{
    let inputHh = document.getElementsByName("hh")
    let inputMm = document.getElementsByName("mm")
    let inputSs = document.getElementsByName("ss")
    let abandono = document.getElementsByName("abandono")

    let arregloPilotos = []
    let hh = []
    let mm = []
    let ss = []
    let arregloAbandono = []

    for (let index = 0; index < select.length; index++) {
      const element = select[index];
      if(element.value != "Piloto"){
        arregloPilotos.push(element.value)
      }else{
        arregloPilotos.push("")
      }
      
    }

    for (let index = 0; index < inputHh.length; index++) {
      const element = inputHh[index];
      if(element.value){
        hh.push(parseInt(element.value))
      }else{
        hh.push("")
      }
    }

    for (let index = 0; index < inputMm.length; index++) {
      const element = inputMm[index];
      if(element.value){
        mm.push(parseInt(element.value))
      }else{
        mm.push("")
      }
    }

    for (let index = 0; index < inputSs.length; index++) {
      const element = inputSs[index];
      if(element.value){
        ss.push(parseInt(element.value))
      }else{
        ss.push("")
      }
    }
    for (let index = 0; index < inputSs.length; index++) {
      const element = abandono[index];
      arregloAbandono.push(element.value)
      
    }

    let infoPost = {carrera:carrera.value,
                    pilotos: arregloPilotos,
                    hh: hh,
                    mm: mm,
                    ss: ss,
                    abandono: arregloAbandono
    }
    
    infoPost = JSON.stringify(infoPost)
    console.log( infoPost)

    
    
    fetch("http://localhost:3000/resultados-carrera",{ 
      method: 'POST',  
      headers: { 
        'Content-type' : 'application/json' 
      }, 
      body: infoPost
    }).then(
      window.location.href ="http://localhost:3000/ingresar-resultados"
    )

    }
    
  
})