// Variables globales
let currentEmployee = null;
let timeEntries = {};

// Chargement des données au démarrage
window.addEventListener('load', function() {
    const savedEntries = localStorage.getItem('timeEntries');
    if (savedEntries) {
        timeEntries = JSON.parse(savedEntries);
    }
});

// Gestionnaire pour le bouton Nouvel Employé
document.getElementById('newEmployeeBtn').addEventListener('click', function() {
    const name = prompt('Nom de l\'employé :');
    if (name) {
        currentEmployee = name;
        document.getElementById('employeeHeader').textContent = `Employé : ${name}`;
        document.getElementById('loginPage').classList.remove('active');
        document.getElementById('timesheetPage').classList.add('active');
        resetForm();
        updateResults();
    }
});

// Gestionnaire pour le bouton Charger Employé
document.getElementById('loadEmployeeBtn').addEventListener('click', function() {
    const employees = Object.keys(timeEntries);
    if (employees.length === 0) {
        alert('Aucun employé enregistré');
        return;
    }

    const name = prompt('Nom de l\'employé :\n\nEmployés existants :\n' + employees.join('\n'));
    if (name && timeEntries[name]) {
        currentEmployee = name;
        document.getElementById('employeeHeader').textContent = `Employé : ${name}`;
        document.getElementById('loginPage').classList.remove('active');
        document.getElementById('timesheetPage').classList.add('active');
        resetForm();
        updateResults();
    } else if (name) {
        alert('Employé non trouvé');
    }
});

// Fonction pour calculer les heures travaillées
function calculateHours(startMorning, endMorning, startEvening, endEvening) {
    let totalHours = 0;
    
    // Calcul des heures du matin
    if (startMorning && endMorning) {
        const startM = new Date(`2000-01-01T${startMorning}`);
        const endM = new Date(`2000-01-01T${endMorning}`);
        totalHours += (endM - startM) / (1000 * 60 * 60);
    }
    
    // Calcul des heures du soir
    if (startEvening && endEvening) {
        const startE = new Date(`2000-01-01T${startEvening}`);
        const endE = new Date(`2000-01-01T${endEvening}`);
        totalHours += (endE - startE) / (1000 * 60 * 60);
    }
    
    return Math.round(totalHours * 100) / 100;
}

// Gestionnaire pour le bouton Enregistrer
document.getElementById('saveBtn').addEventListener('click', function() {
    if (!currentEmployee) {
        alert('Veuillez d\'abord sélectionner un employé');
        return;
    }

    const date = document.getElementById('dateInput').value;
    const startMorning = document.getElementById('startTimeMorning').value;
    const endMorning = document.getElementById('endTimeMorning').value;
    const startEvening = document.getElementById('startTimeEvening').value;
    const endEvening = document.getElementById('endTimeEvening').value;
    const absenceType = document.getElementById('absenceType').value;

    // Validation
    if (!date) {
        alert('Veuillez sélectionner une date');
        return;
    }

    if ((startMorning && !endMorning) || (!startMorning && endMorning) ||
        (startEvening && !endEvening) || (!startEvening && endEvening)) {
        alert('Veuillez remplir les heures de début ET de fin pour chaque période');
        return;
    }

    // Calcul des heures travaillées
    const hoursWorked = calculateHours(startMorning, endMorning, startEvening, endEvening);

    // Sauvegarde des données
    if (!timeEntries[currentEmployee]) {
        timeEntries[currentEmployee] = {};
    }

    timeEntries[currentEmployee][date] = {
        morningStart: startMorning,
        morningEnd: endMorning,
        eveningStart: startEvening,
        eveningEnd: endEvening,
        hours: hoursWorked,
        absenceType: absenceType
    };

    localStorage.setItem('timeEntries', JSON.stringify(timeEntries));
    updateResults();
    resetForm();
    alert('Heures enregistrées avec succès');
});

// Fonction de mise à jour des résultats
function updateResults() {
    if (!currentEmployee || !timeEntries[currentEmployee]) return;

    let totalHours = 0;
    let totalCP = 0;
    let totalCSS = 0;
    let totalM = 0;
    let totalF = 0;

    Object.values(timeEntries[currentEmployee]).forEach(entry => {
        if (entry.absenceType) {
            switch (entry.absenceType) {
                case 'CP': totalCP++; break;
                case 'CSS': totalCSS++; break;
                case 'M': totalM++; break;
                case 'F': totalF++; break;
            }
        } else {
            totalHours += entry.hours;
        }
    });

    // Mise à jour de l'affichage
    document.getElementById('totalHours').textContent = totalHours.toFixed(2);
    document.getElementById('totalCP').textContent = totalCP;
    document.getElementById('totalCSS').textContent = totalCSS;
    document.getElementById('totalM').textContent = totalM;
    document.getElementById('totalF').textContent = totalF;
    
    // Calcul du salaire (exemple : 12€/heure)
    const salary = totalHours * 12;
    document.getElementById('salary').textContent = salary.toFixed(2);
}

// Fonction de réinitialisation du formulaire
function resetForm() {
    document.getElementById('dateInput').value = '';
    document.getElementById('startTimeMorning').value = '';
    document.getElementById('endTimeMorning').value = '';
    document.getElementById('startTimeEvening').value = '';
    document.getElementById('endTimeEvening').value = '';
    document.getElementById('absenceType').value = '';
}

// Gestionnaire pour les onglets
document.querySelectorAll('.tab-btn').forEach(button => {
    button.addEventListener('click', function() {
        const tabId = this.dataset.tab;
        
        // Mise à jour des boutons
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        
        // Mise à jour des contenus
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        document.getElementById(tabId + 'Tab').classList.add('active');
    });
});

// Gestionnaire pour le bouton Supprimer l'employé
document.getElementById('deleteEmployeeBtn').addEventListener('click', function() {
    if (!currentEmployee) {
        alert('Aucun employé sélectionné');
        return;
    }

    if (confirm(`Êtes-vous sûr de vouloir supprimer l'employé ${currentEmployee} et toutes ses données ?`)) {
        delete timeEntries[currentEmployee];
        localStorage.setItem('timeEntries', JSON.stringify(timeEntries));
        
        // Retour à la page d'accueil
        document.getElementById('timesheetPage').classList.remove('active');
        document.getElementById('loginPage').classList.add('active');
        currentEmployee = null;
        
        alert('Employé supprimé avec succès');
    }
});
