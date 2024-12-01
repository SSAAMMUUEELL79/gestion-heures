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
// Dans la fonction loadContent, ajoutez le case pour les absences
function loadContent(section) {
    const mainContent = document.querySelector('.dashboard-content');
    
    switch(section) {
        case 'absences':
            loadAbsencesSection(mainContent);
            break;
        // ... autres cases existants ...
    }
}

function loadAbsencesSection(container) {
    container.innerHTML = `
        <div class="section-header">
            <h1>Gestion des Absences</h1>
            <button class="btn-primary" id="newAbsenceBtn">
                <span class="icon">➕</span> Nouvelle demande
            </button>
        </div>

        <div class="absences-container">
            <!-- Résumé des congés -->
            <div class="leave-summary-cards">
                <div class="leave-card">
                    <h3>Congés payés</h3>
                    <div class="leave-balance">
                        <span class="balance-number">15</span>
                        <span class="balance-label">jours restants</span>
                    </div>
                    <div class="leave-progress">
                        <div class="progress-bar">
                            <div class="progress" style="width: 60%"></div>
                        </div>
                        <span>15/25 jours</span>
                    </div>
                </div>

                <div class="leave-card">
                    <h3>RTT</h3>
                    <div class="leave-balance">
                        <span class="balance-number">5</span>
                        <span class="balance-label">jours restants</span>
                    </div>
                    <div class="leave-progress">
                        <div class="progress-bar">
                            <div class="progress" style="width: 40%"></div>
                        </div>
                        <span>5/12 jours</span>
                    </div>
                </div>

                <div class="leave-card">
                    <h3>Maladie</h3>
                    <div class="leave-balance">
                        <span class="balance-number">3</span>
                        <span class="balance-label">jours pris</span>
                    </div>
                </div>
            </div>

            <!-- Calendrier des absences -->
            <div class="absence-calendar">
                <h2>Calendrier des absences</h2>
                <div class="calendar-container" id="absenceCalendar">
                    <!-- Le calendrier sera injecté ici -->
                </div>
            </div>

            <!-- Liste des demandes -->
            <div class="absence-requests">
                <h2>Mes demandes</h2>
                <div class="requests-filters">
                    <select id="statusFilter">
                        <option value="all">Tous les statuts</option>
                        <option value="pending">En attente</option>
                        <option value="approved">Approuvée</option>
                        <option value="rejected">Refusée</option>
                    </select>
                    <select id="typeFilter">
                        <option value="all">Tous les types</option>
                        <option value="paid">Congés payés</option>
                        <option value="rtt">RTT</option>
                        <option value="sick">Maladie</option>
                    </select>
                </div>
                <div class="requests-table-container">
                    <table class="requests-table">
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th>Début</th>
                                <th>Fin</th>
                                <th>Durée</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="requestsTableBody">
                            <!-- Les demandes seront ajoutées ici -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Modal nouvelle demande -->
        <div class="modal" id="absenceModal">
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h2>Nouvelle demande d'absence</h2>
                <form id="absenceForm">
                    <div class="form-group">
                        <label>Type d'absence</label>
                        <select name="type" required>
                            <option value="paid">Congés payés</option>
                            <option value="rtt">RTT</option>
                            <option value="sick">Maladie</option>
                            <option value="other">Autre</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Date de début</label>
                        <input type="date" name="startDate" required>
                    </div>
                    <div class="form-group">
                        <label>Date de fin</label>
                        <input type="date" name="endDate" required>
                    </div>
                    <div class="form-group">
                        <label>Commentaire</label>
                        <textarea name="comment" rows="3"></textarea>
                    </div>
                    <div class="form-buttons">
                        <button type="button" class="btn-secondary" id="cancelAbsence">Annuler</button>
                        <button type="submit" class="btn-primary">Soumettre</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    setupAbsencesEvents();
    loadAbsenceRequests();
    initializeCalendar();
}

function setupAbsencesEvents() {
    const newAbsenceBtn = document.getElementById('newAbsenceBtn');
    const modal = document.getElementById('absenceModal');
    const closeBtn = modal.querySelector('.close-modal');
    const cancelBtn = document.getElementById('cancelAbsence');
    const absenceForm = document.getElementById('absenceForm');
    const statusFilter = document.getElementById('statusFilter');
    const typeFilter = document.getElementById('typeFilter');

    newAbsenceBtn.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    cancelBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    absenceForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleAbsenceSubmit(e.target);
    });

    statusFilter.addEventListener('change', loadAbsenceRequests);
    typeFilter.addEventListener('change', loadAbsenceRequests);
}

function loadAbsenceRequests() {
    // Simulation de données
    const mockRequests = [
        {
            type: 'paid',
            startDate: '2024-03-20',
            endDate: '2024-03-25',
            duration: '5 jours',
            status: 'pending'
        },
        // Ajoutez d'autres demandes ici
    ];

    const tbody = document.getElementById('requestsTableBody');
    tbody.innerHTML = mockRequests.map(request => `
        <tr>
            <td>${getAbsenceTypeLabel(request.type)}</td>
            <td>${formatDate(request.startDate)}</td>
            <td>${formatDate(request.endDate)}</td>
            <td>${request.duration}</td>
            <td><span class="status-badge ${request.status}">${getStatusLabel(request.status)}</span></td>
            <td>
                <button class="btn-icon" title="Voir les détails">👁️</button>
                ${request.status === 'pending' ? `
                    <button class="btn-icon" title="Annuler">❌</button>
                ` : ''}
            </td>
        </tr>
    `).join('');
}

function initializeCalendar() {
    // Implémentez ici la logique du calendrier
    // Vous pouvez utiliser une bibliothèque comme FullCalendar
    const calendar = document.getElementById('absenceCalendar');
    calendar.innerHTML = '<p>Calendrier à implémenter</p>';
}

function handleAbsenceSubmit(form) {
    const formData = new FormData(form);
    // Traitement de la demande
    console.log(Object.fromEntries(formData));
    document.getElementById('absenceModal').style.display = 'none';
}

function getAbsenceTypeLabel(type) {
    const labels = {
        paid: 'Congés payés',
        rtt: 'RTT',
        sick: 'Maladie',
        other: 'Autre'
    };
    return labels[type] || type;
}

function getStatusLabel(status) {
    const labels = {
        pending: 'En attente',
        approved: 'Approuvée',
        rejected: 'Refusée'
    };
    return labels[status] || status;
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('fr-FR');
}
// Dans la fonction loadContent, ajoutez le case pour les documents
function loadContent(section) {
    const mainContent = document.querySelector('.dashboard-content');
    
    switch(section) {
        case 'documents':
            loadDocumentsSection(mainContent);
            break;
        // ... autres cases existants ...
    }
}

function loadDocumentsSection(container) {
    container.innerHTML = `
        <div class="section-header">
            <h1>Documents</h1>
            <div class="header-actions">
                <button class="btn-primary" id="uploadDocBtn">
                    <span class="icon">📤</span> Déposer un document
                </button>
            </div>
        </div>

        <div class="documents-container">
            <!-- Filtres et recherche -->
            <div class="documents-filters">
                <div class="search-box">
                    <input type="text" id="docSearch" placeholder="Rechercher un document...">
                </div>
                <div class="filter-group">
                    <select id="docTypeFilter">
                        <option value="all">Tous les types</option>
                        <option value="payslip">Fiches de paie</option>
                        <option value="contract">Contrats</option>
                        <option value="certificate">Attestations</option>
                        <option value="other">Autres</option>
                    </select>
                    <select id="docDateFilter">
                        <option value="all">Toutes les dates</option>
                        <option value="thisMonth">Ce mois</option>
                        <option value="lastMonth">Mois dernier</option>
                        <option value="thisYear">Cette année</option>
                    </select>
                </div>
            </div>

            <!-- Grille de documents -->
            <div class="documents-grid" id="documentsGrid">
                <!-- Les documents seront chargés ici -->
            </div>

            <!-- Modal d'upload -->
            <div class="modal" id="uploadModal">
                <div class="modal-content">
                    <span class="close-modal">&times;</span>
                    <h2>Déposer un document</h2>
                    <form id="uploadForm">
                        <div class="form-group">
                            <label>Type de document</label>
                            <select name="docType" required>
                                <option value="payslip">Fiche de paie</option>
                                <option value="contract">Contrat</option>
                                <option value="certificate">Attestation</option>
                                <option value="other">Autre</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Titre</label>
                            <input type="text" name="title" required>
                        </div>
                        <div class="form-group">
                            <label>Description</label>
                            <textarea name="description" rows="3"></textarea>
                        </div>
                        <div class="form-group">
                            <label>Fichier</label>
                            <div class="file-upload-zone" id="dropZone">
                                <input type="file" id="fileInput" hidden>
                                <div class="upload-message">
                                    <span class="icon">📄</span>
                                    <p>Glissez votre fichier ici ou cliquez pour sélectionner</p>
                                </div>
                            </div>
                        </div>
                        <div class="form-buttons">
                            <button type="button" class="btn-secondary" id="cancelUpload">Annuler</button>
                            <button type="submit" class="btn-primary">Déposer</button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Modal de prévisualisation -->
            <div class="modal" id="previewModal">
                <div class="modal-content">
                    <span class="close-modal">&times;</span>
                    <div class="document-preview">
                        <h2 id="previewTitle"></h2>
                        <div class="preview-content" id="previewContent">
                            <!-- Le contenu de prévisualisation sera chargé ici -->
                        </div>
                        <div class="preview-actions">
                            <button class="btn-primary" id="downloadBtn">Télécharger</button>
                            <button class="btn-secondary" id="shareBtn">Partager</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    setupDocumentsEvents();
    loadDocuments();
}

