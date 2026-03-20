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
const h1 = document.querySelector('.header-bonjour-date');
h1.textContent = dateFormatee;

// ========================================== DIAGRAMME DÉPENSES ==========================================

// Données des dépenses (évolutif - facile à modifier/ajouter)
const depensesData = [
    { categorie: 'Courses', montant: 5000, couleur: '#FF6B6B' },
    { categorie: 'Transport', montant: 120, couleur: '#4ECDC4' },
    { categorie: 'Divertissement', montant: 200, couleur: '#FFE66D' },
    { categorie: 'Factures', montant: 450, couleur: '#95E1D3' },
    { categorie: 'Restaurant', montant: 175, couleur: '#F38181' }
];

// Initialiser le graphique camembert
const ctxChart = document.getElementById('depensesChart');

if (ctxChart) {
    const labels = depensesData.map(d => d.categorie);
    const montants = depensesData.map(d => d.montant);
    const couleurs = depensesData.map(d => d.couleur);

    new Chart(ctxChart, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [
                {
                    data: montants,
                    backgroundColor: couleurs,
                    borderColor: '#fff',
                    borderWidth: 3,
                    padding: 20
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        font: { size: 14, family: "'Inter', sans-serif" },
                        padding: 20,
                        usePointStyle: true,
                        pointStyle: 'circle',
                        generateLabels: function(chart) {
                            const data = chart.data;
                            return data.labels.map((label, i) => ({
                                text: `${label}: ${data.datasets[0].data[i]}€`,
                                fillStyle: data.datasets[0].backgroundColor[i],
                                hidden: false,
                                index: i
                            }));
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const montant = context.parsed;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const pourcentage = ((montant / total) * 100).toFixed(1);
                            return `${montant}€ (${pourcentage}%)`;
                        }
                    }
                }
            }
        }
    });
}
