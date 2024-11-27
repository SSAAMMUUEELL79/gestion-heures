class EmployeeManager {
    constructor() {
        this.currentEmployee = null;
        this.setupEventListeners();
        this.loadLastEmployee();
    }

    setupEventListeners() {
        // Boutons de navigation
        document.getElementById('newEmployeeBtn')?.addEventListener('click', () => this.showNewEmployeeDialog());
        document.getElementById('loadEmployeeBtn')?.addEventListener('click', () => this.showLoadEmployeeDialog());
        document.getElementById('deleteEmployeeBtn')?.addEventListener('click', () => this.deleteCurrentEmployee());
        document.getElementById('homeBtn')?.addEventListener('click', () => this.showHomePage());

        // Onglets
        document.querySelectorAll('.tab-btn').forEach(button => {
            button.addEventListener('click', (e) => this.handleTabClick(e));
        });

        // Formulaire de saisie
        document.getElementById('saveBtn')?.addEventListener('click', () => this.saveTimesheet());
        
        // Écouteurs pour les calculs automatiques
        ['startTime', 'endTime', 'absenceType'].forEach(id => {
            document.getElementById(id)?.addEventListener('change', () => this.calculateHours());
        });
    }

    showNewEmployeeDialog() {
        const name = prompt("Nom de l'employé :");
        if (name) {
            const hourlyRate = prompt("Taux horaire :");
            if (hourlyRate && !isNaN(hourlyRate)) {
                this.createEmployee(name, parseFloat(hourlyRate));
            }
        }
    }

    showLoadEmployeeDialog() {
        const employees = this.getEmployeesList();
        if (employees.length === 0) {
            alert("Aucun employé enregistré");
            return;
        }

        const name = prompt("Nom de l'employé à charger :");
        if (name) {
            this.loadEmployee(name);
        }
    }

    createEmployee(name, hourlyRate) {
        const employee = {
            name: name,
            hourlyRate: hourlyRate,
            timesheet: []
        };

        localStorage.setItem(`employee_${name}`, JSON.stringify(employee));
        this.currentEmployee = employee;
        this.showTimesheetPage();
        this.updateEmployeeHeader();
    }

    loadEmployee(name) {
        const employeeData = localStorage.getItem(`employee_${name}`);
        if (employeeData) {
            this.currentEmployee = JSON.parse(employeeData);
            this.showTimesheetPage();
            this.updateEmployeeHeader();
            this.updateResults();
        } else {
            alert("Employé non trouvé");
        }
    }

    deleteCurrentEmployee() {
        if (!this.currentEmployee) return;
        
        if (confirm("Voulez-vous vraiment supprimer cet employé ?")) {
            localStorage.removeItem(`employee_${this.currentEmployee.name}`);
            this.currentEmployee = null;
            this.showHomePage();
        }
    }

    saveTimesheet() {
        if (!this.currentEmployee) return;

        const date = document.getElementById('dateInput').value;
        const startTime = document.getElementById('startTime').value;
        const endTime = document.getElementById('endTime').value;
        const absenceType = document.getElementById('absenceType').value;

        if (!date) {
            alert("Veuillez sélectionner une date");
            return;
        }

        const entry = {
            date: date,
            startTime: startTime,
            endTime: endTime,
            absenceType: absenceType,
            hours: this.calculateHours()
        };

        // Mettre à jour ou ajouter l'entrée
        const existingEntryIndex = this.currentEmployee.timesheet.findIndex(e => e.date === date);
        if (existingEntryIndex !== -1) {
            this.currentEmployee.timesheet[existingEntryIndex] = entry;
        } else {
            this.currentEmployee.timesheet.push(entry);
        }

        localStorage.setItem(`employee_${this.currentEmployee.name}`, JSON.stringify(this.currentEmployee));
        this.updateResults();
        alert("Données enregistrées");
    }

    calculateHours() {
        const startTime = document.getElementById('startTime').value;
        const endTime = document.getElementById('endTime').value;
        const absenceType = document.getElementById('absenceType').value;

        if (absenceType) {
            return 7; // Journée standard pour les absences
        }

        if (!startTime || !endTime) return 0;

        const start = new Date(`2000-01-01T${startTime}`);
        const end = new Date(`2000-01-01T${endTime}`);
        
        if (end < start) {
            end.setDate(end.getDate() + 1);
        }

        const hours = (end - start) / (1000 * 60 * 60);
        return Math.round(hours * 100) / 100;
    }

    updateResults() {
        if (!this.currentEmployee) return;

        const results = {
            totalHours: 0,
            totalCP: 0,
            totalCSS: 0,
            totalM: 0,
            totalF: 0
        };

        this.currentEmployee.timesheet.forEach(entry => {
            if (entry.absenceType) {
                results[`total${entry.absenceType}`]++;
            } else {
                results.totalHours += entry.hours;
            }
        });

        document.getElementById('totalHours').textContent = results.totalHours.toFixed(2);
        document.getElementById('totalCP').textContent = results.totalCP;
        document.getElementById('totalCSS').textContent = results.totalCSS;
        document.getElementById('totalM').textContent = results.totalM;
        document.getElementById('totalF').textContent = results.totalF;
        
        const salary = results.totalHours * this.currentEmployee.hourlyRate;
        document.getElementById('salary').textContent = salary.toFixed(2);
    }

    handleTabClick(event) {
        const tabId = event.target.dataset.tab;
        
        // Mettre à jour les boutons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');

        // Mettre à jour les contenus
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabId}Tab`).classList.add('active');

        if (tabId === 'results') {
            this.updateResults();
        }
    }

    showHomePage() {
        document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
        document.getElementById('loginPage').classList.add('active');
        
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById('homeBtn').classList.add('active');
    }

    showTimesheetPage() {
        document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
        document.getElementById('timesheetPage').classList.add('active');
    }

    updateEmployeeHeader() {
        if (this.currentEmployee) {
            document.getElementById('employeeHeader').textContent = 
                `${this.currentEmployee.name} - ${this.currentEmployee.hourlyRate}€/h`;
        }
    }

    getEmployeesList() {
        return Object.keys(localStorage)
            .filter(key => key.startsWith('employee_'))
            .map(key => key.replace('employee_', ''));
    }

    loadLastEmployee() {
        const lastEmployee = localStorage.getItem('lastEmployee');
        if (lastEmployee) {
            this.loadEmployee(lastEmployee);
        }
    }
}

// Initialiser l'application
document.addEventListener('DOMContentLoaded', () => {
    window.employeeManager = new EmployeeManager();
});
