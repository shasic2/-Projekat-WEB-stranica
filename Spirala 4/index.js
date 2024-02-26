const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const session = require("express-session");
const path = require("path");
const app = express();
const bcrypt = require('bcrypt');
const sequelize = require('./db.js');
const db = require('./db.js');
const { where } = require('sequelize');
const { Op } = db;




//const nekretnineRawData = fs.readFileSync('./data/nekretnine.json', 'utf8');
//const nekretnine = JSON.parse(nekretnineRawData);


//za parsiranje ulazih podaataka u obliku JSON-a
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//tajni kljuc koji korsitimo za enkripciju podataka u sesiji 
app.use(session({
  secret: 'neka tajna sifra',
  resave: true,
  saveUninitialized: true
}));


let trenutnaNekretninaId = null;

// Varijabla za praćenje trenutnog stanja prijave korisnika
let loggedInUser = null;

// Funkcija za provjeru je li korisnik prijavljen
const isUserLoggedIn = () => {
  return loggedInUser !== null;
};


// Funkcija za čitanje korisnika iz baze
const readUsersFromDatabase = async () => {
  try {
    const korisnici = await db.models.Korisnik.findAll();
    return korisnici;
  } catch (error) {
    console.error('Greška pri čitanju korisnika iz baze:', error);
    return [];
  }
};







app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/profil.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/html/profil.html'));
})

app.get('/nekretnine.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/html/nekretnine.html'));
})

app.get('/detalji.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/html/detalji.html'));
})


app.get('/prijava.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/html/prijava.html'));
})




app.get('/get-login-status', (req, res) => {
  // Provjerite je li korisnik prijavljen i šaljete odgovarajući odgovor
  const isLoggedIn = isUserLoggedIn();
  res.json({ isLoggedIn });
});



app.get('/meni.html', (req, res) => {
  // Provjerite je li korisnik prijavljen
  if (loggedInUser) {
    res.sendFile(path.join(__dirname, 'public/html/noviMeni.html'));
  } else {
    res.sendFile(path.join(__dirname, 'public/html/meni.html'));
  }
});


//ovo radi
app.post('/login', async (req, res) => {
  var username = req.body.username; //username u req
  var password = req.body.password; //pwd u req
  loggedInUser = username;
  bcrypt.hash(password, 10, function (err, hash) { //ovdje radi hashiranje unesenog pwd
    if (err) {
      throw new Error(err);
    }
  });
  db.models.Korisnik.findOne({
    where: { username: username }
  }).then(
    //ako ga pronadjemo
    async (korisnik) => {
      //provjeravamo pwd za tog username
      await bcrypt.compare(password, korisnik.password, async (err, response) => {
        if (err) {
          console.log(err);
        } else if (response) {
          //u sesiju upisujemo podatke pri loginu
          req.session.username = korisnik.username;
          console.log(`Uspješna prijava: ${username}`);
          res.status(200).json({ poruka: 'Uspješna prijava' });
        } else {
          res.status(401).json({ poruka: 'Neuspješna prijava' });
          console.log("Passwordi se ne podudraju!");
        }
      });
    }
  ).catch(
    //ako ne pronadjemo
    () => {
      res.status(401).json({ poruka: 'Neuspješna prijava' });
    }
  )
});





// Funkcija za provjeru valjanosti korisničkih podataka
const validateUserCredentials = (username, password) => {
  const users = readUsersFromDatabase();
  const user = users.find((u) => u.username === username);

  if (user && bcrypt.compareSync(password, user.password)) {
    return true;
  }
  return false;
};


app.get('/nekretnine', async (req, res) => {
  try {
    const nekretnina = await db.models.Nekretnina.findAll();
    // console.log('Nekretnine:', nekretnina);
    res.status(200).json(nekretnina);

    return nekretnina;
  } catch (error) {
    console.error('Greška pri čitanju korisnika iz baze:', error);
    return [];
  }
});





app.put('/korisnik', async (req, res) => {


  if (!isUserLoggedIn()) {
    return res.status(401).json({ greska: 'Neautorizovan pristup' });
  }



  const { ime, prezime, username, password } = req.body;

  try {
    const users = await readUsersFromDatabase();

    const existingUserIndex = users.findIndex(user => user.username === loggedInUser);

    if (existingUserIndex === -1) {
      return res.status(404).json({ greska: 'Korisnik nije pronađen' });
    }

    const currentUserData = users[existingUserIndex];

    // Ažuriranje samo poslanih podataka
    if (ime) {
      currentUserData.ime = ime;
    }
    if (prezime) {
      currentUserData.prezime = prezime;
    }
    if (username) {
      currentUserData.username = username;
    }

    if (password) {
      const hashedPassword = bcrypt.hashSync(password, 10);
      currentUserData.password = hashedPassword;
    }

    users[existingUserIndex] = currentUserData;

    // Ažuriranje podataka u bazi
    await db.models.Korisnik.update(
      {
        ime: currentUserData.ime,
        prezime: currentUserData.prezime,
        username: currentUserData.username,
        password: currentUserData.password,
      },
      {
        where: { username: loggedInUser },
      }
    );
    return res.status(200).json({ poruka: 'Podaci su uspješno ažurirani' });
  } catch (error) {
    console.error('Error updating user data:', error);
    return res.status(500).json({ greska: 'Internal server error' });
  }
});




