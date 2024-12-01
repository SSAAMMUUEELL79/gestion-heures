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

// Gestionnaire des prestations
class PrestationManager {
    constructor() {
        this.prestations = JSON.parse(localStorage.getItem('prestations')) || [];
        this.initForm();
        this.displayPrestations();
    }

    initForm() {
        const form = document.getElementById('prestationForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addPrestation();
            });
        }
    }

    addPrestation() {
        const prestation = {
            id: Date.now(),
            date: document.getElementById('date').value,
            heureDebut: document.getElementById('heureDebut').value,
            heureFin: document.getElementById('heureFin').value,
            type: document.getElementById('type').value,
            description: document.getElementById('description').value
        };

        this.prestations.push(prestation);
        localStorage.setItem('prestations', JSON.stringify(this.prestations));
        this.displayPrestations();
        this.closeModal();
        this.showNotification('Prestation ajoutée avec succès');
    }

    displayPrestations() {
        const container = document.getElementById('prestationsList');
        if (!container) return;

        container.innerHTML = '';
        this.prestations.sort((a, b) => new Date(b.date) - new Date(a.date));

        this.prestations.forEach(prestation => {
            const element = this.createPrestationElement(prestation);
            container.appendChild(element);
        });
    }

    createPrestationElement(prestation) {
        const div = document.createElement('div');
        div.className = 'prestation-card';
        div.innerHTML = `
            <div class="prestation-header">
                <span class="date">${this.formatDate(prestation.date)}</span>
                <span class="type type-${prestation.type}">${this.formatType(prestation.type)}</span>
            </div>
            <div class="prestation-body">
                <p class="horaires">${prestation.heureDebut} - ${prestation.heureFin}</p>
                <p class="description">${prestation.description}</p>
            </div>
            <div class="prestation-footer">
                <button class="btn-icon" onclick="prestationManager.editPrestation(${prestation.id})">✏️</button>
                <button class="btn-icon" onclick="prestationManager.deletePrestation(${prestation.id})">🗑️</button>
            </div>
        `;
        return div;
    }

    formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('fr-FR');
    }

    formatType(type) {
        const types = {
            standard: 'Standard',
            urgence: 'Urgence',
            weekend: 'Weekend'
        };
        return types[type] || type;
    }

    editPrestation(id) {
        const prestation = this.prestations.find(p => p.id === id);
        if (!prestation) return;

        document.getElementById('date').value = prestation.date;
        document.getElementById('heureDebut').value = prestation.heureDebut;
        document.getElementById('heureFin').value = prestation.heureFin;
        document.getElementById('type').value = prestation.type;
        document.getElementById('description').value = prestation.description;

        const modal = document.getElementById('addPrestationModal');
        modal.style.display = 'flex';
    }

    deletePrestation(id) {
        if (confirm('Voulez-vous vraiment supprimer cette prestation ?')) {
            this.prestations = this.prestations.filter(p => p.id !== id);
            localStorage.setItem('prestations', JSON.stringify(this.prestations));
            this.displayPrestations();
            this.showNotification('Prestation supprimée');
        }
    }

    closeModal() {
        const modal = document.getElementById('addPrestationModal');
        modal.style.display = 'none';
        document.getElementById('prestationForm').reset();
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialiser le gestionnaire de prestations
const prestationManager = new PrestationManager();
