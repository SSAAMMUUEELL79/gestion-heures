// Fonctions de gestion des prestations
function showAddPrestationForm() {
    const modal = document.getElementById('addPrestationModal');
    modal.style.display = 'flex';
}

function closeModal() {
    const modal = document.getElementById('addPrestationModal');
    modal.style.display = 'none';
}

// Fonction de déconnexion
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    window.location.href = 'login.html';
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

// Mise à jour de l'heure en temps réel
function updateCurrentTime() {
    const timeElement = document.getElementById('currentTime');
    if (timeElement) {
        const now = new Date();
        timeElement.textContent = now.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    // Mettre à jour l'heure toutes les secondes
    setInterval(updateCurrentTime, 1000);
    updateCurrentTime();

    // Afficher le nom de l'utilisateur
    const userEmail = localStorage.getItem('userEmail');
    const userName = localStorage.getItem('userName');
    if (userName) {
        document.querySelector('.user-name').textContent = userName;
    } else if (userEmail) {
        document.querySelector('.user-name').textContent = userEmail;
    }

    // Gestionnaire pour le formulaire de prestation
    const prestationForm = document.getElementById('prestationForm');
    if (prestationForm) {
        prestationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Récupérer les valeurs du formulaire
            const prestation = {
                date: document.getElementById('date').value,
                heureDebut: document.getElementById('heureDebut').value,
                heureFin: document.getElementById('heureFin').value,
                type: document.getElementById('type').value,
                description: document.getElementById('description').value
            };

            // Ajouter la prestation à la liste
            addPrestation(prestation);
            
            // Fermer le modal
            closeModal();
            
            // Réinitialiser le formulaire
            prestationForm.reset();
        });
    }
});

// Fonction pour ajouter une prestation
function addPrestation(prestation) {
    const prestationsList = document.getElementById('prestationsList');
    const prestationElement = document.createElement('div');
    prestationElement.className = 'prestation-card';
    prestationElement.innerHTML = `
        <div class="prestation-header">
            <span class="date">${prestation.date}</span>
            <span class="type ${prestation.type}">${prestation.type}</span>
        </div>
        <div class="prestation-body">
            <p class="horaires">
                ${prestation.heureDebut} - ${prestation.heureFin}
            </p>
            <p class="description">${prestation.description}</p>
        </div>
        <div class="prestation-footer">
            <button class="btn-icon" onclick="editPrestation(this)">✏️</button>
            <button class="btn-icon" onclick="deletePrestation(this)">🗑️</button>
        </div>
    `;
    
    prestationsList.appendChild(prestationElement);
}

// Fonctions d'édition et de suppression
function editPrestation(button) {
    const prestationCard = button.closest('.prestation-card');
    // Logique d'édition à implémenter
}

function deletePrestation(button) {
    const prestationCard = button.closest('.prestation-card');
    prestationCard.remove();
}

// Fermer le modal si on clique en dehors
window.onclick = function(event) {
    const modal = document.getElementById('addPrestationModal');
    if (event.target === modal) {
        closeModal();
    }
}
