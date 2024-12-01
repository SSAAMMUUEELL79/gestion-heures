// Gestion de la navigation
document.addEventListener('DOMContentLoaded', function() {
    // Gestion des clics sur le menu
    const menuItems = document.querySelectorAll('.sidebar-menu li');
    const pages = document.querySelectorAll('.page-section');

    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            // Retirer la classe active de tous les éléments
            menuItems.forEach(i => i.classList.remove('active'));
            pages.forEach(p => p.classList.remove('active'));

            // Ajouter la classe active à l'élément cliqué
            this.classList.add('active');

            // Afficher la page correspondante
            const pageId = this.getAttribute('data-page') + '-page';
            document.getElementById(pageId).classList.add('active');
        });
    });

    // Bouton d'ajout de prestation
    const addPrestationBtn = document.createElement('button');
    addPrestationBtn.className = 'btn-primary';
    addPrestationBtn.innerHTML = '+ Nouvelle prestation';
    addPrestationBtn.onclick = function() {
        const modal = document.getElementById('addPrestationModal');
        modal.style.display = 'flex';
    };

    // Ajouter le bouton à la page des prestations
    const prestationsPage = document.getElementById('prestations-page');
    if (prestationsPage) {
        prestationsPage.insertBefore(addPrestationBtn, prestationsPage.firstChild);
    }

    // Initialiser l'heure
    updateCurrentTime();
});

// Mise à jour de l'heure
function updateCurrentTime() {
    const timeElement = document.getElementById('currentTime');
    if (timeElement) {
        const now = new Date();
        timeElement.textContent = now.toLocaleTimeString('fr-FR');
        setTimeout(updateCurrentTime, 1000);
    }
}

// Gestion du pointage
function togglePointage() {
    const btnPointage = document.getElementById('btnPointage');
    const statusPointage = document.getElementById('pointageStatus');
    
    if (btnPointage.textContent === 'Pointer l\'entrée') {
        btnPointage.textContent = 'Pointer la sortie';
        btnPointage.classList.remove('btn-success');
        btnPointage.classList.add('btn-warning');
        statusPointage.textContent = 'En cours';
        statusPointage.style.color = '#2196F3';
    } else {
        btnPointage.textContent = 'Pointer l\'entrée';
        btnPointage.classList.remove('btn-warning');
        btnPointage.classList.add('btn-success');
        statusPointage.textContent = 'Terminé';
        statusPointage.style.color = '#4CAF50';
    }
}
// Gestionnaire principal de l'application
class AppManager {
    constructor() {
        this.prestations = JSON.parse(localStorage.getItem('prestations')) || [];
        this.pointages = JSON.parse(localStorage.getItem('pointages')) || [];
        this.settings = JSON.parse(localStorage.getItem('settings')) || this.getDefaultSettings();
        this.initializeApp();
    }

    // Paramètres par défaut
    getDefaultSettings() {
        return {
            tarifHoraire: {
                standard: 25,
                urgence: 35,
                weekend: 40
            },
            horairesTravail: {
                debut: '09:00',
                fin: '17:00',
                pauseDejeuner: 60
            },
            notifications: true,
            theme: 'light'
        };
    }

    // Initialisation de l'application
    initializeApp() {
        this.initDashboard();
        this.initPointage();
        this.initPrestations();
        this.initStatistiques();
        this.initParametres();
        this.updateCurrentTime();
        this.loadUserInfo();
    }

    // Initialisation du dashboard
    initDashboard() {
        this.updateStatistiques();
        this.updateRecentPrestations();
        this.updatePointageStatus();
    }

    // Mise à jour des statistiques
    updateStatistiques() {
        const stats = this.calculateStatistiques();
        document.getElementById('prestationsMois').textContent = stats.prestationsMois;
        document.getElementById('heuresTravaillees').textContent = `${stats.heuresTravaillees}h`;
        document.getElementById('revenusMois').textContent = `${stats.revenusMois.toFixed(2)} €`;
    }

    // Calcul des statistiques
    calculateStatistiques() {
        const now = new Date();
        const debutMois = new Date(now.getFullYear(), now.getMonth(), 1);
        const prestationsMois = this.prestations.filter(p => new Date(p.date) >= debutMois).length;
        
        let heuresTravaillees = 0;
        let revenusMois = 0;

        this.prestations.forEach(p => {
            if (new Date(p.date) >= debutMois) {
                const duree = this.calculateDuree(p.heureDebut, p.heureFin);
                heuresTravaillees += duree;
                revenusMois += duree * this.settings.tarifHoraire[p.type];
            }
        });

        return {
            prestationsMois,
            heuresTravaillees: Math.round(heuresTravaillees * 10) / 10,
            revenusMois
        };
    }

