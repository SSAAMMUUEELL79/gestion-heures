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
// Modifier la fonction loadContent existante
function loadContent(section) {
    const mainContent = document.querySelector('.dashboard-content');
    
    switch(section) {
        case 'employees':
            loadEmployeesSection(mainContent);
            break;
        case 'dashboard':
            // Recharger le tableau de bord
            mainContent.innerHTML = getDashboardHTML();
            loadDashboardData();
            break;
        // Les autres sections seront ajoutées plus tard
    }
}

// Ajouter cette nouvelle fonction
function loadEmployeesSection(container) {
    container.innerHTML = `
        <div class="section-header">
            <h1>Gestion des Employés</h1>
            <button class="btn-primary" id="addEmployeeBtn">
                <span class="icon">➕</span> Ajouter un employé
            </button>
        </div>

        <div class="employee-filters">
            <div class="search-box">
                <input type="text" id="employeeSearch" placeholder="Rechercher un employé...">
            </div>
            <div class="filter-options">
                <select id="departmentFilter">
                    <option value="">Tous les départements</option>
                    <option value="rh">Ressources Humaines</option>
                    <option value="tech">Technique</option>
                    <option value="admin">Administration</option>
                </select>
                <select id="statusFilter">
                    <option value="">Tous les statuts</option>
                    <option value="active">Actif</option>
                    <option value="inactive">Inactif</option>
                </select>
            </div>
        </div>

        <div class="employees-grid">
            <!-- Les employés seront chargés ici dynamiquement -->
        </div>

        <!-- Modal pour ajouter/éditer un employé -->
        <div class="modal" id="employeeModal">
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h2>Ajouter un employé</h2>
                <form id="employeeForm">
                    <div class="form-group">
                        <label>Nom</label>
                        <input type="text" name="lastName" required>
                    </div>
                    <div class="form-group">
                        <label>Prénom</label>
                        <input type="text" name="firstName" required>
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" name="email" required>
                    </div>
                    <div class="form-group">
                        <label>Département</label>
                        <select name="department" required>
                            <option value="rh">Ressources Humaines</option>
                            <option value="tech">Technique</option>
                            <option value="admin">Administration</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Date d'embauche</label>
                        <input type="date" name="hireDate" required>
                    </div>
                    <div class="form-buttons">
                        <button type="button" class="btn-secondary" id="cancelEmployee">Annuler</button>
                        <button type="submit" class="btn-primary">Enregistrer</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    // Charger les données des employés
    loadEmployeeData();
    
    // Mettre en place les gestionnaires d'événements
    setupEmployeeEventListeners();
}

// Ajouter ces nouvelles fonctions
function loadEmployeeData() {
    // Simulation de données d'employés (à remplacer par un appel API)
    const mockEmployees = [
        {
            id: 1,
            firstName: 'Jean',
            lastName: 'Dupont',
            email: 'jean.dupont@example.com',
            department: 'tech',
            status: 'active',
            hireDate: '2022-03-15'
        },
        // Ajoutez d'autres employés ici
    ];

    const employeesGrid = document.querySelector('.employees-grid');
    employeesGrid.innerHTML = mockEmployees.map(employee => `
        <div class="employee-card" data-id="${employee.id}">
            <div class="employee-avatar">
                ${employee.firstName[0]}${employee.lastName[0]}
            </div>
            <div class="employee-info">
                <h3>${employee.firstName} ${employee.lastName}</h3>
                <p>${employee.email}</p>
                <p class="department">${getDepartmentLabel(employee.department)}</p>
                <span class="status-badge ${employee.status}">${employee.status}</span>
            </div>
            <div class="employee-actions">
                <button class="btn-icon edit-employee" title="Modifier">✏️</button>
                <button class="btn-icon delete-employee" title="Supprimer">🗑️</button>
            </div>
        </div>
    `).join('');
}

function setupEmployeeEventListeners() {
    const modal = document.getElementById('employeeModal');
    const addBtn = document.getElementById('addEmployeeBtn');
    const closeBtn = document.querySelector('.close-modal');
    const cancelBtn = document.getElementById('cancelEmployee');
    const searchInput = document.getElementById('employeeSearch');
    const departmentFilter = document.getElementById('departmentFilter');
    const statusFilter = document.getElementById('statusFilter');
    const employeeForm = document.getElementById('employeeForm');

    // Ouvrir le modal pour ajouter
    addBtn.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    // Fermer le modal
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    cancelBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Gérer la soumission du formulaire
    employeeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Ajouter la logique de sauvegarde ici
        modal.style.display = 'none';
    });

    // Filtrage en temps réel
    searchInput.addEventListener('input', filterEmployees);
    departmentFilter.addEventListener('change', filterEmployees);
    statusFilter.addEventListener('change', filterEmployees);
}

function filterEmployees() {
    // Implémenter la logique de filtrage ici
}

function getDepartmentLabel(dept) {
    const labels = {
        rh: 'Ressources Humaines',
        tech: 'Technique',
        admin: 'Administration'
    };
    return labels[dept] || dept;
}
// Dans la fonction loadContent, ajoutez le case pour le pointage
function loadContent(section) {
    const mainContent = document.querySelector('.dashboard-content');
    
    switch(section) {
        case 'time':
            loadTimeTrackingSection(mainContent);
            break;
        // ... autres cases existants ...
    }
}

function loadTimeTrackingSection(container) {
    container.innerHTML = `
        <div class="section-header">
            <h1>Pointage</h1>
            <div class="header-actions">
                <button class="btn-primary" id="quickPunchBtn">
                    Pointage rapide
                </button>
            </div>
        </div>

        <div class="time-tracking-container">
            <div class="time-tracking-cards">
                <!-- Carte de pointage du jour -->
                <div class="today-card">
                    <h2>Aujourd'hui</h2>
                    <div class="current-time" id="currentTime">--:--:--</div>
                    <div class="punch-status" id="punchStatus">Non pointé</div>
                    <div class="punch-buttons">
                        <button class="btn-success" id="punchInBtn">Pointer l'entrée</button>
                        <button class="btn-warning" id="punchOutBtn" disabled>Pointer la sortie</button>
                    </div>
                    <div class="today-summary">
                        <div class="time-detail">
                            <span>Entrée:</span>
                            <span id="todayPunchIn">--:--</span>
                        </div>
                        <div class="time-detail">
                            <span>Sortie:</span>
                            <span id="todayPunchOut">--:--</span>
                        </div>
                        <div class="time-detail">
                            <span>Total:</span>
                            <span id="todayTotal">0h 0min</span>
                        </div>
                    </div>
                </div>

                <!-- Résumé hebdomadaire -->
                <div class="weekly-summary-card">
                    <h2>Résumé de la semaine</h2>
                    <div class="week-progress">
                        <div class="progress-bar">
                            <div class="progress" style="width: 60%"></div>
                        </div>
                        <div class="progress-labels">
                            <span>24h / 40h</span>
                        </div>
                    </div>
                    <div class="week-details" id="weekDetails">
                        <!-- Les détails seront ajoutés dynamiquement -->
                    </div>
                </div>
            </div>

            <!-- Historique des pointages -->
            <div class="time-tracking-history">
                <h2>Historique des pointages</h2>
                <div class="history-filters">
                    <input type="month" id="historyMonth">
                    <button class="btn-secondary" id="exportTimeBtn">Exporter</button>
                </div>
                <div class="history-table-container">
                    <table class="history-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Entrée</th>
                                <th>Sortie</th>
                                <th>Total</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody id="timeHistoryBody">
                            <!-- L'historique sera ajouté dynamiquement -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;

    setupTimeTrackingEvents();
    startClock();
    loadTimeHistory();
    updateWeekSummary();
}

