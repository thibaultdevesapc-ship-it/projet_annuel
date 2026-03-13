// Récupérer la date actuelle
const aujourd_hui = new Date();

// Extraire le jour, mois et année
const jour = String(aujourd_hui.getDate()).padStart(2, '0');
let mois = String(aujourd_hui.getMonth() + 1).padStart(2, '0'); // getMonth() retourne 0-11
const annee = aujourd_hui.getFullYear();

// Formater la date
switch (mois) {
    case "01" :
        mois = "Janvier";
        break;
    case "02" :
        mois = "Février";
        break;
    case "03" :
        mois = "Mars";
        break;
    case "04" :
        mois = "Avril";
        break;
    case "05" :
        mois = "Mai";
        break;
    case "06" :
        mois = "Juin";
        break;
    case "07" :
        mois = "Juillet";
        break;
    case "08" :
        mois = "Août";
        break;
    case "09" :
        mois = "Septembre";
        break;
    case "10" :
        mois = "Octobre";
        break;
    case "11" :
        mois = "Novembre";
        break;
    case "12" :
        mois = "Décembre";
        break;
    default:
        console.log("Erreur dans le chargement de la date");
};

const dateFormatee = `${jour} ${mois} ${annee}`;

// Mettre la date dans le h1
const h1 = document.querySelector('.bonjour-date');
h1.textContent = dateFormatee;
