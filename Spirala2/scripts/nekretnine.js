
let listaNekretnina1 = [
  {
    id: 1,
    tip_nekretnine: "Stan",
    naziv: "Useljiv stan ",
    kvadratura: 58,
    cijena: 350000,
   
  }, 
  {
    id: 2,
    tip_nekretnine: "Stan",
    naziv: "Useljiv stan ",
    kvadratura: 68,
    cijena: 307000,
   
  },
  {
    id: 3,
    tip_nekretnine: "Stan",
    naziv: "Useljiv stan ",
    kvadratura: 66,
    cijena: 235000,
   
  },
  {
    id: 4,
    tip_nekretnine: "Stan",
    naziv: "Useljiv stan ",
    kvadratura: 79,
    cijena: 350000,
   
  },
  {
    id: 5,
    tip_nekretnine: "Stan",
    naziv: "Useljiv stan ",
    kvadratura: 70,
    cijena: 285000,
   
  },

  {
    id: 6,
    tip_nekretnine: "Kuća",
    naziv: "Useljiv kuca ",
    kvadratura: 155,
    cijena: 181500,
   
  },

  {
    id: 7,
    tip_nekretnine: "Kuća",
    naziv: "Useljiv kuca ",
    kvadratura: 201,
    cijena: 199000,
   
  },
  {
    id: 8,
    tip_nekretnine: "Kuća",
    naziv: "Useljiv kuca ",
    kvadratura: 170,
    cijena: 320000,
   
  },
  {
    id: 9,
    tip_nekretnine: "Kuća",
    naziv: "Useljiv kuca ",
    kvadratura: 210,
    cijena: 515000,
   
  },

  {
    id: 10,
    tip_nekretnine: "Kuća",
    naziv: "Useljiv kuca ",
    kvadratura: 330,
    cijena: 179000,
   
  },

  {
    id: 11,
    tip_nekretnine: "Poslovni prostor",
    naziv: "Poslovni prostor  ",
    kvadratura: 54,
    cijena: 250000,
   
  },
  {
    id: 12,
    tip_nekretnine: "Poslovni prostor",
    naziv: "Poslovni prostor  ",
    kvadratura: 160,
    cijena: 500000,
   
  },
  {
    id: 13,
    tip_nekretnine: "Poslovni prostor",
    naziv: "Poslovni prostor  ",
    kvadratura: 80,
    cijena: 235800,
   
  },
  {
    id: 14,
    tip_nekretnine: "Poslovni prostor",
    naziv: "Poslovni prostor  ",
    kvadratura: 65,
    cijena: 240000,
   
  },
  {
    id: 15,
    tip_nekretnine: "Poslovni prostor",
    naziv: "Poslovni prostor  ",
    kvadratura: 24,
    cijena: 69000,
   
  },

 

];


function spojiNekretnine(divReferenca, instancaModula, tip_nekretnine) {
    const containerElement = document.getElementById("spisakNekretnina");
  
    listaNekretnina = instancaModula.filtrirajNekretnine({ tip_nekretnine: tip_nekretnine });  
     
 // ako ne postoji div za odgovarajuci tip; divReferenca == null
  // ako taj tip ima nekretnina u listi
  if (!divReferenca && listaNekretnina.length > 0) {
    divReferenca = document.createElement("div");
    divReferenca.classList.add("Tip");
    divReferenca.id = tip_nekretnine;
  }
  
    listaNekretnina.forEach((nekretnine) => {
  
      const nekretninaDiv = document.createElement("div");
  
      nekretninaDiv.classList.add("grid-item"); // Dodaj klasu grid-item
  
      // Stvori HTML unutar div-a
      nekretninaDiv.innerHTML = `
         <div id="grid" class="tip-${nekretnine.tip_nekretnine.toLowerCase()}">
              <p id="tip">${nekretnine.tip_nekretnine}</p>
              <p id="naziv">${nekretnine.naziv}</p>
              <p id="kvadratura">Kvadratura: <b>${nekretnine.kvadratura}</b></p>
              <p id="cijena">Cijena: <b>${nekretnine.cijena}</b></p>
          
  
              <button id ="dugme" >Detalji</button>
            </div>
        `;
      divReferenca.appendChild(nekretninaDiv)
    }
    );
  
    if (containerElement && divReferenca instanceof Node) {
      containerElement.appendChild(divReferenca);
    } /*else {
        console.error("containerElement nije definisan ili ne postoji.");
      }*/
  }
  
  
  // window.onload = spojiNekretnine;
  
  const divStan = document.getElementById("stan");
  const divKuca = document.getElementById("kuca");
  const divPp = document.getElementById("pp");
  
  
  //instanciranje modula
  let nekretnine = SpisakNekretnina();
  nekretnine.init(listaNekretnina1, []);
  //pozivanje funkcije
  spojiNekretnine(divStan, nekretnine, "Stan");
  spojiNekretnine(divKuca, nekretnine, "Kuća");
  spojiNekretnine(divPp, nekretnine, "Poslovni prostor");