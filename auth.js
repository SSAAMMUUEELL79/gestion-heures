class Auth {
    constructor() {
        this.isAuthenticated = false;
        this.initializeAuth();
        this.setupEventListeners();
        this.autoLogoutTimer = null;
        this.autoLogoutTime = this.getAutoLogoutTime();
    }

    initializeAuth() {
        // Vérifier si l'utilisateur est déjà connecté
        const token = localStorage.getItem('authToken');
        const expiry = localStorage.getItem('authExpiry');
        
        if (token && expiry && new Date().getTime() < parseInt(expiry)) {
            this.isAuthenticated = true;
            this.showAuthenticatedUI();
            this.setupAutoLogout();
        } else {
            this.logout();
        }
    }

    setupEventListeners() {
        // Formulaire de connexion
        document.getElementById('loginForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Bouton de déconnexion
        document.getElementById('logoutBtn')?.addEventListener('click', () => {
            this.logout();
        });

        // Mot de passe oublié
        document.getElementById('forgotPassword')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleForgotPassword();
        });

        // Afficher/Masquer le mot de passe
        document.querySelector('.toggle-password')?.addEventListener('click', () => {
            this.togglePasswordVisibility();
        });

        // Se souvenir de moi
        document.getElementById('rememberMe')?.addEventListener('change', (e) => {
            localStorage.setItem('rememberMe', e.target.checked);
        });
    }

    handleLogin() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        // Vérification des identifiants (à personnaliser)
        if (this.validateCredentials(email, password)) {
            this.isAuthenticated = true;
            this.createAuthToken(rememberMe);
            this.showAuthenticatedUI();
            this.setupAutoLogout();
        } else {
            this.showError('Email ou mot de passe incorrect');
        }
    }

    validateCredentials(email, password) {
        // À personnaliser selon vos besoins
        const validEmail = localStorage.getItem('userEmail');
        const validPassword = localStorage.getItem('userPassword');

        if (!validEmail || !validPassword) {
            // Premier accès : créer des identifiants par défaut
            localStorage.setItem('userEmail', 'admin@example.com');
            localStorage.setItem('userPassword', 'admin123');
            return email === 'admin@example.com' && password === 'admin123';
        }

        return email === validEmail && password === validPassword;
    }

    createAuthToken(rememberMe) {
        const token = Math.random().toString(36).substring(2);
        const expiry = new Date().getTime() + (rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000);
        
        localStorage.setItem('authToken', token);
        localStorage.setItem('authExpiry', expiry);
    }

    logout() {
        this.isAuthenticated = false;
        localStorage.removeItem('authToken');
        localStorage.removeItem('authExpiry');
        clearTimeout(this.autoLogoutTimer);
        this.showLoginUI();
    }

    handleForgotPassword() {
        const email = document.getElementById('email').value;
        if (!email) {
            this.showError('Veuillez entrer votre email');
            return;
        }

        // Simuler l'envoi d'un email de réinitialisation
        alert(`Un email de réinitialisation a été envoyé à ${email}`);
    }

    togglePasswordVisibility() {
        const passwordInput = document.getElementById('password');
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
    }

    showError(message) {
        alert(message); // À remplacer par une meilleure UI pour les erreurs
    }

    showAuthenticatedUI() {
        document.getElementById('authPage').classList.remove('active');
        document.getElementById('loginPage').classList.add('active');
        document.getElementById('mainNav').style.display = 'flex';
    }

    showLoginUI() {
        document.getElementById('authPage').classList.add('active');
        document.getElementById('loginPage').classList.remove('active');
        document.getElementById('mainNav').style.display = 'none';
    }

    getAutoLogoutTime() {
        return parseInt(localStorage.getItem('autoLogoutTime')) || 30; // 30 minutes par défaut
    }

    setupAutoLogout() {
        clearTimeout(this.autoLogoutTimer);
        if (this.autoLogoutTime === 'never') return;

        this.autoLogoutTimer = setTimeout(() => {
            this.logout();
            alert('Session expirée. Veuillez vous reconnecter.');
        }, this.autoLogoutTime * 60 * 1000);
    }

    resetAutoLogoutTimer() {
        if (this.isAuthenticated) {
            this.setupAutoLogout();
        }
    }
}

// Initialiser l'authentification
document.addEventListener('DOMContentLoaded', () => {
    window.auth = new Auth();
});

// Réinitialiser le timer de déconnexion automatique lors des interactions
document.addEventListener('click', () => {
    window.auth?.resetAutoLogoutTimer();
});

document.addEventListener('keypress', () => {
    window.auth?.resetAutoLogoutTimer();
});
