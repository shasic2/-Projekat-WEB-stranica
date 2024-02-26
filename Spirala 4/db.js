const Sequelize = require("sequelize");
const upit = require("./public/models/upit.js");
const sequelize = new Sequelize(
    'wt24',
    'root',
    'password',
    {
        host: '127.0.0.1',
        dialect: 'mysql'
    }
);

sequelize.authenticate().then(() => {
    console.log('Uspješno povezivanje na bazu !');
}).catch((error) => {
    console.error('Nemoguće se povezati na bazu: ', error);
});

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.Op = Sequelize.Op;
db.models = {};
db.models.Korisnik = require("./public/models/korisnik.js")(sequelize, Sequelize.DataTypes);
db.models.Nekretnina = require("./public/models/nekretnina.js")(sequelize, Sequelize.DataTypes);
db.models.Upit = require("./public/models/upit.js")(sequelize, Sequelize.DataTypes);


db.models.Korisnik.hasMany(db.models.Nekretnina, { as: 'nekretnine' });
db.models.Nekretnina.hasMany(db.models.Upit, { as: 'upiti' });

db.models.Upit.belongsTo(db.models.Nekretnina, { foreignKey: 'nekretninaId' });
db.models.Upit.belongsTo(db.models.Korisnik, { foreignKey: 'korisnik_id' });
db.models.Nekretnina.hasMany(db.models.Upit, { foreignKey: 'nekretninaId' });
db.models.Korisnik.hasMany(db.models.Upit, { foreignKey: 'korisnik_id' });





