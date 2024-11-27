class Auth {
    constructor() {
        this.isAuthenticated = false;
        this.initializeAuth();
        this.setupEventListeners();
        this.autoLogoutTimer = null;
        this.autoLogoutTime = this.getAutoLogoutTime();
        console.log('Auth initialized'); // Debug
    }

    initializeAuth() {
        console.log('Initializing auth...'); // Debug

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

        // Charger l'état "Se souvenir de moi"
        const rememberMe = localStorage.getItem('rememberMe') === 'true';
        console.log('Loading rememberMe:', rememberMe); // Debug
        
        const checkbox = document.getElementById('rememberMe');
        if (checkbox) {
            checkbox.checked = rememberMe;
            console.log('Checkbox state set to:', checkbox.checked); // Debug
        } else {
            console.log('Checkbox element not found!'); // Debug
        }
    }

    setupEventListeners() {
        console.log('Setting up event listeners...'); // Debug

        // Formulaire de connexion
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
            console.log('Login form listener added'); // Debug
        }

        // Bouton de déconnexion
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.logout();
            });
            console.log('Logout button listener added'); // Debug
        }

        // Mot de passe oublié
        const forgotPassword = document.getElementById('forgotPassword');
        if (forgotPassword) {
            forgotPassword.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleForgotPassword();
            });
            console.log('Forgot password listener added'); // Debug
        }

        // Afficher/Masquer le mot de passe
        const togglePassword = document.querySelector('.toggle-password');
        if (togglePassword) {
            togglePassword.addEventListener('click', () => {
                this.togglePasswordVisibility();
            });
            console.log('Toggle password listener added'); // Debug
        }

        // Se souvenir de moi
        const rememberMeCheckbox = document.getElementById('rememberMe');
        if (rememberMeCheckbox) {
            rememberMeCheckbox.addEventListener('click', () => {
                console.log('Checkbox clicked:', rememberMeCheckbox.checked); // Debug
                localStorage.setItem('rememberMe', rememberMeCheckbox.checked);
                console.log('Saved to localStorage:', localStorage.getItem('rememberMe')); // Debug
            });
            console.log('Remember me listener added'); // Debug
        } else {
            console.log('Remember me checkbox not found!'); // Debug
        }
    }

    handleLogin() {
        console.log('Handling login...'); // Debug
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked;
        console.log('Remember me state during login:', rememberMe); // Debug

        const validEmail = localStorage.getItem('userEmail');
        const validPassword = localStorage.getItem('userPassword');

        if (email === validEmail && password === validPassword) {
            this.isAuthenticated = true;
            localStorage.setItem('rememberMe', rememberMe);
            console.log('Remember me saved during login:', localStorage.getItem('rememberMe')); // Debug
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
        console.log('Auth token created, remember me:', rememberMe); // Debug
    }

    logout() {
        console.log('Logging out...'); // Debug
        this.isAuthenticated = false;
        localStorage.removeItem('authToken');
        localStorage.removeItem('authExpiry');
        clearTimeout(this.autoLogoutTimer);
        this.showLoginUI();

        // Réinitialiser le formulaire de connexion
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.reset();
            // Restaurer l'état "Se souvenir de moi"
            const rememberMe = localStorage.getItem('rememberMe') === 'true';
            const checkbox = document.getElementById('rememberMe');
            if (checkbox) {
                checkbox.checked = rememberMe;
                console.log('Remember me restored after logout:', rememberMe); // Debug
            }
        }
    }

    handleForgotPassword() {
        const recoveryEmail = localStorage.getItem('recoveryEmail');
        if (!recoveryEmail) {
            this.showError('Aucun email de récupération configuré. Contactez l\'administrateur.');
            return;
        }

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
    console.log('DOM loaded, initializing auth...'); // Debug
    window.auth = new Auth();
});

// Réinitialiser le timer de déconnexion automatique lors des interactions
document.addEventListener('click', () => {
    window.auth?.resetAutoLogoutTimer();
});

document.addEventListener('keypress', () => {
    window.auth?.resetAutoLogoutTimer();
});
