alert("PRUEBA")

const circuitosDropdown = document.getElementById('circuitos-dropdown');

circuitosDropdown.addEventListener('change', function () {
  const selectedCircuito = circuitosDropdown.value;
  console.log('Selected circuito:', selectedCircuito);
});