sequelize.sync().then(
    () => {
         // NAPOMENA: ovaj dio treba zakomentarisati
        
        db.models.Student.bulkCreate(
            [
                { id: 1, ime: "Selma", prezime: "Hasic", username: "username1", password: "$2b$10$P5f6RJ18KBMiJx1bD7lsJOq/1amrcCeLcTp3KidWD2fpUwOHLsER2"  },
                { id: 2, ime: "Neko", prezime: "Nekic", username: "username2", password: "$2b$10$P5f6RJ18KBMiJx1bD7lsJOq/1amrcCeLcTp3KidWD2fpUwOHLsER2"  }
            ]
        )



        db.models.Nekretnina.bulkCreate(
            [
                { id: 1, tip_nekretnine: "Stan", naziv: "Useljiv stan", kvadratura: 58, cijena: 350000 , tip_grijanja: "plin ", lokacija: "Novo Sarajevo", godina_izgradnje: "2019",   datum_objave: "01.10.2023 ", opis: " Prodaje se kompletno i kvalitetno adaptiran četverosoban stan uknjižene površine 73m2 na jedanaestom spratu stambene zgrade u naselju Otoka, ulica Džemala Bijedića"},
                { id: 2, tip_nekretnine: "Stan", naziv: "Useljiv stan", kvadratura: 68, cijena: 307000  , tip_grijanja: "struja ", lokacija: "Centar", godina_izgradnje: "2004",   datum_objave: "20.08.2023 ", opis: "Stan se nalazi na osmom (posljednjem) spratu stambene zgrade - novogradnje sa dva lifta u ulici Branislava Nušića, naselje Dobrinja 5, općina Novi grad. U neposrednoj blizini zgrade nalazi se supermarket, apoteka, caffe, pošta, frizerski salon, biro za zapošljavanje, javni parking, Gimnazija Dobrinja, kao i drugih sadržaja koji su karakteristični za ovo urbano naselje."},
                { id: 3, tip_nekretnine: "Stan", naziv: "Useljiv stan", kvadratura: 66, cijena: 235000  , tip_grijanja: "struja  ", lokacija: "Centar", godina_izgradnje: "2004",   datum_objave: "20.08.2023 ", opis: "Stan je površine 68 m2 i nalazi se na IV spratu stambene zgrade sa liftom a koja ima ukupno X spratova. Po strukturi je četverosoban. Sastoji se iz hodnika, dnevnog boravka sa kuhinjom i trpezarijom i izlazom na manji zatvoreni balkon, tri spavaće sobe i kupatila. Stan je kompletno renoviran 2013. godine, pri čemu su zamjenjene vodovodne i električne instalacije, postavljen nov estrih...."},
                { id: 4, tip_nekretnine: "Stan", naziv: "Useljiv stan", kvadratura: 79, cijena: 350000  , tip_grijanja: "plin ", lokacija: "Novo Sarajevo", godina_izgradnje: "2019",   datum_objave: "01.10.2023 ", opis: "Stan se nalazi na petom spratu luksuzne novogradnje sa dva lifta u općini Istočno Novo Sarajevo, u strogom centru grada, ulica Stefana Nemanje. U neposrednoj blizini zgrade nalazi se Sinsay, caffe bar Contra, Grad Istočno Sarajevo, porezna uprava, općina I.Novo Sarajevo, osnovna škola, supermarket, dom zdravlja, kao i drugi mnogobrojni sadržaji koji su karakteristični za ovu centralnu lokaciju."},
                { id: 5, tip_nekretnine: "Stan", naziv: "Useljiv stan", kvadratura: 70, cijena: 285000  , tip_grijanja: "plin ", lokacija: "Novo Sarajevo", godina_izgradnje: "2019",   datum_objave: "01.10.2023 ", opis: " Prodajem kompletno renoviran, namjesten i opremljen stan na Grbavici. Nalazi se na V spratu u zgradi bez lifta. Izuzetno svijetao i osuncan, Juzno i Sjeverno orijentisan, povrsine 70mkv + 16 mkv terase. Sastoji se od hodnika, kupatila, 2 spavace sobe + sobe gardarobera, kuhinje, trpezarije i dnevnog boravka koji su povezani i otvoreni. Na prostranu terasu se izlazi iz dnevne sobe."},
                
                { id: 6, tip_nekretnine: "Kuca", naziv: "Useljiva kuca", kvadratura: 201, cijena: 199000  , tip_grijanja: "struja  ", lokacija: "Centar ", godina_izgradnje: "2006 ",   datum_objave: "20.08.2023", opis: "Ispred i ispod kuće postoji okućnica. Također, ispred kuće se nalaze parking mjesta. Prvi sprat je useljiv, na podu je brodski pod, na prozorima je PVC stolarija, dok je unutrašnja stolarija drvena. Treba napomenuti da je prvi sprat opremljen i klima uređajem kao i kuhinjom."},
                { id: 7, tip_nekretnine: "Stan", naziv: "Useljiva kuca", kvadratura: 170, cijena: 320000  , tip_grijanja: "struja  ", lokacija: "Centar ", godina_izgradnje: "2006 ",   datum_objave: "20.08.2023", opis: " Kucu u opstini stari grad,naselje Mihrivode u ulici Mederese.Kuca je pozicionirana na jako lijepoj i suncanoj lokaciji udaljena svega 7-8 minuta hoda od Bascarsijskog trga.Ukupna povrsina stambenog prostora je cca 90 m2,raspoređenih u dvije etaze.Sastoji se od:Degazmana,ostave,prostranog dnevnog boravka,kuhinje i kupatila dok su na spratu smjestene tri spavace sobe i wc."},
                { id: 8, tip_nekretnine: "Stan", naziv: "Useljiva kuca", kvadratura: 155, cijena: 181500  , tip_grijanja: "struja  ", lokacija: "Centar", godina_izgradnje: "2005 ",   datum_objave: "20.08.2023", opis: "Prodajem kuću na odličnoj lokaciji - naselje Stup II, iza Energoinvesta."},
                { id: 9, tip_nekretnine: "Stan", naziv: "Useljiva kuca", kvadratura: 210, cijena: 515000  , tip_grijanja: "struja  ", lokacija: "Centar", godina_izgradnje: "2006 ",   datum_objave: "20.08.2023", opis: "Kuca ima dva sprata; I sprat - dnevni boravak, trpezarija sa kuhinjom, jedna spavaca soba, kupatilo veliki hodnik i ostava, alarm,ugrađene dvije klime. II sprat - tri sobe, ohodnik veliki , izlaz na terasu iz svih soba, kupatilo , ostava, degazman, ugrađena jedna klima. U sklopu kuce se nalazi garaža, elektronska rolo vrata."},
                { id: 10, tip_nekretnine: "Stan", naziv: "Useljiva kuca", kvadratura: 330, cijena: 179000  , tip_grijanja: "struja  ", lokacija: "Centar", godina_izgradnje: "2006 ",   datum_objave: "20.08.2023", opis: "Na prizemnj etaži se nalazi trosoban stan koga čine – otvoren dnevni boravak sa kuhinjom i trpezarijom, dvije spavaće sobe, kupatilo, hodnik i predulaz. Grijanje je centralno, podno, na pelet. Može se grijati i putem kamin peći na drva. Na podu se nalazi laminat, stolarija je pvc. Na gornju etažu se penje spoljašnjim stepeništem."},
               
                { id: 11, tip_nekretnine: "Poslovni prostor", naziv: "Poslovni prostor", kvadratura: 54, cijena: 250000  , tip_grijanja: "struja  ", lokacija: "Centar", godina_izgradnje: "2006 ",   datum_objave: "20.08.2023", opis: "Zgrada u kojoj je smješten ovaj poslovni prostor čini 6 spratova, zgrada sa liftom i centralnim stubištem, svaki sprat broji 5 stambenih jedinica, potkrovlje 2 stana penthouse karaktera to jest ukupno 27 stanova. Na prizemlju su projektovani poslovni prostori, ispred zgrade parking prostor, Zgrada posjeduje garažna parking mjesta."},
                { id: 12, tip_nekretnine: "Poslovni prostor", naziv: "Poslovni prostor", kvadratura: 160, cijena: 500000  , tip_grijanja: "struja  ", lokacija: "Centar", godina_izgradnje: "2006 ",   datum_objave: "20.08.2023", opis: " Povezano sve sirokim unutrasnjim stepenistem. Veliki parking preko puta prostora sa mikro lokacijom koja je veoma ziva i izvrsno povezana saobracajnom infrastrukturom novom A transferzalom. Sve radnje u okolini veoma dobro rade i cijeli kvart je gusto naseljen. Sve cisto uknjizeno 1/1 u zk. Sve daljnje inf putem.privatnih poruka ili na tel 061 444 492."},
                { id: 13, tip_nekretnine: "Poslovni prostor", naziv: "Poslovni prostor", kvadratura: 80, cijena: 235800  , tip_grijanja: "struja  ", lokacija: "Centar", godina_izgradnje: "2006 ",   datum_objave: "20.08.2023", opis: "Prostor je suh, dobro osvijetljen sa trofaznom strujom i vlastitim prilazom i parkingom. U sklopu ima dvije prostorije sa wc-ima. Iza prostora se nalazi jos jedna prostorija koja moze da posluzi kao magacin ili cak prosirenje vec postojecih prostorija."},
                { id: 14, tip_nekretnine: "Poslovni prostor", naziv: "Poslovni prostor", kvadratura: 65, cijena: 240000  , tip_grijanja: "struja  ", lokacija: "Centar", godina_izgradnje: "2006 ",   datum_objave: "20.08.2023", opis: "Prodaje se atraktivan poslovni prostor u strogom centru grada u Tuzli. Nalazi se u popularnoj tuzlanskoj ulici Kazan mahala, između Turalibegove i Pozorišne ulice. Poslovni prostor je površine 65 m2, a sastoji se od glavne prostorije, predprostora toaleta, dva toaleta i ostave. Velike staklene površine čine ovaj prostor svijetlim i prozračnim."},
                { id: 15, tip_nekretnine: "Poslovni prostor", naziv: "Poslovni prostor", kvadratura: 24, cijena: 69000  , tip_grijanja: "struja  ", lokacija: "Centar", godina_izgradnje: "2006 ",   datum_objave: "20.08.2023 ", opis: " Stanpromet.ba - agencija za nekretnine iz svoje ponude za prodaju izdvaja poslovni višenamjenski prostor na Dobrinji, ulica Ive Andrića. Poslovni prostor površine 24m2 nalazi se u zgradi novije gradnje i pozicioniran je prema glavnoj ulici. Poslovni prostor je namješten kao beauty salon sa predviđenim prostorijama za masažu i solarij."}
               
            ]
            )


             db.models.Upit.bulkCreate(
            [

                
                { id: 1, korisnik_id: 1, tekst_upita: "Koja je orijentacija stana? Dobiva li se dovoljno prirodne svjetlosti tijekom dana?", nekretninaId: 2 },
                { id: 2, korisnik_id: 1, tekst_upita: "Je li stan namješten ili je potrebno opremiti ga vlastitim namještajem?", nekretninaId: 1},
                { id: 3, korisnik_id: 2, tekst_upita: "Kakva je kvaliteta građevinskih materijala i opreme u stanu?", nekretninaId: 3},
                { id: 4, korisnik_id: 4, tekst_upita: "Kakva je kvaliteta građevinskih materijala i opreme u stanu?", nekretninaId: 4},
                { id: 5, korisnik_id: 3, tekst_upita: "Jesu li u blizini javni prijevoz, trgovine, škole ili druge bitne lokacije?", nekretninaId: 5},

                { id: 6, korisnik_id: 4, tekst_upita: "Kakvo je stanje krova i trebam li razmišljati o eventualnim popravcima ili zamjeni?", nekretninaId: 6},
                { id: 7, korisnik_id: 1, tekst_upita: "Jesu li svi potrebni dozvole i dokumentacija za gradnju i adaptaciju dostupni i u redu?", nekretninaId: 7},
                { id: 8, korisnik_id: 2, tekst_upita: "Kolika je prosječna potrošnja energije za ovu kuću? Je li kuća energetski učinkovita?", nekretninaId: 8},
                { id: 9, korisnik_id: 3, tekst_upita: "Kakvo je stanje prozora, vrata i stolarije u kući?", nekretninaId: 9},
                { id: 10, korisnik_id: 4, tekst_upita: "Kakvo je stanje prozora, vrata i stolarije u kući?", nekretninaId: 10},
                 { id: 15, korisnik_id: 2, tekst_upita: "Jesu li sve potrebne dozvole za poslovanje već dobivene?", nekretninaId: 10},
                 { id: 16, korisnik_id: 1, tekst_upita: "Kako je riješeno pitanje parkinga za zaposlenike i klijente?", nekretninaId: 10},
                  { id: 17, korisnik_id: 2, tekst_upita: "Jesu li sve potrebne dozvole za poslovanje već dobivene?", nekretninaId: 11},
                 { id: 18, korisnik_id: 1, tekst_upita: "Je li prostor u skladu s vašim planovima i zahtjevima za poslovanje?", nekretninaId: 12},
                 { id: 19, korisnik_id: 2, tekst_upita: "Postoji li povijest problema s štetnim tvarima kao što su azbest, olovo ili plijesan?", nekretninaId: 13},
                 { id: 20, korisnik_id: 2, tekst_upita: "Jesu li sve potrebne dozvole za poslovanje već dobivene?", nekretninaId: 14},
                 { id: 21, korisnik_id: 2, tekst_upita: "Kakva je sigurnost u okolici? Jesu li bilježene ozbiljnije sigurnosne incidente?", nekretninaId: 15}


                


            ]
        )
      
      
    

        console.log("Uspješno kreirane tabele !");
    }
).catch(
    (error) => {
        console.log("Nemoguće kreirati tabele: " + error);
    }
)


module.exports = db;