    // Calcul de la durée entre deux heures
    calculateDuree(debut, fin) {
        const [h1, m1] = debut.split(':').map(Number);
        const [h2, m2] = fin.split(':').map(Number);
        return (h2 - h1) + (m2 - m1) / 60;
    }

    // Gestion du pointage
    togglePointage() {
        const btnPointage = document.getElementById('btnPointage');
        const statusPointage = document.getElementById('pointageStatus');
        const now = new Date();
        
        if (btnPointage.textContent === 'Pointer l\'entrée') {
            // Début du pointage
            this.pointages.push({
                debut: now.toISOString(),
                fin: null
            });
            btnPointage.textContent = 'Pointer la sortie';
            btnPointage.classList.remove('btn-success');
            btnPointage.classList.add('btn-warning');
            statusPointage.textContent = 'En cours';
            statusPointage.style.color = '#2196F3';
        } else {
            // Fin du pointage
            const pointageEnCours = this.pointages[this.pointages.length - 1];
            pointageEnCours.fin = now.toISOString();
            btnPointage.textContent = 'Pointer l\'entrée';
            btnPointage.classList.remove('btn-warning');
            btnPointage.classList.add('btn-success');
            statusPointage.textContent = 'Terminé';
            statusPointage.style.color = '#4CAF50';
        }

        localStorage.setItem('pointages', JSON.stringify(this.pointages));
        this.updateStatistiques();
    }
        // Gestion des prestations
    addPrestation(prestation) {
        const prestationsList = document.getElementById('prestationsList');
        const prestationElement = document.createElement('div');
        prestationElement.className = 'prestation-card';

        // Calcul du montant
        const duree = this.calculateDuree(prestation.heureDebut, prestation.heureFin);
        const montant = duree * this.settings.tarifHoraire[prestation.type];

        // Définir le texte du type de prestation
        let typeText;
        let typeClass;
        switch(prestation.type) {
            case 'standard':
                typeText = 'Standard';
                typeClass = 'type-standard';
                break;
            case 'urgence':
                typeText = 'Urgence';
                typeClass = 'type-urgence';
                break;
            case 'weekend':
                typeText = 'Weekend';
                typeClass = 'type-weekend';
                break;
        }

        prestationElement.innerHTML = `
            <div class="prestation-header">
                <span class="date">${this.formatDate(prestation.date)}</span>
                <span class="type ${typeClass}">${typeText}</span>
            </div>
            <div class="prestation-body">
                <p class="horaires">
                    ${prestation.heureDebut} - ${prestation.heureFin}
                    <span class="duree">(${duree.toFixed(1)}h)</span>
                </p>
                <p class="description">${prestation.description}</p>
                <p class="montant">${montant.toFixed(2)} €</p>
            </div>
            <div class="prestation-footer">
                <button class="btn-icon" onclick="app.editPrestation('${prestation.id}')">✏️</button>
                <button class="btn-icon" onclick="app.deletePrestation('${prestation.id}')">🗑️</button>
            </div>
        `;
        
        prestationsList.appendChild(prestationElement);
        
        // Sauvegarder dans localStorage
        this.prestations.push(prestation);
        localStorage.setItem('prestations', JSON.stringify(this.prestations));
        
        // Mettre à jour les statistiques
        this.updateStatistiques();
    }

    // Formatage de la date
    formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    // Édition d'une prestation
    editPrestation(id) {
        const prestation = this.prestations.find(p => p.id === id);
        if (!prestation) return;

        // Remplir le formulaire d'édition
        document.getElementById('date').value = prestation.date;
        document.getElementById('heureDebut').value = prestation.heureDebut;
        document.getElementById('heureFin').value = prestation.heureFin;
        document.getElementById('type').value = prestation.type;
        document.getElementById('description').value = prestation.description;

        // Afficher le modal
        const modal = document.getElementById('addPrestationModal');
        modal.style.display = 'flex';
    }

    // Suppression d'une prestation
    deletePrestation(id) {
        if (confirm('Voulez-vous vraiment supprimer cette prestation ?')) {
            this.prestations = this.prestations.filter(p => p.id !== id);
            localStorage.setItem('prestations', JSON.stringify(this.prestations));
            this.updateStatistiques();
            document.querySelector(`[data-id="${id}"]`).remove();
        }
    }

