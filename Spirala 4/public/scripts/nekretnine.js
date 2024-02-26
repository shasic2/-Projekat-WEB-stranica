
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

            // Očisti container prije dodavanja novih nekretnina
            containerElement.innerHTML = '';

            filtriraneNekretnine.forEach((nekretnina) => {
                const nekretninaDiv = document.createElement("div");
                nekretninaDiv.classList.add("grid-item");
                nekretninaDiv.id = `grid-${nekretnina.id}`;

                nekretninaDiv.innerHTML = `
                <div class="tip-${nekretnina.tip_nekretnine.toLowerCase()}">
                    <p id="tip">${nekretnina.tip_nekretnine}</p>
                    <p id="naziv">${nekretnina.naziv}</p>
                    <p id="kvadratura">Kvadratura: <b>${nekretnina.kvadratura}</b></p>
                    <p id="cijena">Cijena: <b>${nekretnina.cijena}</b></p>
                    <p id="lokacija" class="hidden">Lokacija: <b>${nekretnina.lokacija}</b></p>
                    <p id="godinaIzgradnje" class="hidden">Godina izgradnje: <b>${nekretnina.godina_izgradnje}</b></p>
                    <button class="detalji-btn" data-nekretnina-id="${nekretnina.id}">Detalji</button>
                    <button class="otvori-detalje-btn hidden">Prikaži detalje</button>
                </div>
            `;

                containerElement.appendChild(nekretninaDiv);
            });

            // Dodajte event listenere za dugmad "Detalji" i "Prikaži detalje"
            const detaljiButtons = containerElement.querySelectorAll('.detalji-btn');
            detaljiButtons.forEach(button => {
                button.addEventListener('click', prikaziDetalje);
            });
        } else {
            console.error("containerElement nije definisan ili ne postoji.");
        }
    }


    function prikaziDetalje(event) {
        const nekretninaId = event.target.dataset.nekretninaId;
        const nekretninaDiv = document.getElementById(`grid-${nekretninaId}`);

        // Zatvori sve prethodno otvorene informacije i dugme "Prikaži detalje"
        const sveNekretnine = document.querySelectorAll('.grid-item');
        sveNekretnine.forEach(nekDiv => {
            const lokacijaElement = nekDiv.querySelector('#lokacija');
            const godinaIzgradnjeElement = nekDiv.querySelector('#godinaIzgradnje');
            const otvoriDetaljeBtn = nekDiv.querySelector('.otvori-detalje-btn');

            if (lokacijaElement && godinaIzgradnjeElement && otvoriDetaljeBtn) {
                lokacijaElement.classList.add('hidden');
                godinaIzgradnjeElement.classList.add('hidden');
                otvoriDetaljeBtn.classList.add('hidden');
            }
        });

        // Otvori dodatne informacije i dugme "Prikaži detalje" za trenutnu nekretninu
        if (nekretninaDiv) {
            const lokacijaElement = nekretninaDiv.querySelector('#lokacija');
            const godinaIzgradnjeElement = nekretninaDiv.querySelector('#godinaIzgradnje');
            const otvoriDetaljeBtn = nekretninaDiv.querySelector('.otvori-detalje-btn');

            if (lokacijaElement && godinaIzgradnjeElement && otvoriDetaljeBtn) {
                lokacijaElement.classList.toggle('hidden');
                godinaIzgradnjeElement.classList.toggle('hidden');
                otvoriDetaljeBtn.classList.toggle('hidden');

                // Dodaj event listener za dugme "Otvori detalje" na trenutnoj nekretnini
                otvoriDetaljeBtn.addEventListener('click', function () {
                    // Ovdje dobavi ID nekretnine iz data atributa dugmeta
                    var nekretninaId = event.target.dataset.nekretninaId
                    // Spremi ID nekretnine u localStorage
                      localStorage.setItem('nekretninaId', nekretninaId);
                   // console.log('id:', nekretninaId);
                    // Pozovi metodu za dobijanje detalja o nekretnini sa servera
                    PoziviAjax.getNekretninaById(nekretninaId, function (error, data) {
                        if (error) {
                            // Obradi grešku, npr. prikaži poruku korisniku
                            console.error(error);
                        } else {
                          
                            // Kreiraj URL stranice detalji.html sa podacima o nekretnini kao query parametrima
                          var upitiUrlParam = data.upiti.map(upit => `upit=${encodeURIComponent(upit.tekst_upita)}&korisnik_id=${encodeURIComponent(upit.korisnik_id)}`).join('&');
                          var detaljiUrl = `detalji.html?id=${data.id}&naziv=${data.naziv}&kvadratura=${data.kvadratura}&cijena=${data.cijena}&lokacija=${data.lokacija}&tipGrijanja=${data.tipGrijanja}&godinaIzgradnje=${data.godinaIzgradnje}&opis=${data.opis}&${upitiUrlParam}`;
                  
                          // Postavi trenutni prozor/tab na detalji.html sa novim parametrima
                          window.location.href = detaljiUrl;


                        }
                    });
                });
            }
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

        filtriraneNekretnine.forEach((nekretnina) => {
            const nekretninaDiv = document.createElement("div");
            nekretninaDiv.classList.add("grid-item");
            nekretninaDiv.id = `grid-${nekretnina.id}`;

            nekretninaDiv.innerHTML = `
                <div class="tip-${nekretnina.tip_nekretnine.toLowerCase()}">
                    <p id="tip">${nekretnina.tip_nekretnine}</p>
                    <p id="naziv">${nekretnina.naziv}</p>
                    <p id="kvadratura">Kvadratura: <b>${nekretnina.kvadratura}</b></p>
                    <p id="cijena">Cijena: <b>${nekretnina.cijena}</b></p>
                    <p id="lokacija" class="hidden">Lokacija: <b>${nekretnina.lokacija}</b></p>
                    <p id="godinaIzgradnje" class="hidden">Godina izgradnje: <b>${nekretnina.godina_izgradnje}</b></p>
                    <button class="detalji-btn" data-nekretnina-id="${nekretnina.id}">Detalji</button>
                    <button class="otvori-detalje-btn hidden">Prikaži detalje</button>
                </div>
            `;

            if (nekretnina.tip_nekretnine === 'Stan') {
                stanContainer.appendChild(nekretninaDiv);
            } else if (nekretnina.tip_nekretnine === 'Kuca') {
                kucaContainer.appendChild(nekretninaDiv);
            } else if (nekretnina.tip_nekretnine === 'Poslovni prostor') {
                ppContainer.appendChild(nekretninaDiv);
            }
        });

        // Dodajte event listenere za dugmad "Detalji" i "Prikaži detalje"
        const detaljiButtons = document.querySelectorAll('.detalji-btn');
        detaljiButtons.forEach(button => {
            button.addEventListener('click', prikaziDetalje);
        });


    } else {
        console.error("Modul za nekretnine nije inicijaliziran.");
    }
}