//RADI
app.get('/korisnik', async (req, res) => {
  if (!isUserLoggedIn()) {
    console.log('Korisnik nije prijavljen');
    return res.status(401).json({ greska: 'Neautorizovan pristup' });
  }

  try {
    const loggedInUserFromDb = await db.models.Korisnik.findOne({ where: { username: loggedInUser } });

    if (!loggedInUserFromDb) {
      console.log('Korisnik nije pronađen u bazi');
      return res.status(404).json({ greska: 'Korisnik nije pronađen u bazi' });
    }
    const userData = {
      id: loggedInUserFromDb.id,
      ime: loggedInUserFromDb.ime,
      prezime: loggedInUserFromDb.prezime,
      username: loggedInUserFromDb.username,
      password: loggedInUserFromDb.password,
      // slika: loggedInUserFromDb.slika // Dodajte sliku ako postoji polje za sliku u podacima korisnika
    };

    console.log('Podaci o korisniku:', userData);
    return res.status(200).json(userData);
  } catch (error) {
    console.error('Greška prilikom dohvaćanja podataka korisnika:', error);
    return res.status(500).json({ greska: 'Greška na serveru prilikom dohvaćanja podataka korisnika' });
  }
});




app.post('/logout', (req, res) => {
  // Provjeravamo da li je korisnik prijavljen 
  if (isUserLoggedIn()) {
    // Brisemo informacije iz sesije 
    req.session.username = null;
    loggedInUser = null; // Dodajte ovu liniju
    res.status(200).json({ poruka: 'Uspješno ste se odjavili' });
  } else {
    res.status(401).json({ greska: 'Neautorizovan pristup' });
  }
});




app.post('/marketing/nekretnine', (req, res) => {
  const filteredPropertyIds = req.body.db.Nekretnina; // Dobijanje liste ID-eva filtriranih nekretnina
  res.status(200).send('Filtrirane nekretnine primljene.');
});



app.post('/marketing/nekretnina/:id', (req, res) => {
  const nekretninaId = req.params.id;
  res.send('Kliknuta nekretnina ${nekretninaId} uspješno primljena.');
});




app.get('/nekretnina/:id', async (req, res) => {
  try {
    const nekretninaId = req.params.id;
    trenutnaNekretninaId = nekretninaId;

    const selectedNekretnina = await db.models.Nekretnina.findOne({ where: { id: nekretninaId } });

    if (!selectedNekretnina) {
      console.log(`Nekretnina sa id-em ${nekretninaId} ne postoji`);
      return res.status(400).json({ greska: `Nekretnina sa id-em ${nekretninaId} ne postoji` });
    }

    const nekretninaData = {
      id: selectedNekretnina.id,
      naziv: selectedNekretnina.naziv,
      kvadratura: selectedNekretnina.kvadratura,
      cijena: selectedNekretnina.cijena,
      lokacija: selectedNekretnina.lokacija,
      tip_grijanja: selectedNekretnina.tip_grijanja,
      godinaIzgradnje: selectedNekretnina.godinaIzgradnje,
      opis: selectedNekretnina.opis,
    };

    // Dodajemo upite vezane za nekretninu
    const upitiZaNekretninu = await db.models.Upit.findAll({ where: { nekretninaId: nekretninaId } });
    if (upitiZaNekretninu.length > 0) {
      nekretninaData.upiti = upitiZaNekretninu.map(upit => ({
        korisnik_id: upit.korisnik_id,
        tekst_upita: upit.tekst_upita,
       
      }));
    }

    return res.status(200).json(nekretninaData);
  } catch (error) {
    console.error('Greška prilikom dohvaćanja podataka o nekretnini:', error);
    return res.status(500).json({ greska: 'Greška na serveru prilikom dohvaćanja podataka o nekretnini' });
  }
});




app.post('/upit', async (req, res) => {
  // Provjeravamo je li korisnik prijavljen
  // console.log('da li je prijavljen', isUserLoggedIn());
  if (!isUserLoggedIn()) {
    return res.status(401).json({ greska: 'Neautorizovan pristup' });
  }

  // Dobijamo potrebne podatke iz URL parametra i tela zahteva
  const { korisnik_id, tekst_upita } = req.body; // Dodaj ovu liniju
  // console.log('NEKRETNINE:', trenutnaNekretninaId);

  try {
    // Pronalazimo korisnika koji postavlja upit
    const loggedInUserInstance = await db.models.Korisnik.findOne({
      where: { username: loggedInUser }
    });

    if (!loggedInUserInstance) {
      return res.status(404).json({ greska: 'Korisnik nije pronađen' });
    }

    const loggedInUserId = loggedInUserInstance.id;
    console.log("Korisnikov id:", loggedInUserId);

    // Provjeravamo postoji li nekretnina s navedenim ID-om
    //const selectedNekretnina = await db.models.Nekretnina.findOne({ where: { id: nekretnina_id } });

    if (!trenutnaNekretninaId) {
      return res.status(400).json({ greska: `Nekretnina sa id-em ${trenutnaNekretninaId} ne postoji` });
    }
    const maxUpitId = await db.models.Upit.max('id');

    // Dodajemo upit u niz upita za odabranu nekretninu
    const createdUpit = await db.models.Upit.create({
      id: maxUpitId + 1,
      korisnik_id: loggedInUserId, // Koristite vrednost iz promenljive loggedInUserId
      nekretninaId: trenutnaNekretninaId, // Koristite vrednost iz promenljive trenutnaNekretninaId
      tekst_upita,
    });

    // Povezivanje upita s trenutnom nekretninom
    await createdUpit.setNekretnina(trenutnaNekretninaId);
    // Povezivanje upita s prijavljenim korisnikom
    await createdUpit.setKorisnik(loggedInUserId);


    return res.status(200).json({ poruka: 'Upit je uspješno dodan' });
  } catch (error) {
    console.error('Greška prilikom dodavanja upita:', error);
    return res.status(500).json({ greska: 'Internal server error' });
  }
});









app.listen(3000);