function postaviUpit() {
  // Dobavite vrednosti iz input polja
  const nekretninaId = localStorage.getItem('nekretninaId');
  var tekst_upita = document.getElementById("tekst_upita").value;

  // Pozovite funkciju za slanje upita
  PoziviAjax.postUpit(nekretninaId, tekst_upita, function(err, result) {
    console.log('Poziv funkcije postUpit:', err, result);

    if (err) {
      if (err === 'Unauthorized') {
        console.error('Korisnik nije prijavljen.');
      } else {
        console.error('Greška prilikom slanja upita:', err);
      }
    } else {
      // Ako je upit uspešno poslat
      console.log('Upit je uspešno poslat:', result);

      // Prikazivanje bannera o uspešnom dodavanju upita
      prikaziBanner('Upit je uspešno poslat!');

      // Ispraznite input polje
      document.getElementById("tekst_upita").value = '';
    }
  });
}

// Funkcija za prikazivanje bannera
function prikaziBanner(tekst) {
  // Kreiranje elementa za banner
  var banner = document.createElement("div");
  banner.className = "banner";
  banner.innerHTML = tekst;

  // Dodavanje bannera u telo dokumenta
  document.body.appendChild(banner);

  // Postavljanje timeout-a za sklanjanje bannera nakon nekog vremena
  setTimeout(function() {
    banner.style.display = "none";
  }, 3000); // Banner će se sakriti nakon 3 sekunde (možete prilagoditi ovo vreme)
}