function setupDocumentsEvents() {
    const uploadBtn = document.getElementById('uploadDocBtn');
    const uploadModal = document.getElementById('uploadModal');
    const previewModal = document.getElementById('previewModal');
    const closeButtons = document.querySelectorAll('.close-modal');
    const cancelUpload = document.getElementById('cancelUpload');
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const docSearch = document.getElementById('docSearch');
    const docTypeFilter = document.getElementById('docTypeFilter');
    const docDateFilter = document.getElementById('docDateFilter');

    // Gestion du modal d'upload
    uploadBtn.addEventListener('click', () => {
        uploadModal.style.display = 'block';
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            uploadModal.style.display = 'none';
            previewModal.style.display = 'none';
        });
    });

    cancelUpload.addEventListener('click', () => {
        uploadModal.style.display = 'none';
    });

    // Gestion du drag & drop
    dropZone.addEventListener('click', () => {
        fileInput.click();
    });

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        handleFiles(e.dataTransfer.files);
    });

    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });

    // Filtres et recherche
    docSearch.addEventListener('input', filterDocuments);
    docTypeFilter.addEventListener('change', filterDocuments);
    docDateFilter.addEventListener('change', filterDocuments);
}

function loadDocuments() {
    // Simulation de données
    const mockDocuments = [
        {
            id: 1,
            type: 'payslip',
            title: 'Fiche de paie - Mars 2024',
            date: '2024-03-15',
            size: '245 KB',
            status: 'signed'
        },
        // Ajoutez d'autres documents
    ];

    const grid = document.getElementById('documentsGrid');
    grid.innerHTML = mockDocuments.map(doc => `
        <div class="document-card" data-id="${doc.id}">
            <div class="doc-icon">${getDocumentIcon(doc.type)}</div>
            <div class="doc-info">
                <h3>${doc.title}</h3>
                <p class="doc-meta">
                    <span>${formatDate(doc.date)}</span>
                    <span>${doc.size}</span>
                </p>
            </div>
            <div class="doc-actions">
                <button class="btn-icon preview-doc" title="Prévisualiser">👁️</button>
                <button class="btn-icon download-doc" title="Télécharger">⬇️</button>
                <button class="btn-icon share-doc" title="Partager">📤</button>
            </div>
        </div>
    `).join('');

    // Ajouter les événements aux boutons d'action
    setupDocumentActions();
}

function handleFiles(files) {
    // Gérer les fichiers uploadés
    console.log('Fichiers reçus:', files);
    // Implémenter la logique d'upload
}

function filterDocuments() {
    // Implémenter la logique de filtrage
    console.log('Filtrage des documents...');
}

function setupDocumentActions() {
    const previewButtons = document.querySelectorAll('.preview-doc');
    const downloadButtons = document.querySelectorAll('.download-doc');
    const shareButtons = document.querySelectorAll('.share-doc');

    previewButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const docId = e.target.closest('.document-card').dataset.id;
            showDocumentPreview(docId);
        });
    });

    downloadButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const docId = e.target.closest('.document-card').dataset.id;
            downloadDocument(docId);
        });
    });

    shareButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const docId = e.target.closest('.document-card').dataset.id;
            shareDocument(docId);
        });
    });
}

function showDocumentPreview(docId) {
    const previewModal = document.getElementById('previewModal');
    const previewTitle = document.getElementById('previewTitle');
    const previewContent = document.getElementById('previewContent');

    // Simuler le chargement d'un document
    previewTitle.textContent = 'Prévisualisation du document';
    previewContent.innerHTML = '<div class="preview-placeholder">Chargement de la prévisualisation...</div>';
    previewModal.style.display = 'block';
}

function downloadDocument(docId) {
    console.log('Téléchargement du document:', docId);
    // Implémenter la logique de téléchargement
}

function shareDocument(docId) {
    console.log('Partage du document:', docId);
    // Implémenter la logique de partage
}

