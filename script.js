// maj des valeurs
document.addEventListener('DOMContentLoaded', function () {
    const revenuInput = document.querySelector('.header-revenu-revenu');
    const confirmerBtn = document.querySelector('.header-revenu-bouton');
    const balanceEuro = document.querySelector('.balance-content-euro');
    const depensesEuro = document.querySelector('.depenses-content-euro');
    const form = document.querySelector('.formulaire-form');
    const historiqueContainer = document.querySelector('.historique-dépenses');
    const nbOperations = document.querySelector('.historique-header-nbOperations');
    const depensesChartCanvas = document.getElementById('depensesChart');

    // Couleurs fixes pour les catégories connues
    const couleursCategories = {
        'Courses': '#FF6B6B',
        'Transport': '#4ECDC4',
        'Divertissement': '#FFE66D',
        'Factures': '#95E1D3',
        'Loyer': '#8888FF',
        'Restaurant': '#F38181',
        'Nourriture': '#A3A3A3'
    };

    // Historique (tableau d'objets)
    let historique = [
        { date: '2026-01-29', categorie: 'Nourriture', montant: 100 }
    ];

    // Revenu courant (modifiable)
    let revenuCourant = 2000;
    // Balance courante (affichée)
    let balanceCourante = revenuCourant;

    // Calcul du total des dépenses
    function majTotalDepenses() {
        const total = historique.reduce((acc, d) => acc + d.montant, 0);
        depensesEuro.textContent = total.toLocaleString('fr-FR', {minimumFractionDigits: 2, maximumFractionDigits: 2}) + '€';
        return total;
    }

    // Met à jour la balance (revenu initial - toutes dépenses)
    function majBalance() {
        // Balance = revenuCourant - total des dépenses
        balanceCourante = revenuCourant - majTotalDepenses();
        balanceEuro.textContent = balanceCourante.toLocaleString('fr-FR', {minimumFractionDigits: 2, maximumFractionDigits: 2}) + '€';
    }

    // Met à jour le diagramme selon l'historique
    let depensesChart = null;
    function majChart() {
        if (depensesChart) depensesChart.destroy();
        // Regrouper les montants par catégorie
        const parCategorie = {};
        historique.forEach(dep => {
            if (!parCategorie[dep.categorie]) parCategorie[dep.categorie] = 0;
            parCategorie[dep.categorie] += dep.montant;
        });
        const labels = Object.keys(parCategorie);
        const montants = Object.values(parCategorie);
        const couleurs = labels.map(cat => couleursCategories[cat] || '#888');
        depensesChart = new Chart(depensesChartCanvas, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [
                    {
                        data: montants,
                        backgroundColor: couleurs,
                        borderColor: '#000',
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

    function majHistorique() {
        historiqueContainer.innerHTML = '';
        historique.forEach(dep => {
            const divDate = document.createElement('div');
            divDate.textContent = dep.date;
            const divCat = document.createElement('div');
            divCat.textContent = dep.categorie;
            const divMontant = document.createElement('div');
            divMontant.textContent = dep.montant.toLocaleString('fr-FR', {minimumFractionDigits: 2, maximumFractionDigits: 2}) + '€';
            const divAction = document.createElement('div');
            const btnSuppr = document.createElement('button');
            btnSuppr.textContent = 'Supprimer';
            btnSuppr.addEventListener('click', function() {
                historique = historique.filter(d => d !== dep);
                majHistorique();
                majTotalDepenses();
                majChart();
                majBalance();
            });
            divAction.appendChild(btnSuppr);
            historiqueContainer.appendChild(divDate);
            historiqueContainer.appendChild(divCat);
            historiqueContainer.appendChild(divMontant);
            historiqueContainer.appendChild(divAction);
        });
        nbOperations.textContent = historique.length + (historique.length > 1 ? ' opérations' : ' opération');
    }

    // Soumission du formulaire de dépense
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const date = form.date.value;
        const montant = parseFloat(form.montant.value);
        const categorie = form.categorie.value;
        if (!date || isNaN(montant) || !categorie) return;
        // Ajout à l'historique
        historique.push({ date, categorie, montant });
        majHistorique();
        majTotalDepenses();
        majChart();
        majBalance();
        form.reset();
    });

    // Initialisation
    majHistorique();
    majTotalDepenses();
    majChart();
    majBalance();

    // Gestion du revenu (balance)
    confirmerBtn.addEventListener('click', function (e) {
        e.preventDefault();
        const revenu = parseFloat(revenuInput.value);
        if (!isNaN(revenu)) {
            revenuCourant = revenu;
            balanceCourante = revenuCourant;
            // On réinitialise la balance à la valeur du revenu, puis on soustrait toutes les dépenses
            majBalance();
        }
    });
});
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
                    borderColor: '#000',
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
