let SpisakNekretnina = function () {
    //Dodajem dva privatna atributa 
    let listaNekretnina = [];
    let listaKorisnika = [];
  
    // Metoda za inicijalizaciju 
    let init = function (listaNekretnina_1, listaKorisnika_1) {
      listaNekretnina = listaNekretnina_1;
      listaKorisnika = listaKorisnika_1;
    };
    
  
    // Vršim filtriranje nekretnina 
    let filtrirajNekretnine = function (kriterij) {
      return listaNekretnina.filter(nekretnina => {
        // Filtriranje prema kriteriju
        if (kriterij.min_kvadratura && nekretnina.kvadratura < kriterij.min_kvadratura) {
          return false;
        }
        if (kriterij.max_kvadratura && nekretnina.kvadratura > kriterij.max_kvadratura) {
          return false;
        }
        if (kriterij.min_cijena && nekretnina.cijena < kriterij.min_cijena) {
          return false;
        }
        if (kriterij.max_cijena && nekretnina.cijena > kriterij.max_cijena) {
          return false;
        }
        if (kriterij.tip_nekretnine && nekretnina.tip_nekretnine !== kriterij.tip_nekretnine) {
          return false;
        }
        return true;
      });
    };
  
    // Metoda za učitavanje detalja nekretnine na osnovu ID-a
    let ucitajDetaljeNekretnine = function (id) {
      return listaNekretnina.find(nekretnina => nekretnina.id === id) || null;
    };

    
  
    // Povrat objekta s javnim metodama
    return {
      init: init,
      filtrirajNekretnine: filtrirajNekretnine,
      ucitajDetaljeNekretnine: ucitajDetaljeNekretnine
    };
  };
  


  

  