function getDocumentIcon(type) {
    const icons = {
        payslip: '💰',
        contract: '📄',
        certificate: '🎓',
        other: '📎'
    };
    return icons[type] || '📄';
}
// Ajouter ces nouvelles fonctions
function initializeSignatureSystem() {
    const signatureCanvas = document.createElement('canvas');
    signatureCanvas.id = 'signatureCanvas';
    signatureCanvas.width = 500;
    signatureCanvas.height = 200;
    
    let isDrawing = false;
    let ctx = signatureCanvas.getContext('2d');
    
    // Configuration du canvas
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';

    // Événements de dessin
    signatureCanvas.addEventListener('mousedown', startDrawing);
    signatureCanvas.addEventListener('mousemove', draw);
    signatureCanvas.addEventListener('mouseup', stopDrawing);
    signatureCanvas.addEventListener('mouseout', stopDrawing);

    // Événements tactiles
    signatureCanvas.addEventListener('touchstart', startDrawing);
    signatureCanvas.addEventListener('touchmove', draw);
    signatureCanvas.addEventListener('touchend', stopDrawing);

    function startDrawing(e) {
        isDrawing = true;
        draw(e);
    }

    function draw(e) {
        if (!isDrawing) return;
        
        e.preventDefault();
        const rect = signatureCanvas.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;

        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    }

    function stopDrawing() {
        isDrawing = false;
        ctx.beginPath();
    }

    return signatureCanvas;
}

