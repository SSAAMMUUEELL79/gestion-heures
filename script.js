document.addEventListener('DOMContentLoaded', () => {
    // Vérification de l'authentification
    checkAuth();

    // Gestion des événements de navigation
    setupNavigation();

    // Chargement des données initiales
    loadDashboardData();

    // Mise en place des notifications
    setupNotifications();
});

// Vérification de l'authentification
function checkAuth() {
    // Simulation de vérification (à remplacer par votre logique d'authentification)
    const isAuthenticated = sessionStorage.getItem('authenticated');
    if (!isAuthenticated) {
        window.location.href = 'index.html';
    }
}

// Configuration de la navigation
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-links a');
    const logoutBtn = document.getElementById('logoutBtn');

    // Gestion des liens de navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Retirer la classe active de tous les liens
            navLinks.forEach(l => l.parentElement.classList.remove('active'));
            
            // Ajouter la classe active au lien cliqué
            link.parentElement.classList.add('active');
            
            // Charger le contenu correspondant
            loadContent(link.getAttribute('href').substring(1));
        });
    });

    // Gestion de la déconnexion
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
    });
}

// Chargement des données du tableau de bord
function loadDashboardData() {
    // Simulation de données (à remplacer par vos appels API)
    const mockData = {
        employeesPresent: '12/15',
        absences: '3',
        hoursWorked: '147h',
        pendingRequests: '5',
        recentActivity: [
            { time: '09:00', event: 'Jean Dupont a pointé son arrivée' },
            { time: '08:45', event: 'Marie Martin a demandé un congé' },
            { time: '08:30', event: 'Pierre Durant est absent aujourd\'hui' }
        ]
    };

    updateDashboardStats(mockData);
    updateRecentActivity(mockData.recentActivity);
}

// Mise à jour des statistiques
function updateDashboardStats(data) {
    document.querySelector('.stat-card:nth-child(1) .stat-number').textContent = data.employeesPresent;
    document.querySelector('.stat-card:nth-child(2) .stat-number').textContent = data.absences;
    document.querySelector('.stat-card:nth-child(3) .stat-number').textContent = data.hoursWorked;
    document.querySelector('.stat-card:nth-child(4) .stat-number').textContent = data.pendingRequests;
}

// Mise à jour de l'activité récente
function updateRecentActivity(activities) {
    const activityList = document.querySelector('.activity-list');
    activityList.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <span class="activity-time">${activity.time}</span>
            <span class="activity-event">${activity.event}</span>
        </div>
    `).join('');
}

// Configuration des notifications
function setupNotifications() {
    const notificationBell = document.querySelector('.notifications');
    
    notificationBell.addEventListener('click', () => {
        showNotifications();
    });

    // Simulation de nouvelle notification
    setTimeout(() => {
        notificationBell.setAttribute('data-count', '3');
        notificationBell.classList.add('has-notifications');
    }, 3000);
}

// Affichage des notifications
function showNotifications() {
    // Création d'une popup de notifications
    const popup = document.createElement('div');
    popup.className = 'notification-popup';
    popup.innerHTML = `
        <h3>Notifications</h3>
        <div class="notification-list">
            <div class="notification-item">Nouvelle demande de congé</div>
            <div class="notification-item">Rappel: Réunion d'équipe à 14h</div>
            <div class="notification-item">Mise à jour du planning</div>
        </div>
    `;
    
    document.body.appendChild(popup);

    // Fermeture au clic en dehors
    document.addEventListener('click', function closePopup(e) {
        if (!popup.contains(e.target)) {
            popup.remove();
            document.removeEventListener('click', closePopup);
        }
    });
}

// Fonction de déconnexion
function logout() {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
        sessionStorage.removeItem('authenticated');
        window.location.href = 'index.html';
    }
}

// Chargement du contenu des différentes sections
function loadContent(section) {
    console.log(`Chargement de la section: ${section}`);
    // À implémenter : chargement du contenu spécifique à chaque section
}
