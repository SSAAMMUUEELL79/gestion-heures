trouves pas ce boton rouge. c'est ou
    // Gestion des données
class Employee {
    constructor(data) {
        this.data = data;
        this.workHours = {};
        this.absences = [];
        this.holidays = [];
        this.vacations = [];
        this.economicUnemployment = [];
        this.temporaryUnemployment = [];
    }

    save() {
        localStorage.setItem(`employee_${this.data.matricule}`, JSON.stringify({
            ...this.data,
            workHours: this.workHours,
            absences: this.absences,
            holidays: this.holidays,
            vacations: this.vacations,
            economicUnemployment: this.economicUnemployment,
            temporaryUnemployment: this.temporaryUnemployment
        }));
    }

    static load(matricule) {
        const data = localStorage.getItem(`employee_${matricule}`);
        if (data) {
            const parsed = JSON.parse(data);
            const employee = new Employee({
                nom: parsed.nom,
                prenom: parsed.prenom,
                matricule: parsed.matricule,
                typeContrat: parsed.typeContrat,
                typeTemps: parsed.typeTemps,
                heuresHebdo: parsed.heuresHebdo,
                tauxHoraire: parsed.tauxHoraire
            });
            employee.workHours = parsed.workHours || {};
            employee.absences = parsed.absences || [];
            employee.holidays = parsed.holidays || [];
            employee.vacations = parsed.vacations || [];
            employee.economicUnemployment = parsed.economicUnemployment || [];
            employee.temporaryUnemployment = parsed.temporaryUnemployment || [];
            return employee;
        }
        return null;
    }

    static getAllEmployees() {
        const employees = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('employee_')) {
                const data = JSON.parse(localStorage.getItem(key));
                employees.push({
                    nom: data.nom,
                    prenom: data.prenom,
                    matricule: data.matricule
                });
            }
        }
        return employees;
    }

    calculateHours(startTime, endTime) {
        if (!startTime || !endTime) return 0;
        const [startHours, startMinutes] = startTime.split(':').map(Number);
        const [endHours, endMinutes] = endTime.split(':').map(Number);
        const start = startHours + startMinutes / 60;
        const end = endHours + endMinutes / 60;
        return end - start;
    }

    calculateDayHours(date) {
        const hours = this.workHours[date];
        if (!hours) return 0;
        
        const morningHours = this.calculateHours(hours.morning?.start, hours.morning?.end) || 0;
        const afternoonHours = this.calculateHours(hours.afternoon?.start, hours.afternoon?.end) || 0;
        
        return morningHours + afternoonHours;
    }
}

// Application principale
class App {
    constructor() {
        this.currentEmployee = null;
        this.initializeEventListeners();
        this.showLoginPage();
        
        // Initialiser la date du jour
        const today = new Date().toISOString().split('T')[0];
        if (document.getElementById('workDate')) {
            document.getElementById('workDate').value = today;
        }
        
        // Initialiser l'année courante
        const currentYear = new Date().getFullYear();
        if (document.getElementById('year')) {
            document.getElementById('year').value = currentYear;
        }

        // Initialiser le mois courant
        const currentMonth = new Date().getMonth() + 1;
        if (document.getElementById('month')) {
            document.getElementById('month').value = currentMonth;
        }
    }

    initializeEventListeners() {
        document.getElementById('newEmployeeBtn')?.addEventListener('click', () => this.showPage('registerPage'));
        document.getElementById('loadEmployeeBtn')?.addEventListener('click', () => this.showEmployeeList());
        document.getElementById('registerForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.registerEmployee();
        });
        document.getElementById('deleteEmployeeBtn')?.addEventListener('click', () => this.deleteEmployee());

        // Onglets
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Menu déroulant d'absence
        document.getElementById('absenceType')?.addEventListener('change', () => this.handleAbsenceTypeChange());

