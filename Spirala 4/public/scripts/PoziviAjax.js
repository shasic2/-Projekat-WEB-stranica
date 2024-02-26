const PoziviAjax = (() => {
  // fnCallback se u svim metodama poziva kada stigne
  // odgovor sa servera putem Ajax-a
  // svaki callback kao parametre ima error i data,
  // error je null ako je status 200 i data je tijelo odgovora


  // ako postoji greška, poruka se prosljeđuje u error parametru
  // callback-a, a data je tada null




// funkcija za dohvaćanje podataka o korisniku
function impl_getKorisnik(fnCallback) {
  var ajax = new XMLHttpRequest();
  ajax.open("GET", "/korisnik");
  ajax.setRequestHeader("Content-Type", "application/json");

  ajax.onreadystatechange = function() {
    if (ajax.readyState === 4) {
      if (ajax.status === 200) {
        fnCallback(null, JSON.parse(ajax.responseText));
      } else if (ajax.status === 401) {
        fnCallback({ greska: 'Neautorizovan pristup' }, null);
      } else if (ajax.status === 404) {
        fnCallback({ greska: 'Korisnik nije pronađen' }, null);
      } else {
        fnCallback({ greska: 'Greška prilikom dohvaćanja podataka korisnika' }, null);
      }
    }
  };
  
  ajax.onerror = function() {
    fnCallback({ greska: 'Greška prilikom slanja zahtjeva' }, null);
  };

  ajax.send();
}


// ažurira podatke loginovanog korisnika
function impl_putKorisnik(noviPodaci, fnCallback) {
  var ajax = new XMLHttpRequest();
  ajax.open("PUT", "/korisnik");
  ajax.setRequestHeader("Content-Type", "application/json");
  
  ajax.onreadystatechange = function() {
    if (ajax.readyState === 4) {
      if (ajax.status === 200) {
        fnCallback(null, JSON.parse(ajax.responseText));
      } else if (ajax.status === 401) {
        fnCallback({ greska: 'Neautorizovan pristup' }, null);
      } else {
        fnCallback({ greska: 'Greška prilikom ažuriranja podataka korisnika' }, null);
      }
    }
  };
  
  ajax.onerror = function() {
    fnCallback({ greska: 'Greška prilikom slanja zahtjeva' }, null);
  };

  ajax.send(JSON.stringify(noviPodaci));
}


// U funkciji PoziviAjax.js
function impl_postUpit(nekretnina_id, tekst_upita, fnCallback) {
  var ajax = new XMLHttpRequest();
  ajax.open("POST", "/upit");
  ajax.setRequestHeader("Content-Type", "application/json");

  // Dobijanje korisničkog ID-a iz servera
  PoziviAjax.getKorisnik((error, data) => {
    if (error) {
      fnCallback(error, null);
    } else {
      const korisnik_id = data.id;

      const requestData = {
        korisnik_id: korisnik_id,
        tekst_upita: tekst_upita
      };

      ajax.onreadystatechange = function () {
        if (ajax.readyState === 4) {
          if (ajax.status === 200) {
            fnCallback(null, JSON.parse(ajax.responseText));
          } else if (ajax.status === 401) {
            fnCallback({ greska: 'Neautorizovan pristup' }, null);
          } else if (ajax.status === 400) {
            fnCallback({ greska: `Nekretnina sa id-em ${nekretnina_id} ne postoji` }, null);
          } else {
            fnCallback({ greska: 'Greška prilikom dodavanja upita' }, null);
          }
        }
      };

      ajax.onerror = function () {
        fnCallback({ greska: 'Greška prilikom slanja zahtjeva' }, null);
      };

      ajax.send(JSON.stringify(requestData));
    }
  });
}






  function impl_getNekretnine(fnCallback) {
      var ajax = new XMLHttpRequest();
      ajax.open("GET", "/nekretnine");
      ajax.setRequestHeader("Content-Type", "application/json");
      ajax.send();
      
    
      ajax.onreadystatechange = function() {
        if (ajax.status === 200 && ajax.readyState === 4) {
          fnCallback(null, JSON.parse(ajax.responseText));
        } else if (ajax.readyState === 4) {
          fnCallback(ajax.statusText, null);
        }
      };
  }





  function impl_getNekretnine(fnCallback) {
      var ajax = new XMLHttpRequest();
      ajax.open("GET", "/nekretnine");
      ajax.setRequestHeader("Content-Type", "application/json");
      ajax.send();
      
    
      ajax.onreadystatechange = function() {
        if (ajax.status === 200 && ajax.readyState === 4) {
          fnCallback(null, JSON.parse(ajax.responseText));
        } else if (ajax.readyState === 4) {
          fnCallback(ajax.statusText, null);
        }
      };
  }


  function impl_postLogin(username,password,fnCallback){
      var ajax = new XMLHttpRequest();
      ajax.open("POST", "/login");
      ajax.setRequestHeader("Content-Type", "application/json");
      ajax.send(JSON.stringify({username:username,password:password}));
      ajax.onreadystatechange = function() {
          if (ajax.status == 200 && ajax.readyState == 4){
              fnCallback(null, ajax.responseText);
          }
          else if (ajax.readyState == 4){
              fnCallback(ajax.statusText,null);
          }
      }
  }


  function impl_postLogout(fnCallback){
      var ajax = new XMLHttpRequest();
      ajax.open("POST", "/logout");
      ajax.onload = function() {
          if (ajax.status == 200 && ajax.readyState == 4){
              fnCallback();
          }
          else if (ajax.readyState == 4){
              fnCallback(ajax.statusText,null);
          }
      }
      ajax.send();
  }



  function impl_getNekretninaById(nekretnina_id, fnCallback) {
    var ajax = new XMLHttpRequest();
    ajax.open("GET", `/nekretnina/${nekretnina_id}`);
    ajax.setRequestHeader("Content-Type", "application/json");
  
    ajax.onreadystatechange = function() {
      if (ajax.status === 200 && ajax.readyState === 4) {
        fnCallback(null, JSON.parse(ajax.responseText));
      } else if (ajax.status === 400 && ajax.readyState === 4) {
        fnCallback({ greska: `Nekretnina sa id-em ${nekretnina_id} ne postoji` }, null);
      } else if (ajax.readyState === 4) {
        fnCallback({ greska: 'Greška prilikom dohvaćanja podataka o nekretnini' }, null);
      }
    };
  
    ajax.onerror = function() {
      fnCallback({ greska: 'Greška prilikom slanja zahtjeva' }, null);
    };
  
    ajax.send();
  }
  




  return {
  postLogin: impl_postLogin,
  postLogout: impl_postLogout,
  getKorisnik: impl_getKorisnik,
  putKorisnik: impl_putKorisnik,
  postUpit: impl_postUpit,
  getNekretnine: impl_getNekretnine,
  getNekretninaById: impl_getNekretninaById
  };
  })();
  