class Settings {
    constructor() {
        this.setupEventListeners();
        this.loadSettings();
    }

    setupEventListeners() {
        // Changement d'email de connexion
        document.getElementById('emailChangeForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleEmailChange();
        });

        // Changement de mot de passe
        document.getElementById('changePasswordForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handlePasswordChange();
        });

        // Mise à jour de l'email de récupération
        document.getElementById('recoveryEmailForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRecoveryEmailUpdate();
        });

        // Mode sombre
        document.getElementById('darkMode')?.addEventListener('change', (e) => {
            this.handleDarkModeToggle(e.target.checked);
        });

        // Déconnexion automatique
        document.getElementById('autoLogout')?.addEventListener('change', (e) => {
            this.handleAutoLogoutChange(e.target.value);
        });

        // Navigation
        document.getElementById('settingsBtn')?.addEventListener('click', () => {
            this.showSettingsPage();
        });

        document.getElementById('homeBtn')?.addEventListener('click', () => {
            this.showHomePage();
        });
    }

    loadSettings() {
        // Charger l'email actuel
        const currentEmail = localStorage.getItem('userEmail');
        if (currentEmail) {
            document.getElementById('newEmail').placeholder = currentEmail;
        }

        // Charger le mode sombre
        const darkMode = localStorage.getItem('darkMode') === 'true';
        document.getElementById('darkMode').checked = darkMode;
        this.handleDarkModeToggle(darkMode);

        // Charger le temps de déconnexion automatique
        const autoLogout = localStorage.getItem('autoLogoutTime') || '30';
        document.getElementById('autoLogout').value = autoLogout;

        // Charger l'email de récupération
        const recoveryEmail = localStorage.getItem('recoveryEmail');
        if (recoveryEmail) {
            document.getElementById('recoveryEmail').value = recoveryEmail;
        }
    }

    handleEmailChange() {
        const newEmail = document.getElementById('newEmail').value;
        const currentPassword = document.getElementById('currentPassword')?.value;

        if (!this.isEmailValid(newEmail)) {
            this.showError('Veuillez entrer une adresse email valide');
            return;
        }

        // Vérifier le mot de passe actuel avant de changer l'email
        if (currentPassword !== localStorage.getItem('userPassword')) {
            this.showError('Mot de passe incorrect');
            return;
        }

        // Mettre à jour l'email
        localStorage.setItem('userEmail', newEmail);
        this.showSuccess('Email mis à jour avec succès');
        
        // Réinitialiser le formulaire
        document.getElementById('emailChangeForm').reset();
        document.getElementById('newEmail').placeholder = newEmail;
    }

    handlePasswordChange() {
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Vérifier le mot de passe actuel
        if (currentPassword !== localStorage.getItem('userPassword')) {
            this.showError('Mot de passe actuel incorrect');
            return;
        }

        // Vérifier que les nouveaux mots de passe correspondent
        if (newPassword !== confirmPassword) {
            this.showError('Les nouveaux mots de passe ne correspondent pas');
            return;
        }

        // Vérifier la complexité du mot de passe
        if (!this.isPasswordValid(newPassword)) {
            this.showError('Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre');
            return;
        }

        // Mettre à jour le mot de passe
        localStorage.setItem('userPassword', newPassword);
        this.showSuccess('Mot de passe mis à jour avec succès');
        
        // Réinitialiser le formulaire
        document.getElementById('changePasswordForm').reset();
    }

    handleRecoveryEmailUpdate() {
        const email = document.getElementById('recoveryEmail').value;
        
        if (!this.isEmailValid(email)) {
            this.showError('Veuillez entrer une adresse email valide');
            return;
        }

        localStorage.setItem('recoveryEmail', email);
        this.showSuccess('Email de récupération mis à jour avec succès');
    }

    handleDarkModeToggle(enabled) {
        localStorage.setItem('darkMode', enabled);
        document.body.classList.toggle('dark-mode', enabled);
    }

    handleAutoLogoutChange(value) {
        localStorage.setItem('autoLogoutTime', value);
        if (window.auth) {
            window.auth.autoLogoutTime = value;
            window.auth.setupAutoLogout();
        }
    }

    showSettingsPage() {
        document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
        document.getElementById('settingsPage').classList.add('active');
        
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById('settingsBtn').classList.add('active');
    }

    showHomePage() {
        document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
        document.getElementById('loginPage').classList.add('active');
        
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById('homeBtn').classList.add('active');
    }

    isPasswordValid(password) {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);

        return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers;
    }

    isEmailValid(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    showError(message) {
        alert(message); // À remplacer par une meilleure UI pour les erreurs
    }

    showSuccess(message) {
        alert(message); // À remplacer par une meilleure UI pour les succès
    }
}

// Initialiser les paramètres
document.addEventListener('DOMContentLoaded', () => {
    window.settings = new Settings();
});