function showSignatureModal(documentId) {
    const modal = document.createElement('div');
    modal.className = 'modal signature-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2>Signer le document</h2>
            <div class="signature-container">
                <div class="signature-area"></div>
                <div class="signature-actions">
                    <button class="btn-secondary" id="clearSignature">Effacer</button>
                    <button class="btn-primary" id="saveSignature">Signer</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    const signatureArea = modal.querySelector('.signature-area');
    const canvas = initializeSignatureSystem();
    signatureArea.appendChild(canvas);

    const clearBtn = modal.querySelector('#clearSignature');
    const saveBtn = modal.querySelector('#saveSignature');
    const closeBtn = modal.querySelector('.close-modal');

    clearBtn.addEventListener('click', () => {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    saveBtn.addEventListener('click', () => {
        const signatureData = canvas.toDataURL();
        applySignatureToDocument(documentId, signatureData);
        modal.remove();
    });

    closeBtn.addEventListener('click', () => {
        modal.remove();
    });

    modal.style.display = 'block';
}

function applySignatureToDocument(documentId, signatureData) {
    // Simulation d'envoi de la signature au serveur
    console.log(`Signature appliquée au document ${documentId}`);
    
    // Mettre à jour l'interface
    const docCard = document.querySelector(`.document-card[data-id="${documentId}"]`);
    if (docCard) {
        docCard.classList.add('signed');
        const statusBadge = document.createElement('span');
        statusBadge.className = 'status-badge signed';
        statusBadge.textContent = 'Signé';
        docCard.querySelector('.doc-info').appendChild(statusBadge);
    }
}

// Modifier la fonction showDocumentPreview pour inclure la prévisualisation PDF
function showDocumentPreview(docId) {
    const previewModal = document.getElementById('previewModal');
    const previewTitle = document.getElementById('previewTitle');
    const previewContent = document.getElementById('previewContent');

    // Simuler le chargement d'un document
    previewTitle.textContent = 'Prévisualisation du document';
    previewContent.innerHTML = `
        <div class="preview-toolbar">
            <button class="btn-icon" id="zoomIn">🔍+</button>
            <button class="btn-icon" id="zoomOut">🔍-</button>
            <button class="btn-icon" id="rotate">🔄</button>
            <button class="btn-primary" id="signDoc">Signer</button>
        </div>
        <div class="preview-document">
            <iframe src="about:blank" id="pdfViewer"></iframe>
        </div>
    `;

    // Ajouter les événements de la barre d'outils
    const signBtn = previewContent.querySelector('#signDoc');
    signBtn.addEventListener('click', () => {
        showSignatureModal(docId);
    });

    previewModal.style.display = 'block';
}
// Système de validation des signatures
class SignatureValidator {
    constructor() {
        this.certificates = new Map();
    }

    // Générer un certificat numérique simple
    generateCertificate(userId) {
        const certificate = {
            id: crypto.randomUUID(),
            userId: userId,
            createdAt: new Date(),
            validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // Valide 1 an
            publicKey: `KEY-${Math.random().toString(36).substring(7)}`,
        };
        this.certificates.set(certificate.id, certificate);
        return certificate;
    }

    // Valider une signature
    validateSignature(signatureData, certificateId) {
        const certificate = this.certificates.get(certificateId);
        if (!certificate) return false;
        
        const now = new Date();
        if (now > certificate.validUntil) {
            return {
                valid: false,
                reason: 'Certificate expired'
            };
        }

        return {
            valid: true,
            certificate: certificate
        };
    }
}

// Gestionnaire d'historique des signatures
class SignatureHistory {
    constructor() {
        this.history = new Map();
    }

    // Ajouter une nouvelle signature
    addSignature(documentId, userId, signatureData, certificate) {
        const signatureRecord = {
            id: crypto.randomUUID(),
            documentId: documentId,
            userId: userId,
            timestamp: new Date(),
            certificateId: certificate.id,
            signatureData: signatureData
        };

        if (!this.history.has(documentId)) {
            this.history.set(documentId, []);
        }
        this.history.get(documentId).push(signatureRecord);

        this.updateSignatureDisplay(documentId, signatureRecord);
        return signatureRecord;
    }

    // Obtenir l'historique des signatures pour un document
    getDocumentHistory(documentId) {
        return this.history.get(documentId) || [];
    }

    // Mettre à jour l'affichage de l'historique
    updateSignatureDisplay(documentId, signatureRecord) {
        const historyContainer = document.querySelector('.signature-history');
        if (!historyContainer) return;

        const historyEntry = document.createElement('div');
        historyEntry.className = 'history-entry';
        historyEntry.innerHTML = `
            <div class="history-entry-header">
                <span class="timestamp">${signatureRecord.timestamp.toLocaleString()}</span>
                <span class="user-info">Signé par: User-${signatureRecord.userId}</span>
            </div>
            <div class="signature-preview">
                <img src="${signatureRecord.signatureData}" alt="Signature" />
            </div>
            <div class="certificate-info">
                <span class="certificate-id">Certificat: ${signatureRecord.certificateId}</span>
                <button class="btn-icon verify-signature" data-signature-id="${signatureRecord.id}">
                    ✓ Vérifier
                </button>
            </div>
        `;

        historyContainer.insertBefore(historyEntry, historyContainer.firstChild);
    }
}

// Initialiser les systèmes
const signatureValidator = new SignatureValidator();
const signatureHistory = new SignatureHistory();

// Modifier la fonction showSignatureModal pour inclure la validation
function showSignatureModal(documentId) {
    const modal = document.createElement('div');
    modal.className = 'modal signature-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2>Signer le document</h2>
            <div class="signature-container">
                <div class="signature-area"></div>
                <div class="certificate-info">
                    <p>Un certificat numérique sera généré pour cette signature.</p>
                </div>
                <div class="signature-actions">
                    <button class="btn-secondary" id="clearSignature">Effacer</button>
                    <button class="btn-primary" id="saveSignature">Signer avec certificat</button>
                </div>
            </div>
            <div class="signature-history">
                <h3>Historique des signatures</h3>
                <!-- L'historique sera injecté ici -->
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    setupSignatureCanvas(modal, documentId);
    loadSignatureHistory(documentId);
    modal.style.display = 'block';
}

// Fonction pour charger l'historique des signatures
function loadSignatureHistory(documentId) {
    const history = signatureHistory.getDocumentHistory(documentId);
    const container = document.querySelector('.signature-history');
    
    if (history.length === 0) {
        container.innerHTML += '<p>Aucune signature pour ce document</p>';
        return;
    }

    history.forEach(record => {
        signatureHistory.updateSignatureDisplay(documentId, record);
    });
}

// Modifier la fonction applySignatureToDocument
function applySignatureToDocument(documentId, signatureData) {
    const userId = 'USER-123'; // Simulé - à remplacer par l'ID réel de l'utilisateur
    const certificate = signatureValidator.generateCertificate(userId);
    
    const signatureRecord = signatureHistory.addSignature(
        documentId,
        userId,
        signatureData,
        certificate
    );

    // Mettre à jour l'interface
    const docCard = document.querySelector(`.document-card[data-id="${documentId}"]`);
    if (docCard) {
        docCard.classList.add('signed');
        updateDocumentStatus(docCard, signatureRecord);
    }

    // Afficher la confirmation
    showSignatureConfirmation(certificate);
}

// Fonction pour afficher la confirmation de signature
function showSignatureConfirmation(certificate) {
    const confirmation = document.createElement('div');
    confirmation.className = 'signature-confirmation';
    confirmation.innerHTML = `
        <div class="confirmation-content">
            <h3>✓ Document signé avec succès</h3>
            <p>Certificat généré: ${certificate.id}</p>
            <p>Valide jusqu'au: ${certificate.validUntil.toLocaleDateString()}</p>
            <button class="btn-primary" onclick="this.parentElement.remove()">OK</button>
        </div>
    `;
    document.body.appendChild(confirmation);
}
// Gestionnaire de workflow de signature
class SignatureWorkflow {
    constructor() {
        this.workflows = new Map();
        this.currentUser = 'USER-123'; // Simulé
    }

    // Créer un nouveau workflow
    createWorkflow(documentId, signers) {
        const workflow = {
            id: crypto.randomUUID(),
            documentId: documentId,
            status: 'pending',
            createdAt: new Date(),
            signers: signers.map((signer, index) => ({
                userId: signer,
                order: index + 1,
                status: 'pending',
                signedAt: null
            })),
            currentStep: 1
        };

        this.workflows.set(workflow.id, workflow);
        this.notifyNextSigner(workflow);
        return workflow;
    }

    // Mettre à jour le workflow après une signature
    updateWorkflow(workflowId, userId, signatureData) {
        const workflow = this.workflows.get(workflowId);
        if (!workflow) return null;

        const currentSigner = workflow.signers.find(s => 
            s.order === workflow.currentStep && s.userId === userId);

        if (!currentSigner) return null;

        currentSigner.status = 'completed';
        currentSigner.signedAt = new Date();

        workflow.currentStep++;
        
        if (workflow.currentStep > workflow.signers.length) {
            workflow.status = 'completed';
            this.finalizeDocument(workflow.documentId);
        } else {
            this.notifyNextSigner(workflow);
        }

        return workflow;
    }

    // Notifier le prochain signataire
    notifyNextSigner(workflow) {
        const nextSigner = workflow.signers.find(s => s.order === workflow.currentStep);
        if (nextSigner) {
            this.sendSignatureNotification(nextSigner.userId, workflow.documentId);
        }
    }

    // Simuler l'envoi d'une notification
    sendSignatureNotification(userId, documentId) {
        console.log(`Notification envoyée à ${userId} pour le document ${documentId}`);
        this.showNotification(`En attente de signature de ${userId}`);
    }

    // Finaliser le document
    finalizeDocument(documentId) {
        this.generateSignedPDF(documentId);
    }

    // Vérifier si l'utilisateur peut signer
    canUserSign(workflowId, userId) {
        const workflow = this.workflows.get(workflowId);
        if (!workflow) return false;

        const currentSigner = workflow.signers.find(s => 
            s.order === workflow.currentStep && s.userId === userId);

        return !!currentSigner;
    }

    // Afficher une notification dans l'interface
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'workflow-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="close-notification">×</button>
            </div>
        `;

        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 5000);
    }
}

// Gestionnaire d'export PDF
class PDFExporter {
    constructor() {
        this.signaturePositions = new Map();
    }

    // Générer le PDF signé
    async generateSignedPDF(documentId, signatures) {
        try {
            // Simulation de génération PDF
            console.log('Génération du PDF signé...');
            await this.simulateLoading();
            
            const pdfData = {
                documentId: documentId,
                signatures: signatures,
                timestamp: new Date(),
                certificateInfo: 'PDF signé électroniquement'
            };

            this.downloadPDF(pdfData);
            return true;
        } catch (error) {
            console.error('Erreur lors de la génération du PDF:', error);
            return false;
        }
    }

    // Simuler le chargement
    simulateLoading() {
        return new Promise(resolve => setTimeout(resolve, 2000));
    }

    // Télécharger le PDF
    downloadPDF(pdfData) {
        const blob = new Blob([JSON.stringify(pdfData)], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `document_signe_${pdfData.documentId}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
    }
}

// Initialiser les gestionnaires
const workflowManager = new SignatureWorkflow();
const pdfExporter = new PDFExporter();

// Modifier la fonction de signature pour inclure le workflow
function initiateSignatureWorkflow(documentId) {
    const signers = [
        'USER-123',
        'USER-456',
        'USER-789'
    ];

    const workflow = workflowManager.createWorkflow(documentId, signers);
    
    if (workflowManager.canUserSign(workflow.id, workflowManager.currentUser)) {
        showSignatureModal(documentId, workflow.id);
    } else {
        workflowManager.showNotification('Vous n\'êtes pas le signataire actuel');
    }
}

// Modifier la fonction applySignatureToDocument
async function applySignatureToDocument(documentId, signatureData, workflowId) {
    if (workflowId) {
        const workflow = workflowManager.updateWorkflow(
            workflowId, 
            workflowManager.currentUser, 
            signatureData
        );

        if (workflow.status === 'completed') {
            await pdfExporter.generateSignedPDF(documentId, workflow.signers);
        }
    }

    // Mettre à jour l'interface
    updateDocumentStatus(documentId, 'signed');
    showSignatureConfirmation();
}

// Ajouter un bouton d'export dans la prévisualisation
function addExportButton(documentId) {
    const exportBtn = document.createElement('button');
    exportBtn.className = 'btn-primary export-btn';
    exportBtn.innerHTML = '📥 Exporter en PDF';
    exportBtn.onclick = () => pdfExporter.generateSignedPDF(documentId, []);
    
    document.querySelector('.preview-actions').appendChild(exportBtn);
}
// Gestionnaire des prestations
class PrestationManager {
    constructor() {
        this.prestations = [];
        this.tarifHoraire = 25; // Tarif par défaut
    }

    // Ajouter une nouvelle prestation
    ajouterPrestation(prestation) {
        prestation.id = Date.now();
        prestation.montant = this.calculerMontant(prestation);
        this.prestations.push(prestation);
        this.sauvegarderPrestations();
        return prestation;
    }

    // Calculer le montant de la prestation
    calculerMontant(prestation) {
        const heures = this.calculerHeures(prestation.heureDebut, prestation.heureFin);
        return heures * this.tarifHoraire;
    }

    // Calculer le nombre d'heures
    calculerHeures(debut, fin) {
        const [heureDebut, minDebut] = debut.split(':').map(Number);
        const [heureFin, minFin] = fin.split(':').map(Number);
        
        let heures = heureFin - heureDebut;
        let minutes = minFin - minDebut;
        
        if (minutes < 0) {
            heures--;
            minutes += 60;
        }
        
        return heures + (minutes / 60);
    }

    // Sauvegarder dans le localStorage
    sauvegarderPrestations() {
        localStorage.setItem('prestations', JSON.stringify(this.prestations));
    }

    // Charger depuis le localStorage
    chargerPrestations() {
        const saved = localStorage.getItem('prestations');
        this.prestations = saved ? JSON.parse(saved) : [];
    }
}

// Interface utilisateur des prestations
function afficherGestionPrestations() {
    const container = document.querySelector('.dashboard-content');
    container.innerHTML = `
        <div class="section-header">
            <h1>Gestion des Prestations</h1>
            <button class="btn-primary" id="nouvellePrestationBtn">
                Nouvelle Prestation
            </button>
        </div>

        <div class="prestations-container">
            <!-- Formulaire de nouvelle prestation -->
            <div class="prestation-form" style="display: none;">
                <h2>Nouvelle Prestation</h2>
                <form id="prestationForm">
                    <div class="form-group">
                        <label>Date</label>
                        <input type="date" name="date" required>
                    </div>
                    <div class="form-group">
                        <label>Heure de début</label>
                        <input type="time" name="heureDebut" required>
                    </div>
                    <div class="form-group">
                        <label>Heure de fin</label>
                        <input type="time" name="heureFin" required>
                    </div>
                    <div class="form-group">
                        <label>Type de prestation</label>
                        <select name="type" required>
                            <option value="standard">Standard</option>
                            <option value="urgence">Urgence</option>
                            <option value="weekend">Weekend</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Description</label>
                        <textarea name="description" rows="3"></textarea>
                    </div>
                    <div class="form-buttons">
                        <button type="button" class="btn-secondary" id="annulerPrestation">
                            Annuler
                        </button>
                        <button type="submit" class="btn-primary">
                            Enregistrer
                        </button>
                    </div>
                </form>
            </div>

            <!-- Liste des prestations -->
            <div class="prestations-list">
                <h2>Prestations récentes</h2>
                <div class="prestations-grid" id="prestationsGrid">
                    <!-- Les prestations seront ajoutées ici -->
                </div>
            </div>
        </div>
    `;

    initPrestationsEvents();
}
// Ajoutez ces nouvelles méthodes à la classe PrestationManager
class PrestationManager {
    // ... code existant ...

    // Éditer une prestation existante
    editerPrestation(id, nouvelleDonnees) {
        const index = this.prestations.findIndex(p => p.id === id);
        if (index !== -1) {
            nouvelleDonnees.id = id;
            nouvelleDonnees.montant = this.calculerMontant(nouvelleDonnees);
            this.prestations[index] = nouvelleDonnees;
            this.sauvegarderPrestations();
            return true;
        }
        return false;
    }

    // Supprimer une prestation
    supprimerPrestation(id) {
        const index = this.prestations.findIndex(p => p.id === id);
        if (index !== -1) {
            this.prestations.splice(index, 1);
            this.sauvegarderPrestations();
            return true;
        }
        return false;
    }

    // Filtrer les prestations
    filtrerPrestations(filtres) {
        return this.prestations.filter(p => {
            let match = true;
            
            // Filtre par date
            if (filtres.dateDebut && filtres.dateFin) {
                const date = new Date(p.date);
                const debut = new Date(filtres.dateDebut);
                const fin = new Date(filtres.dateFin);
                match = match && (date >= debut && date <= fin);
            }

            // Filtre par type
            if (filtres.type && filtres.type !== 'tous') {
                match = match && p.type === filtres.type;
            }

            // Filtre par montant
            if (filtres.montantMin) {
                match = match && p.montant >= parseFloat(filtres.montantMin);
            }
            if (filtres.montantMax) {
                match = match && p.montant <= parseFloat(filtres.montantMax);
            }

            return match;
        });
    }

    // Exporter les prestations
    exporterPrestations(format = 'excel') {
        const donnees = this.prestations.map(p => ({
            Date: new Date(p.date).toLocaleDateString(),
            'Heure début': p.heureDebut,
            'Heure fin': p.heureFin,
            Type: p.type,
            Description: p.description,
            Montant: `${p.montant.toFixed(2)} €`
        }));

        if (format === 'excel') {
            this.exporterExcel(donnees);
        } else if (format === 'pdf') {
            this.exporterPDF(donnees);
        }
    }

    // Export Excel
    exporterExcel(donnees) {
        let csv = Object.keys(donnees[0]).join(',') + '\n';
        csv += donnees.map(row => Object.values(row).join(',')).join('\n');

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `prestations_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    }

    // Export PDF
    exporterPDF(donnees) {
        // Simulation d'export PDF
        console.log('Export PDF:', donnees);
        alert('Export PDF en cours de développement');
    }
}

// Fonctions d'interface utilisateur pour l'édition
function afficherFormulaireEdition(prestation) {
    const form = document.querySelector('.prestation-form');
    form.innerHTML = `
        <h2>Modifier la prestation</h2>
        <form id="prestationForm" data-id="${prestation.id}">
            <div class="form-group">
                <label>Date</label>
                <input type="date" name="date" value="${prestation.date}" required>
            </div>
            <div class="form-group">
                <label>Heure de début</label>
                <input type="time" name="heureDebut" value="${prestation.heureDebut}" required>
            </div>
            <div class="form-group">
                <label>Heure de fin</label>
                <input type="time" name="heureFin" value="${prestation.heureFin}" required>
            </div>
            <div class="form-group">
                <label>Type de prestation</label>
                <select name="type" required>
                    <option value="standard" ${prestation.type === 'standard' ? 'selected' : ''}>Standard</option>
                    <option value="urgence" ${prestation.type === 'urgence' ? 'selected' : ''}>Urgence</option>
                    <option value="weekend" ${prestation.type === 'weekend' ? 'selected' : ''}>Weekend</option>
                </select>
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea name="description">${prestation.description || ''}</textarea>
            </div>
            <div class="form-buttons">
                <button type="button" class="btn-secondary" onclick="annulerEdition()">Annuler</button>
                <button type="submit" class="btn-primary">Mettre à jour</button>
            </div>
        </form>
    `;
    form.style.display = 'block';
    initFormEvents();
}

// Barre de filtres
function ajouterBarreFiltres() {
    const filtres = document.createElement('div');
    filtres.className = 'prestations-filtres';
    filtres.innerHTML = `
        <div class="filtre-groupe">
            <label>Période</label>
            <input type="date" id="dateDebut" name="dateDebut">
            <input type="date" id="dateFin" name="dateFin">
        </div>
        <div class="filtre-groupe">
            <label>Type</label>
            <select id="typeFiltre">
                <option value="tous">Tous</option>
                <option value="standard">Standard</option>
                <option value="urgence">Urgence</option>
                <option value="weekend">Weekend</option>
            </select>
        </div>
        <div class="filtre-groupe">
            <label>Montant</label>
            <input type="number" id="montantMin" placeholder="Min €">
            <input type="number" id="montantMax" placeholder="Max €">
        </div>
        <div class="filtre-actions">
            <button class="btn-secondary" onclick="reinitialiserFiltres()">Réinitialiser</button>
            <button class="btn-primary" onclick="appliquerFiltres()">Filtrer</button>
        </div>
    `;
    return filtres;
}

// Événements des filtres
function initFiltresEvents() {
    const filtres = document.querySelectorAll('.prestations-filtres input, .prestations-filtres select');
    filtres.forEach(filtre => {
        filtre.addEventListener('change', appliquerFiltres);
    });
}

function appliquerFiltres() {
    const filtres = {
        dateDebut: document.getElementById('dateDebut').value,
        dateFin: document.getElementById('dateFin').value,
        type: document.getElementById('typeFiltre').value,
        montantMin: document.getElementById('montantMin').value,
        montantMax: document.getElementById('montantMax').value
    };

    const prestationsFiltrees = prestationManager.filtrerPrestations(filtres);
    afficherPrestations(prestationsFiltrees);
}

function reinitialiserFiltres() {
    document.querySelectorAll('.prestations-filtres input, .prestations-filtres select').forEach(input => {
        input.value = '';
    });
    afficherPrestations(prestationManager.prestations);
}

// Boutons d'export
function ajouterBoutonsExport() {
    const exportButtons = document.createElement('div');
    exportButtons.className = 'export-buttons';
    exportButtons.innerHTML = `
        <button class="btn-secondary" onclick="prestationManager.exporterPrestations('excel')">
            📊 Exporter Excel
        </button>
        <button class="btn-secondary" onclick="prestationManager.exporterPrestations('pdf')">
            📄 Exporter PDF
        </button>
    `;
    return exportButtons;
}
// Système de pointage
class PointageManager {
    constructor() {
        this.pointages = [];
        this.currentPointage = null;
    }

    // Pointer l'entrée
    pointerEntree() {
        if (this.currentPointage) {
            return { success: false, message: 'Vous êtes déjà pointé' };
        }

        this.currentPointage = {
            id: Date.now(),
            date: new Date().toISOString().split('T')[0],
            heureEntree: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
            heureSortie: null,
            duree: null,
            status: 'en_cours'
        };

        this.pointages.push(this.currentPointage);
        this.sauvegarderPointages();
        return { success: true, pointage: this.currentPointage };
    }

    // Pointer la sortie
    pointerSortie() {
        if (!this.currentPointage) {
            return { success: false, message: 'Aucun pointage en cours' };
        }

        this.currentPointage.heureSortie = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        this.currentPointage.duree = this.calculerDuree(
            this.currentPointage.heureEntree,
            this.currentPointage.heureSortie
        );
        this.currentPointage.status = 'termine';
        this.currentPointage = null;

        this.sauvegarderPointages();
        return { success: true };
    }

    // Calculer la durée entre deux heures
    calculerDuree(debut, fin) {
        const [heureDebut, minDebut] = debut.split(':').map(Number);
        const [heureFin, minFin] = fin.split(':').map(Number);
        
        let heures = heureFin - heureDebut;
        let minutes = minFin - minDebut;
        
        if (minutes < 0) {
            heures--;
            minutes += 60;
        }
        
        return `${heures}h${minutes.toString().padStart(2, '0')}`;
    }

    // Obtenir les statistiques
    getStatistiques() {
        const maintenant = new Date();
        const debutMois = new Date(maintenant.getFullYear(), maintenant.getMonth(), 1);
        const finMois = new Date(maintenant.getFullYear(), maintenant.getMonth() + 1, 0);

        const pointagesMois = this.pointages.filter(p => {
            const date = new Date(p.date);
            return date >= debutMois && date <= finMois;
        });

        return {
            totalJours: pointagesMois.length,
            heuresMois: this.calculerHeuresMois(pointagesMois),
            moyenneJour: this.calculerMoyenneJour(pointagesMois),
            retards: this.compterRetards(pointagesMois),
            departsAnticipes: this.compterDepartsAnticipes(pointagesMois)
        };
    }

    // Sauvegarder dans localStorage
    sauvegarderPointages() {
        localStorage.setItem('pointages', JSON.stringify(this.pointages));
    }

    // Charger depuis localStorage
    chargerPointages() {
        const saved = localStorage.getItem('pointages');
        if (saved) {
            this.pointages = JSON.parse(saved);
            // Retrouver le pointage en cours s'il existe
            this.currentPointage = this.pointages.find(p => p.status === 'en_cours');
        }
    }
}

// Gestionnaire de statistiques
class StatistiquesManager {
    constructor(pointageManager, prestationManager) {
        this.pointageManager = pointageManager;
        this.prestationManager = prestationManager;
    }

    // Générer les données pour les graphiques
    genererDonneesGraphiques() {
        return {
            heuresParJour: this.calculerHeuresParJour(),
            prestationsParType: this.calculerPrestationsParType(),
            revenusParMois: this.calculerRevenusParMois()
        };
    }

    // Calculer les heures travaillées par jour
    calculerHeuresParJour() {
        const derniersSeptJours = [...Array(7)].map((_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - i);
            return date.toISOString().split('T')[0];
        }).reverse();

        return {
            labels: derniersSeptJours,
            data: derniersSeptJours.map(date => {
                const pointage = this.pointageManager.pointages.find(p => p.date === date);
                return pointage ? this.convertirDureeEnHeures(pointage.duree) : 0;
            })
        };
    }

    // Calculer la répartition des prestations par type
    calculerPrestationsParType() {
        const prestations = this.prestationManager.prestations;
        const types = ['standard', 'urgence', 'weekend'];
        
        return {
            labels: types,
            data: types.map(type => 
                prestations.filter(p => p.type === type).length
            )
        };
    }

    // Calculer les revenus par mois
    calculerRevenusParMois() {
        const derniersMois = [...Array(6)].map((_, i) => {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            return date.toLocaleDateString('fr-FR', { month: 'long' });
        }).reverse();

        return {
            labels: derniersMois,
            data: derniersMois.map(mois => 
                this.calculerRevenuMois(mois)
            )
        };
    }

    // Convertir une durée en heures décimales
    convertirDureeEnHeures(duree) {
        const [heures, minutes] = duree.split('h').map(Number);
        return heures + (minutes / 60);
    }

    // Calculer le revenu pour un mois donné
    calculerRevenuMois(mois) {
        // Simulation - À remplacer par le vrai calcul
        return Math.floor(Math.random() * 5000) + 1000;
    }
}

// Interface utilisateur pour le pointage
function afficherPointage() {
    const container = document.querySelector('.dashboard-content');
    container.innerHTML = `
        <div class="section-header">
            <h1>Pointage</h1>
            <div class="current-time" id="currentTime"></div>
        </div>

        <div class="pointage-container">
            <div class="pointage-card">
                <div class="pointage-status" id="pointageStatus">
                    Non pointé
                </div>
                <div class="pointage-actions">
                    <button class="btn-success" id="btnEntree">Pointer l'entrée</button>
                    <button class="btn-warning" id="btnSortie" disabled>Pointer la sortie</button>
                </div>
                <div class="pointage-info" id="pointageInfo"></div>
            </div>

            <div class="historique-pointage">
                <h2>Historique des pointages</h2>
                <div class="pointage-table-container">
                    <table class="pointage-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Entrée</th>
                                <th>Sortie</th>
                                <th>Durée</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody id="pointageTableBody">
                            <!-- Les pointages seront ajoutés ici -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div class="statistiques-container">
            <h2>Statistiques</h2>
            <div class="stats-grid">
                <div class="stat-card">
                    <canvas id="heuresChart"></canvas>
                </div>
                <div class="stat-card">
                    <canvas id="prestationsChart"></canvas>
                </div>
                <div class="stat-card">
                    <canvas id="revenusChart"></canvas>
                </div>
            </div>
        </div>
    `;

    initPointageEvents();
    initGraphiques();
}

// Initialiser les événements de pointage
function initPointageEvents() {
    const btnEntree = document.getElementById('btnEntree');
    const btnSortie = document.getElementById('btnSortie');

    btnEntree.addEventListener('click', () => {
        const result = pointageManager.pointerEntree();
        if (result.success) {
            updatePointageUI(true);
        }
    });

    btnSortie.addEventListener('click', () => {
        const result = pointageManager.pointerSortie();
        if (result.success) {
            updatePointageUI(false);
        }
    });

    // Mettre à jour l'heure en temps réel
    setInterval(updateCurrentTime, 1000);
}

// Initialiser les graphiques
function initGraphiques() {
    const stats = statistiquesManager.genererDonneesGraphiques();
    
    // Graphique des heures
    new Chart(document.getElementById('heuresChart'), {
        type: 'line',
        data: {
            labels: stats.heuresParJour.labels,
            datasets: [{
                label: 'Heures travaillées',
                data: stats.heuresParJour.data,
                borderColor: '#4CAF50'
            }]
        }
    });

    // Graphique des prestations
    new Chart(document.getElementById('prestationsChart'), {
        type: 'doughnut',
        data: {
            labels: stats.prestationsParType.labels,
            datasets: [{
                data: stats.prestationsParType.data,
                backgroundColor: ['#2196F3', '#F44336', '#FFC107']
            }]
        }
    });

    // Graphique des revenus
    new Chart(document.getElementById('revenusChart'), {
        type: 'bar',
        data: {
            labels: stats.revenusParMois.labels,
            datasets: [{
                label: 'Revenus mensuels',
                data: stats.revenusParMois.data,
                backgroundColor: '#9C27B0'
            }]
        }
    });
}
// Gestionnaire d'interface améliorée
class InterfaceManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.sidebarState = localStorage.getItem('sidebarState') || 'expanded';
    }

    // Initialiser l'interface
    init() {
        this.initThemeToggle();
        this.initSidebar();
        this.initSearchBar();
        this.initNotifications();
        this.initShortcuts();
    }

    // Gestionnaire de thème
    initThemeToggle() {
        const themeToggle = document.createElement('div');
        themeToggle.className = 'theme-toggle';
        themeToggle.innerHTML = `
            <button class="btn-icon" id="themeToggle">
                <span class="theme-icon">🌓</span>
            </button>
        `;

        document.querySelector('.sidebar-header').appendChild(themeToggle);
        
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Appliquer le thème initial
        document.body.classList.add(this.theme);
    }

    // Barre de recherche globale
    initSearchBar() {
        const searchBar = document.createElement('div');
        searchBar.className = 'search-bar';
        searchBar.innerHTML = `
            <input type="text" placeholder="Rechercher..." id="globalSearch">
            <div class="search-results" style="display: none;"></div>
        `;

        document.querySelector('.main-content').prepend(searchBar);
        
        this.initSearchEvents();
    }

    // Système de notifications
    initNotifications() {
        const notifButton = document.createElement('div');
        notifButton.className = 'notifications-toggle';
        notifButton.innerHTML = `
            <button class="btn-icon" id="notifToggle">
                <span class="notif-icon">🔔</span>
                <span class="notif-badge">0</span>
            </button>
            <div class="notifications-panel" style="display: none;">
                <div class="notif-header">
                    <h3>Notifications</h3>
                    <button class="btn-text" id="markAllRead">Tout marquer comme lu</button>
                </div>
                <div class="notif-list"></div>
            </div>
        `;

        document.querySelector('.sidebar-header').appendChild(notifButton);
        this.initNotificationEvents();
    }

    // Raccourcis clavier
    initShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Alt + P = Nouvelle prestation
            if (e.altKey && e.key === 'p') {
                e.preventDefault();
                this.showQuickAdd('prestation');
            }
            // Alt + T = Pointer
            if (e.altKey && e.key === 't') {
                e.preventDefault();
                this.quickPointage();
            }
            // Alt + R = Rapport rapide
            if (e.altKey && e.key === 'r') {
                e.preventDefault();
                this.generateQuickReport();
            }
        });
    }

    // Ajout rapide
    showQuickAdd(type) {
        const modal = document.createElement('div');
        modal.className = 'quick-add-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>Ajout rapide - ${type}</h3>
                <form id="quickAddForm">
                    <!-- Les champs seront générés dynamiquement -->
                </form>
            </div>
        `;

        document.body.appendChild(modal);
        this.generateQuickAddFields(type);
    }

    // Génération de rapport rapide
    generateQuickReport() {
        const today = new Date();
        const report = {
            date: today.toISOString().split('T')[0],
            prestations: prestationManager.prestations.filter(p => p.date === today.toISOString().split('T')[0]),
            pointages: pointageManager.pointages.filter(p => p.date === today.toISOString().split('T')[0]),
            stats: statistiquesManager.getStatistiques()
        };

        this.showReportPreview(report);
    }

    // Mise à jour de l'interface
    updateUI() {
        this.updateNotificationBadge();
        this.updateThemeIcon();
        this.refreshDashboard();
    }

    // Animations fluides
    animateElement(element, animation) {
        element.style.animation = animation;
        element.addEventListener('animationend', () => {
            element.style.animation = '';
        }, { once: true });
    }

    // Gestion des erreurs UI
    showError(message, duration = 5000) {
        const errorToast = document.createElement('div');
        errorToast.className = 'error-toast';
        errorToast.textContent = message;

        document.body.appendChild(errorToast);
        setTimeout(() => {
            errorToast.remove();
        }, duration);
    }

    // Sauvegarde automatique
    enableAutoSave(form) {
        let timeout;
        form.addEventListener('input', () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                this.saveFormData(form);
            }, 1000);
        });
    }

    // Gestion du drag & drop
    initDragAndDrop() {
        const draggables = document.querySelectorAll('.draggable');
        const containers = document.querySelectorAll('.drag-container');

        draggables.forEach(draggable => {
            draggable.addEventListener('dragstart', () => {
                draggable.classList.add('dragging');
            });

            draggable.addEventListener('dragend', () => {
                draggable.classList.remove('dragging');
            });
        });

        containers.forEach(container => {
            container.addEventListener('dragover', e => {
                e.preventDefault();
                const draggable = document.querySelector('.dragging');
                container.appendChild(draggable);
            });
        });
    }
}

