// Funkcija za dobijanje vrednosti URL parametara
function getParametar(parametar) {
    const urlSearchParams = new URLSearchParams(window.location.search);
    return urlSearchParams.getAll(parametar);
}

// Dobijanje vrijednosti URL parametara
var nekretninaId = getParametar('id');
var nazivNekretnine = getParametar('naziv');
var kvadraturaNekretnine = getParametar('kvadratura');
var cijenaNekretnine = getParametar('cijena');
var lokacijaNekretnine = getParametar('lokacija');
var opisNekretnine = getParametar('opis');
var upitiNekretnine = getParametar('upit');
var korisnikIdNekretnine = getParametar('korisnik_id');


// Ispisivanje informacija u paragrafima
if (nazivNekretnine !== null) {
    document.getElementById('naziv').innerText = `Naziv: ${nazivNekretnine}`;
    document.getElementById('kvadratura').innerText = `Kvadratura: ${kvadraturaNekretnine}m²`;
    document.getElementById('cijena').innerText = `Cijena: ${cijenaNekretnine} KM`;

    document.getElementById('lokacija').innerText = `Lokacija: ${lokacijaNekretnine}`;
    document.getElementById('opis').innerText = `Opis: ${opisNekretnine}`;

   // console.log('korisnikIdNekretnine:', korisnikIdNekretnine);

    // Ispis upita
    if (upitiNekretnine !== null) {
        var upitiHtml = '';

        upitiNekretnine.forEach((upit, index) => {
            var upitT = upit.split('=');
            var upitTekst = upitT.length === 2 ? upitT[1] : upitT[0];
        
            // Koristimo indeks za pristup odgovarajućem korisnikIdNekretnine
            var korisnikId = korisnikIdNekretnine[index];
        
            upitiHtml += `<p><strong>Korisnik:</strong> ${korisnikId}</p>`;
            upitiHtml += `<p>${upitTekst}</p>`;
        });
        

        // Pronađi element sa ID-om 'upiti-lista' i postavi innerHTML
        var upitiListaElement = document.getElementById('upiti-lista');
        

        upitiListaElement.innerHTML = upitiHtml;
    }
}
