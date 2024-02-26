const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const session = require("express-session");
const path = require("path");
const app = express();
const bcrypt = require('bcrypt');


let korisnici = require('./data/korisnici.json');

const nekretnineRawData = fs.readFileSync('./data/nekretnine.json', 'utf8');
const nekretnine = JSON.parse(nekretnineRawData);


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

// Varijabla za praćenje trenutnog stanja prijave korisnika
let loggedInUser = null;

// Funkcija za provjeru je li korisnik prijavljen
const isUserLoggedIn = () => {
    return loggedInUser !== null;
  };

// Funkcija za čitanje korisnika iz datoteke
const readUsersFromFile = () => {
try {
  const data = fs.readFileSync(path.join(__dirname, './data/korisnici.json'), 'utf8');
  return JSON.parse(data);
} catch (error) {
  console.error('Error reading users from file:', error);
  return [];
}
};



app.use(express.static(__dirname+ '/public'));
app.use(bodyParser.urlencoded({ extended : true}));


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



// Dodajte ovu rutu iznad svojih postojećih ruta
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






// Rutiranje za login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (validateUserCredentials(username, password)) {
    req.session.username=username;
    loggedInUser = username;
    console.log(`Uspješna prijava: ${username}`);
    res.status(200).json({ poruka: 'Uspješna prijava'});
  } 
  else {
    res.status(401).json({ greska: 'Neuspješna prijava' });
  }
});


// Funkcija za provjeru valjanosti korisničkih podataka
const validateUserCredentials = (username, password) => {
  const users = readUsersFromFile();
  const user = users.find((u) => u.username === username);

  if (user && bcrypt.compareSync(password, user.password)) {
    return true;
  }
  return false;
};



app.get('/nekretnine', (req, res) => {
  try {
    const nekretnineData = fs.readFileSync(path.join(__dirname, 'data/nekretnine.json'), 'utf8');
    const nekretnine = JSON.parse(nekretnineData);
    res.status(200).json(nekretnine);
  } catch (error) {
    console.error('Error reading nekretnine from file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



app.put('/korisnik', (req, res) => {
  if (!isUserLoggedIn()) {
    return res.status(401).json({ greska: 'Neautorizovan pristup' });
  }

  const { ime, prezime, username, password } = req.body;

  try {
    const users = readUsersFromFile();
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
      const hashedPassword = bcrypt.hashSync(password, 10); // Hashiramo password s bcryptom
      currentUserData.password = hashedPassword;
    }

    users[existingUserIndex] = currentUserData;

    fs.writeFileSync(path.join(__dirname, 'data/korisnici.json'), JSON.stringify(users, null, 2));

    return res.status(200).json({ poruka: 'Podaci su uspješno ažurirani' });
  } catch (error) {
    console.error('Error updating user data:', error);
    return res.status(500).json({ greska: 'Internal server error' });
  }
});






app.post('/upit', (req, res) => {
  if (!isUserLoggedIn()) {
    return res.status(401).json({ greska: 'Neautorizovan pristup' });
  }

  const { nekretnina_id, tekst_upita } = req.body;

  try {
    const users = readUsersFromFile();
    const nekretnineData = fs.readFileSync(path.join(__dirname, 'data/nekretnine.json'), 'utf8');
    const nekretnine = JSON.parse(nekretnineData);

    console.log('ID nekretnine iz zahtjeva:', nekretnina_id);

    const selectedNekretnina = nekretnine.find(nekretnina => nekretnina.id === parseInt(nekretnina_id));

    if (!selectedNekretnina) {
      return res.status(400).json({ greska: `Nekretnina sa id-em ${nekretnina_id} ne postoji` });
    }

    const loggedInUserIndex = users.findIndex(user => user.username === loggedInUser);

    if (loggedInUserIndex === -1) {
      return res.status(404).json({ greska: 'Korisnik nije pronađen' });
    }

    const newQuery = {
      korisnik_id: users[loggedInUserIndex].id,
      tekst_upita
    };

    if (!selectedNekretnina.upiti) {
      selectedNekretnina.upiti = [];
    }

    selectedNekretnina.upiti.push(newQuery);

    fs.writeFileSync(path.join(__dirname, 'data/nekretnine.json'), JSON.stringify(nekretnine, null, 2));

    return res.status(200).json({ poruka: 'Upit je uspješno dodan' });
  } catch (error) {
    console.error('Greška prilikom stvaranja upita:', error);
    return res.status(500).json({ greska: 'Greška na serveru' });
  }
});





app.get('/korisnik', (req, res) => {
  if (!isUserLoggedIn()) {
    console.log('Korisnik nije prijavljen');
    return res.status(401).json({ greska: 'Neautorizovan pristup' });
  }

  try {
    const users = readUsersFromFile();
    console.log('Podaci o korisnicima:', users);

    const loggedInUsername = users.find(user => user.username === loggedInUser); // Promijenjeno ime varijable na loggedInUsername
    console.log('Prijavljeni korisnik:', loggedInUsername);

    if (!loggedInUsername) {
      console.log('Korisnik nije pronađen');
      return res.status(404).json({ greska: 'Korisnik nije pronađen' });
    }

    const userData = {
      id: loggedInUsername.id,
      ime: loggedInUsername.ime,
      prezime: loggedInUsername.prezime,
      username: loggedInUsername.username,
      password: loggedInUsername.password,
     // slika: loggedInUsername.slika // Dodajte sliku ako postoji polje za sliku u podacima korisnika
    };

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
  const filteredPropertyIds = req.body.nekretnine; // Dobijanje liste ID-eva filtriranih nekretnina
  res.status(200).send('Filtrirane nekretnine primljene.');
});


app.post('/marketing/nekretnina/:id', (req, res) => {
  const nekretninaId = req.params.id;
  res.send('Kliknuta nekretnina ${nekretninaId} uspješno primljena.');
});



app.listen(3000);

  







