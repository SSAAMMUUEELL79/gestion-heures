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

        // Créer un compte par défaut si aucun n'existe
        if (!localStorage.getItem('userEmail') || !localStorage.getItem('userPassword')) {
            localStorage.setItem('userEmail', 'admin@example.com');
            localStorage.setItem('userPassword', 'admin123');
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

        const validEmail = localStorage.getItem('userEmail');
        const validPassword = localStorage.getItem('userPassword');

        if (email === validEmail && password === validPassword) {
            this.isAuthenticated = true;
            this.createAuthToken(rememberMe);
            this.showAuthenticatedUI();
            this.setupAutoLogout();
        } else {
            this.showError('Email ou mot de passe incorrect');
        }
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
        const recoveryEmail = localStorage.getItem('recoveryEmail');
        if (!recoveryEmail) {
            this.showError('Aucun email de récupération configuré. Contactez l\'administrateur.');
            return;
        }

        // Simuler l'envoi d'un email
        const tempPassword = Math.random().toString(36).substring(2, 10);
        localStorage.setItem('userPassword', tempPassword);
        
        alert(`Un nouveau mot de passe temporaire a été envoyé à ${recoveryEmail}\n\nPour cette démo, voici le mot de passe : ${tempPassword}`);
    }

    togglePasswordVisibility() {
        const passwordInput = document.getElementById('password');
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
    }

    showError(message) {
        alert(message);
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
        return parseInt(localStorage.getItem('autoLogoutTime')) || 30;
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