    // Mise à jour de l'heure en temps réel
    updateCurrentTime() {
        const timeElement = document.getElementById('currentTime');
        if (timeElement) {
            const now = new Date();
            timeElement.textContent = now.toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
        }
        setTimeout(() => this.updateCurrentTime(), 1000);
    }
        // Gestion des paramètres
    initParametres() {
        const settingsForm = document.getElementById('settingsForm');
        if (settingsForm) {
            // Remplir les champs avec les paramètres actuels
            document.getElementById('tarifStandard').value = this.settings.tarifHoraire.standard;
            document.getElementById('tarifUrgence').value = this.settings.tarifHoraire.urgence;
            document.getElementById('tarifWeekend').value = this.settings.tarifHoraire.weekend;
            document.getElementById('horaireDebut').value = this.settings.horairesTravail.debut;
            document.getElementById('horaireFin').value = this.settings.horairesTravail.fin;
            document.getElementById('pauseDejeuner').value = this.settings.horairesTravail.pauseDejeuner;
            document.getElementById('notifications').checked = this.settings.notifications;
            document.getElementById('theme').value = this.settings.theme;

            // Gestionnaire de soumission du formulaire
            settingsForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveSettings();
            });
        }
    }

    // Sauvegarde des paramètres
    saveSettings() {
        this.settings = {
            tarifHoraire: {
                standard: parseFloat(document.getElementById('tarifStandard').value),
                urgence: parseFloat(document.getElementById('tarifUrgence').value),
                weekend: parseFloat(document.getElementById('tarifWeekend').value)
            },
            horairesTravail: {
                debut: document.getElementById('horaireDebut').value,
                fin: document.getElementById('horaireFin').value,
                pauseDejeuner: parseInt(document.getElementById('pauseDejeuner').value)
            },
            notifications: document.getElementById('notifications').checked,
            theme: document.getElementById('theme').value
        };

        localStorage.setItem('settings', JSON.stringify(this.settings));
        this.applyTheme();
        this.showNotification('Paramètres sauvegardés avec succès');
    }

    // Application du thème
    applyTheme() {
        document.body.className = this.settings.theme;
    }

    // Notifications
    showNotification(message) {
        if (this.settings.notifications) {
            const notification = document.createElement('div');
            notification.className = 'notification';
            notification.textContent = message;
            document.body.appendChild(notification);

            setTimeout(() => {
                notification.remove();
            }, 3000);
        }
    }

    // Statistiques avancées
    initStatistiques() {
        const statsContainer = document.getElementById('statsContainer');
        if (statsContainer) {
            this.updateGraphiques();
            this.updateTableauRecap();
        }
    }

    // Mise à jour des graphiques
    updateGraphiques() {
        // Données pour le graphique des prestations par type
        const prestationsParType = {
            standard: 0,
            urgence: 0,
            weekend: 0
        };

        this.prestations.forEach(p => {
            prestationsParType[p.type]++;
        });

        // Ici, vous pouvez ajouter le code pour afficher les graphiques
        // Par exemple avec Chart.js ou une autre bibliothèque
    }

    // Tableau récapitulatif
    updateTableauRecap() {
        const recapContainer = document.getElementById('tableauRecap');
        if (!recapContainer) return;

        const moisActuel = new Date().getMonth();
        let totalHeures = 0;
        let totalMontant = 0;

        this.prestations.forEach(p => {
            if (new Date(p.date).getMonth() === moisActuel) {
                const duree = this.calculateDuree(p.heureDebut, p.heureFin);
                totalHeures += duree;
                totalMontant += duree * this.settings.tarifHoraire[p.type];
            }
        });

        recapContainer.innerHTML = `
            <h3>Récapitulatif du mois</h3>
            <table class="recap-table">
                <tr>
                    <td>Total heures :</td>
                    <td>${totalHeures.toFixed(1)}h</td>
                </tr>
                <tr>
                    <td>Montant total :</td>
                    <td>${totalMontant.toFixed(2)}€</td>
                </tr>
                <tr>
                    <td>Moyenne horaire :</td>
                    <td>${(totalMontant / totalHeures).toFixed(2)}€/h</td>
                </tr>
            </table>
        `;
    }
}

// Initialisation de l'application
const app = new AppManager();

// Gestionnaires d'événements globaux
document.addEventListener('DOMContentLoaded', () => {
    app.initializeApp();
});

// Fermeture des modals en cliquant en dehors
window.onclick = function(event) {
    const modals = document.getElementsByClassName('modal');
    for (let modal of modals) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    }
}
