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