function setupTimeTrackingEvents() {
    const punchInBtn = document.getElementById('punchInBtn');
    const punchOutBtn = document.getElementById('punchOutBtn');
    const quickPunchBtn = document.getElementById('quickPunchBtn');
    const historyMonth = document.getElementById('historyMonth');
    const exportTimeBtn = document.getElementById('exportTimeBtn');

    punchInBtn.addEventListener('click', () => handlePunchIn());
    punchOutBtn.addEventListener('click', () => handlePunchOut());
    quickPunchBtn.addEventListener('click', () => handleQuickPunch());
    historyMonth.addEventListener('change', () => loadTimeHistory());
    exportTimeBtn.addEventListener('click', () => exportTimeData());
}

function startClock() {
    const updateClock = () => {
        const now = new Date();
        document.getElementById('currentTime').textContent = 
            now.toLocaleTimeString('fr-FR');
    };
    
    updateClock();
    setInterval(updateClock, 1000);
}

function handlePunchIn() {
    const now = new Date();
    document.getElementById('todayPunchIn').textContent = 
        now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    document.getElementById('punchStatus').textContent = 'En service';
    document.getElementById('punchInBtn').disabled = true;
    document.getElementById('punchOutBtn').disabled = false;
}

function handlePunchOut() {
    const now = new Date();
    document.getElementById('todayPunchOut').textContent = 
        now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    document.getElementById('punchStatus').textContent = 'Journée terminée';
    document.getElementById('punchOutBtn').disabled = true;
    calculateDailyTotal();
}

function calculateDailyTotal() {
    // Simulation du calcul des heures
    document.getElementById('todayTotal').textContent = '8h 30min';
}

function loadTimeHistory() {
    const mockHistory = [
        {
            date: '2024-03-18',
            punchIn: '09:00',
            punchOut: '17:30',
            total: '8h 30min',
            status: 'Complet'
        },
        // Ajoutez d'autres entrées d'historique ici
    ];

    const historyBody = document.getElementById('timeHistoryBody');
    historyBody.innerHTML = mockHistory.map(entry => `
        <tr>
            <td>${new Date(entry.date).toLocaleDateString('fr-FR')}</td>
            <td>${entry.punchIn}</td>
            <td>${entry.punchOut}</td>
            <td>${entry.total}</td>
            <td><span class="status-badge">${entry.status}</span></td>
        </tr>
    `).join('');
}

function updateWeekSummary() {
    const weekDetails = document.getElementById('weekDetails');
    const mockWeekData = [
        { day: 'Lundi', hours: '8h 30min' },
        { day: 'Mardi', hours: '8h 15min' },
        { day: 'Mercredi', hours: '7h 45min' },
        { day: 'Jeudi', hours: '8h 00min' },
        { day: 'Vendredi', hours: '0h 00min' }
    ];

    weekDetails.innerHTML = mockWeekData.map(day => `
        <div class="day-summary">
            <span class="day-name">${day.day}</span>
            <span class="day-hours">${day.hours}</span>
        </div>
    `).join('');
}

function exportTimeData() {
    alert('Export des données de pointage en cours...');
    // Implémenter la logique d'export ici
}