function prikaziDetalje(event) {
    const nekretninaId = event.target.dataset.nekretninaId;
    const nekretninaDiv = document.getElementById(`grid-${nekretninaId}`);

    // Zatvori sve prethodno otvorene informacije i dugme "Prikaži detalje"
    const sveNekretnine = document.querySelectorAll('.grid-item');
    sveNekretnine.forEach(nekDiv => {
        const lokacijaElement = nekDiv.querySelector('#lokacija');
        const godinaIzgradnjeElement = nekDiv.querySelector('#godinaIzgradnje');
        const otvoriDetaljeBtn = nekDiv.querySelector('.otvori-detalje-btn');

        if (lokacijaElement && godinaIzgradnjeElement && otvoriDetaljeBtn) {
            lokacijaElement.classList.add('hidden');
            godinaIzgradnjeElement.classList.add('hidden');
            otvoriDetaljeBtn.classList.add('hidden');
        }
    });

    // Otvori dodatne informacije i dugme "Prikaži detalje" za trenutnu nekretninu
    if (nekretninaDiv) {
        const lokacijaElement = nekretninaDiv.querySelector('#lokacija');
        const godinaIzgradnjeElement = nekretninaDiv.querySelector('#godinaIzgradnje');
        const otvoriDetaljeBtn = nekretninaDiv.querySelector('.otvori-detalje-btn');

        if (lokacijaElement && godinaIzgradnjeElement && otvoriDetaljeBtn) {
            lokacijaElement.classList.toggle('hidden');
            godinaIzgradnjeElement.classList.toggle('hidden');
            otvoriDetaljeBtn.classList.toggle('hidden');

            // Dodaj event listener za dugme "Otvori detalje" na trenutnoj nekretnini
            otvoriDetaljeBtn.addEventListener('click', function () {
                // Ovdje dobavi ID nekretnine iz data atributa dugmeta
                var nekretninaId = event.target.dataset.nekretninaId
                console.log('id:', nekretninaId);
                // Pozovi metodu za dobijanje detalja o nekretnini sa servera
                PoziviAjax.getNekretninaById(nekretninaId, function (error, data) {
                    if (error) {
                        // Obradi grešku, npr. prikaži poruku korisniku
                        console.error(error);
                    } else {
                            // Kreiraj URL stranice detalji.html sa podacima o nekretnini kao query parametrima
                            var upitiUrlParam = data.upiti.map(upit => `upit=${encodeURIComponent(upit.tekst_upita)}&korisnik_id=${encodeURIComponent(upit.korisnik_id)}`).join('&');
                          var detaljiUrl = `detalji.html?id=${data.id}&naziv=${data.naziv}&kvadratura=${data.kvadratura}&cijena=${data.cijena}&lokacija=${data.lokacija}&tipGrijanja=${data.tipGrijanja}&godinaIzgradnje=${data.godinaIzgradnje}&opis=${data.opis}&${upitiUrlParam}`;
                  
                          // Postavi trenutni prozor/tab na detalji.html sa novim parametrima
                          window.location.href = detaljiUrl;
                    }
                });
            });
        }
    }
}

// Dodavanje event listenera na dugme za filtriranje
const filtrirajButton = document.querySelector('button[onclick="filtrirajNekretnine"]');
//filtrirajButton.addEventListener('click', filtrirajNekretnine);




