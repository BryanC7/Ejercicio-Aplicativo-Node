

let select = document.getElementsByClassName("selector")

let arregloSelect = []

for (let index = 0; index < select.length; index++) {
  const element = select[index];
  arregloSelect.push(element)
}

let pilotosIngresados = []

let optionPilotos = document.getElementsByTagName("option")



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

  //Habilitar option de select en caso de error
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