        document.getElementById('saveDay')?.addEventListener('click', () => this.saveWorkday());
        document.getElementById('calculateBtn')?.addEventListener('click', () => this.calculateMonthly());
    }

    deleteEmployee() {
        if (confirm('Êtes-vous sûr de vouloir supprimer cet employé ? Cette action est irréversible.')) {
            localStorage.removeItem(`employee_${this.currentEmployee.data.matricule}`);
            this.currentEmployee = null;
            this.showLoginPage();
        }
    }

    handleAbsenceTypeChange() {
        const selectedType = document.getElementById('absenceType').value;
        const timeInputs = ['startMorning', 'endMorning', 'startAfternoon', 'endAfternoon'];
        
        timeInputs.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.disabled = selectedType !== 'none';
                if (selectedType !== 'none') {
                    input.value = '';
                }
            }
        });
    }

    showPage(pageId) {
        document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
        document.getElementById(pageId)?.classList.add('active');
    }

    showLoginPage() {
        this.showPage('loginPage');
        const employees = Employee.getAllEmployees();
        if (employees.length === 0) {
            const loadBtn = document.getElementById('loadEmployeeBtn');
            if (loadBtn) loadBtn.style.display = 'none';
        }
    }

    showEmployeeList() {
        const employees = Employee.getAllEmployees();
        if (employees.length === 0) {
            alert('Aucun employé enregistré');
            return;
        }

        const dialog = document.createElement('div');
        dialog.className = 'dialog';
        dialog.innerHTML = `
            <div class="dialog-content">
                <h3>Sélectionner un employé</h3>
                <div class="employee-list">
                    ${employees.map(emp => `
                        <button class="employee-item" data-matricule="${emp.matricule}">
                            ${emp.nom} ${emp.prenom}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;

        dialog.querySelectorAll('.employee-item').forEach(btn => {
            btn.addEventListener('click', () => {
                this.loadEmployee(btn.dataset.matricule);
                document.body.removeChild(dialog);
            });
        });

        document.body.appendChild(dialog);
    }

    registerEmployee() {
        const data = {
            nom: document.getElementById('nom')?.value,
            prenom: document.getElementById('prenom')?.value,
            matricule: document.getElementById('matricule')?.value,
            typeContrat: document.getElementById('typeContrat')?.value,
            typeTemps: document.getElementById('typeTemps')?.value,
            heuresHebdo: parseFloat(document.getElementById('heuresHebdo')?.value),
            tauxHoraire: parseFloat(document.getElementById('tauxHoraire')?.value)
        };

        this.currentEmployee = new Employee(data);
        this.currentEmployee.save();
        this.showTimesheetPage();
    }

    loadEmployee(matricule) {
        this.currentEmployee = Employee.load(matricule);
        if (this.currentEmployee) {
            this.showTimesheetPage();
        } else {
            alert('Erreur lors du chargement de l\'employé');
        }
    }

    showTimesheetPage() {
        this.showPage('timesheetPage');
        const header = document.getElementById('employeeHeader');
        if (header) {
            header.textContent = `${this.currentEmployee.data.nom} ${this.currentEmployee.data.prenom}`;
        }
    }

    saveWorkday() {
        const date = document.getElementById('workDate')?.value;
        if (!date) {
            alert('Veuillez sélectionner une date');
            return;
        }

        const absenceType = document.getElementById('absenceType')?.value;
        
        try {
            if (absenceType === 'absence') {
                this.currentEmployee.absences.push(date);
            } else if (absenceType === 'holiday') {
                this.currentEmployee.holidays.push(date);
            } else if (absenceType === 'vacation') {
                this.currentEmployee.vacations.push(date);
            } else if (absenceType === 'economic') {
                this.currentEmployee.economicUnemployment.push(date);
            } else if (absenceType === 'temporary') {
                this.currentEmployee.temporaryUnemployment.push(date);
            } else {
                this.currentEmployee.workHours[date] = {
                    morning: {
                        start: document.getElementById('startMorning')?.value,
                        end: document.getElementById('endMorning')?.value
                    },
                    afternoon: {
                        start: document.getElementById('startAfternoon')?.value,
                        end: document.getElementById('endAfternoon')?.value
                    }
                };
            }

            this.currentEmployee.save();
            alert('Journée enregistrée avec succès !');
            
            // Réinitialiser le formulaire
            document.getElementById('absenceType').value = 'none';
            this.handleAbsenceTypeChange();
            ['startMorning', 'endMorning', 'startAfternoon', 'endAfternoon'].forEach(id => {
                const input = document.getElementById(id);
                if (input) input.value = '';
            });
        } catch (error) {
            alert('Erreur lors de l\'enregistrement : ' + error.message);
        }
    }

    calculateMonthly() {
        const month = parseInt(document.getElementById('month')?.value);
        const year = parseInt(document.getElementById('year')?.value);
        
        let totalHours = 0;
        let workDays = 0;
        let absences = 0;
        let holidays = 0;
        let vacations = 0;
        let economic = 0;
        let temporary = 0;

        const daysInMonth = new Date(year, month, 0).getDate();

        for (let day = 1; day <= daysInMonth; day++) {
            const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            
            if (this.currentEmployee.absences.includes(date)) {
                absences++;
            } else if (this.currentEmployee.holidays.includes(date)) {
                holidays++;
            } else if (this.currentEmployee.vacations.includes(date)) {
                vacations++;
            } else if (this.currentEmployee.economicUnemployment.includes(date)) {
                economic++;
            } else if (this.currentEmployee.temporaryUnemployment.includes(date)) {
                temporary++;
            } else if (this.currentEmployee.workHours[date]) {
                const dayHours = this.currentEmployee.calculateDayHours(date);
                if (dayHours > 0) {
                    totalHours += dayHours;
                    workDays++;
                }
            }
        }

        const results = document.getElementById('results');
        if (results) {
            results.innerHTML = `
                <p>Total des heures : ${totalHours.toFixed(2)}h</p>
                <p>Jours travaillés : ${workDays}</p>
                <p>Absences : ${absences}</p>
                <p>Jours fériés : ${holidays}</p>
                <p>Congés : ${vacations}</p>
                <p>Chômage économique : ${economic}</p>
                <p>Chômage temporaire : ${temporary}</p>
                <p>Salaire brut : ${(totalHours * this.currentEmployee.data.tauxHoraire).toFixed(2)}€</p>
            `;
        }
    }

    switchTab(tabId) {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabId);
        });
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.toggle('active', content.id === `${tabId}Tab`);
        });
    }
}

// Démarrer l'application
document.addEventListener('DOMContentLoaded', () => {
    new App();
});