// Initialiser le gestionnaire d'interface
const interfaceManager = new InterfaceManager();
interfaceManager.init();
// Gestionnaire de configuration
class ConfigManager {
    constructor() {
        this.config = this.loadConfig();
    }

    // Charger la configuration
    loadConfig() {
        const defaultConfig = {
            horairesTravail: {
                debut: '09:00',
                fin: '17:00',
                pauseDejeuner: 60, // minutes
            },
            tarifHoraire: {
                standard: 25,
                urgence: 35,
                weekend: 40
            },
            notifications: {
                enabled: true,
                sound: true,
                desktop: true
            },
            exportFormat: {
                dateFormat: 'DD/MM/YYYY',
                devise: '€',
                decimales: 2
            },
            backup: {
                autoSave: true,
                frequency: 'daily'
            }
        };

        const savedConfig = localStorage.getItem('appConfig');
        return savedConfig ? { ...defaultConfig, ...JSON.parse(savedConfig) } : defaultConfig;
    }

    // Sauvegarder la configuration
    saveConfig() {
        localStorage.setItem('appConfig', JSON.stringify(this.config));
    }

    // Mettre à jour la configuration
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        this.saveConfig();
        this.applyConfig();
    }

    // Appliquer la configuration
    applyConfig() {
        // Appliquer les horaires
        prestationManager.setTarifs(this.config.tarifHoraire);
        
        // Appliquer les notifications
        if (this.config.notifications.enabled) {
            this.setupNotifications();
        }

        // Appliquer le format d'export
        exportManager.setFormat(this.config.exportFormat);
    }

    // Configuration des notifications
    setupNotifications() {
        if (this.config.notifications.desktop && 'Notification' in window) {
            Notification.requestPermission();
        }
    }
}

