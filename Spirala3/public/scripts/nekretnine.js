
let nekretnineModul; 

document.addEventListener('DOMContentLoaded', () => {

  // Pozivanje funkcije za dohvat nekretnina sa servera
  PoziviAjax.getNekretnine((error, data) => {
      if (error) {
          console.error('Greška prilikom dohvata nekretnina:', error);
      } else {
          // Inicijalizacija modula s dohvaćenim podacima
          nekretnineModul = new SpisakNekretnina();
          nekretnineModul.init(data, []); // Nema korisnika za sada

          // Pozivanje funkcije za svaki tip nekretnine
          spojiNekretnine('Stan', nekretnineModul, "Stan");
          spojiNekretnine('Kuca', nekretnineModul, "Kuca");
          spojiNekretnine('Pp', nekretnineModul, "Poslovni prostor");

          const searchButton= document.getElementById('search');
          if(searchButton){
            searchButton.addEventListener('click', function(){
                var filteredNekretnine=[1,2,3];
                MarketingAjax.sendFilteredProperties(filteredNekretnine);
            });
          }
          const nekretnineContainers = document.querySelectorAll('#Stan, #Kuca, #Pp');

          if (nekretnineContainers.length > 0) {
              nekretnineContainers.forEach(container => {
                  container.addEventListener('click', function (event) {
                      if (event.target.tagName === 'BUTTON') {
                          var clickedNekretninaId = event.target.dataset.nekretninaId; 
                          MarketingAjax.sendClickedNekretnina(clickedNekretninaId);
                      }
                  });
              });
            }
      }
  });

 



  function spojiNekretnine(divReferenca, instancaModula, tip_nekretnine) {
      const containerElement = document.getElementById(divReferenca);

      if (containerElement) {
          const filtriraneNekretnine = instancaModula.filtrirajNekretnine({ tip_nekretnine: tip_nekretnine });

          filtriraneNekretnine.forEach((nekretnine) => {
              const nekretninaDiv = document.createElement("div");
              nekretninaDiv.classList.add("grid-item");

              nekretninaDiv.innerHTML = `
                  <div id="grid" class="tip-${nekretnine.tip_nekretnine.toLowerCase()}">
                      <p id="tip">${nekretnine.tip_nekretnine}</p>
                      <p id="naziv">${nekretnine.naziv}</p>
                      <p id="kvadratura">Kvadratura: <b>${nekretnine.kvadratura}</b></p>
                      <p id="cijena">Cijena: <b>${nekretnine.cijena}</b></p>
                      <p id="pretrage-id${nekretnine.id}">Pretrage: 0</p>
                      <p id="klikovi-id${nekretnine.id}">Klikovi: 0</p>
                      <button id="dugme">Detalji</button>
                  </div>
              `;

              containerElement.appendChild(nekretninaDiv);
          });
      } else {
          console.error("containerElement nije definisan ili ne postoji.");
      }
  }
});





 // Funkcija za filtriranje nekretnina na temelju unesenih kriterija
 function filtrirajNekretnine() {
    const minPrice = document.getElementById('minPrice').value;
    const maxPrice = document.getElementById('maxPrice').value;
    const minArea = document.getElementById('minArea').value;
    const maxArea = document.getElementById('maxArea').value;

    const filterCriteria = {};

    if (minPrice !== '') {
        filterCriteria.min_cijena = parseFloat(minPrice);
    }
    if (maxPrice !== '') {
        filterCriteria.max_cijena = parseFloat(maxPrice);
    }
    if (minArea !== '') {
        filterCriteria.min_kvadratura = parseFloat(minArea);
    }
    if (maxArea !== '') {
        filterCriteria.max_kvadratura = parseFloat(maxArea);
    }

    const stanContainer = document.getElementById('Stan');
    const kucaContainer = document.getElementById('Kuca');
    const ppContainer = document.getElementById('Pp');

    if (nekretnineModul) {
        const filtriraneNekretnine = nekretnineModul.filtrirajNekretnine(filterCriteria);

        stanContainer.innerHTML = '';
        kucaContainer.innerHTML = '';
        ppContainer.innerHTML = '';

        filtriraneNekretnine.forEach((nekretnine) => {
            const nekretninaDiv = document.createElement("div");
            nekretninaDiv.classList.add("grid-item");

            nekretninaDiv.innerHTML = `
                <div id="grid" class="tip-${nekretnine.tip_nekretnine.toLowerCase()}">
                    <p id="tip">${nekretnine.tip_nekretnine}</p>
                    <p id="naziv">${nekretnine.naziv}</p>
                    <p id="kvadratura">Kvadratura: <b>${nekretnine.kvadratura}</b></p>
                    <p id="cijena">Cijena: <b>${nekretnine.cijena}</b></p>
                    <p id="pretrage-id${nekretnine.id}">Pretrage: 0</p>
                    <p id="klikovi-id${nekretnine.id}">Klikovi: 0</p>
                    <button id="dugme">Detalji</button>
                </div>
            `;

            if (nekretnine.tip_nekretnine === 'Stan') {
                stanContainer.appendChild(nekretninaDiv);
            } else if (nekretnine.tip_nekretnine === 'Kuca') {
                kucaContainer.appendChild(nekretninaDiv);
            } else if (nekretnine.tip_nekretnine === 'Poslovni prostor') {
                ppContainer.appendChild(nekretninaDiv);
            }
        });
    } else {
        console.error("Modul za nekretnine nije inicijaliziran.");
    }
}



// Dodavanje event listenera na dugme za filtriranje
const filtrirajButton = document.querySelector('button[onclick="filtrirajNekretnine()"]');
filtrirajButton.addEventListener('click', filtrirajNekretnine);