// Interface des paramètres
function afficherParametres() {
    const container = document.querySelector('.dashboard-content');
    container.innerHTML = `
        <div class="section-header">
            <h1>Paramètres</h1>
        </div>

        <div class="settings-container">
            <!-- Horaires de travail -->
            <div class="settings-section">
                <h2>Horaires de travail</h2>
                <form id="horairesForm">
                    <div class="form-group">
                        <label>Heure de début</label>
                        <input type="time" name="heureDebut" 
                               value="${configManager.config.horairesTravail.debut}">
                    </div>
                    <div class="form-group">
                        <label>Heure de fin</label>
                        <input type="time" name="heureFin" 
                               value="${configManager.config.horairesTravail.fin}">
                    </div>
                    <div class="form-group">
                        <label>Pause déjeuner (minutes)</label>
                        <input type="number" name="pauseDejeuner" 
                               value="${configManager.config.horairesTravail.pauseDejeuner}">
                    </div>
                </form>
            </div>

            <!-- Tarifs -->
            <div class="settings-section">
                <h2>Tarifs horaires</h2>
                <form id="tarifsForm">
                    <div class="form-group">
                        <label>Standard (€/h)</label>
                        <input type="number" name="tarifStandard" 
                               value="${configManager.config.tarifHoraire.standard}">
                    </div>
                    <div class="form-group">
                        <label>Urgence (€/h)</label>
                        <input type="number" name="tarifUrgence" 
                               value="${configManager.config.tarifHoraire.urgence}">
                    </div>
                    <div class="form-group">
                        <label>Weekend (€/h)</label>
                        <input type="number" name="tarifWeekend" 
                               value="${configManager.config.tarifHoraire.weekend}">
                    </div>
                </form>
            </div>

            <!-- Notifications -->
            <div class="settings-section">
                <h2>Notifications</h2>
                <form id="notificationsForm">
                    <div class="form-group">
                        <label class="checkbox-label">
                            <input type="checkbox" name="notifEnabled" 
                                   ${configManager.config.notifications.enabled ? 'checked' : ''}>
                            Activer les notifications
                        </label>
                    </div>
                    <div class="form-group">
                        <label class="checkbox-label">
                            <input type="checkbox" name="notifSound" 
                                   ${configManager.config.notifications.sound ? 'checked' : ''}>
                            Son des notifications
                        </label>
                    </div>
                    <div class="form-group">
                        <label class="checkbox-label">
                            <input type="checkbox" name="notifDesktop" 
                                   ${configManager.config.notifications.desktop ? 'checked' : ''}>
                            Notifications bureau
                        </label>
                    </div>
                </form>
            </div>

            <!-- Export -->
            <div class="settings-section">
                <h2>Format d'export</h2>
                <form id="exportForm">
                    <div class="form-group">
                        <label>Format de date</label>
                        <select name="dateFormat">
                            <option value="DD/MM/YYYY" 
                                    ${configManager.config.exportFormat.dateFormat === 'DD/MM/YYYY' ? 'selected' : ''}>
                                JJ/MM/AAAA
                            </option>
                            <option value="YYYY-MM-DD" 
                                    ${configManager.config.exportFormat.dateFormat === 'YYYY-MM-DD' ? 'selected' : ''}>
                                AAAA-MM-JJ
                            </option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Nombre de décimales</label>
                        <input type="number" name="decimales" min="0" max="4" 
                               value="${configManager.config.exportFormat.decimales}">
                    </div>
                </form>
            </div>

            <!-- Sauvegarde -->
            <div class="settings-section">
                <h2>Sauvegarde</h2>
                <form id="backupForm">
                    <div class="form-group">
                        <label class="checkbox-label">
                            <input type="checkbox" name="autoSave" 
                                   ${configManager.config.backup.autoSave ? 'checked' : ''}>
                            Sauvegarde automatique
                        </label>
                    </div>
                    <div class="form-group">
                        <label>Fréquence</label>
                        <select name="frequency">
                            <option value="daily" 
                                    ${configManager.config.backup.frequency === 'daily' ? 'selected' : ''}>
                                Quotidienne
                            </option>
                            <option value="weekly" 
                                    ${configManager.config.backup.frequency === 'weekly' ? 'selected' : ''}>
                                Hebdomadaire
                            </option>
                        </select>
                    </div>
                </form>
            </div>

            <!-- Actions -->
            <div class="settings-actions">
                <button class="btn-secondary" onclick="reinitialiserParametres()">
                    Réinitialiser
                </button>
                <button class="btn-primary" onclick="sauvegarderParametres()">
                    Enregistrer
                </button>
            </div>
        </div>
    `;

    initSettingsEvents();
}
