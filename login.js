// Gestionnaire de connexion
class LoginManager {
    constructor() {
        this.initEvents();
    }

    initEvents() {
        // Formulaire de connexion
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });
    }

    handleLogin() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const remember = document.querySelector('input[name="remember"]').checked;

        // Simulation de connexion (à remplacer par votre système d'authentification)
        if (email && password) {
            // Stocker les informations de connexion si "Se souvenir de moi" est coché
            if (remember) {
                localStorage.setItem('userEmail', email);
            }

            // Redirection vers l'application
            window.location.href = 'index.html';
        } else {
            this.showError('Veuillez remplir tous les champs');
        }
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'login-error';
        errorDiv.textContent = message;

        const form = document.getElementById('loginForm');
        form.insertBefore(errorDiv, form.firstChild);

        setTimeout(() => {
            errorDiv.remove();
        }, 3000);
    }
}

// Initialiser le gestionnaire de connexion
const loginManager = new LoginManager();

// Fonction pour afficher le formulaire d'inscription
function showRegisterForm() {
    const loginBox = document.querySelector('.login-box');
    loginBox.innerHTML = `
        <div class="login-header">
            <h1>Créer un compte</h1>
            <p>Remplissez les informations ci-dessous</p>
        </div>

        <form id="registerForm" class="login-form">
            <div class="form-group">
                <label for="name">Nom complet</label>
                <input type="text" id="name" name="name" required>
            </div>

            <div class="form-group">
                <label for="regEmail">Email</label>
                <input type="email" id="regEmail" name="email" required>
            </div>

            <div class="form-group">
                <label for="regPassword">Mot de passe</label>
                <input type="password" id="regPassword" name="password" required>
            </div>

            <div class="form-group">
                <label for="confirmPassword">Confirmer le mot de passe</label>
                <input type="password" id="confirmPassword" name="confirmPassword" required>
            </div>

            <button type="submit" class="btn-primary btn-login">
                Créer le compte
            </button>
        </form>

        <div class="login-footer">
            <p>Déjà un compte ?</p>
            <button class="btn-secondary" onclick="window.location.reload()">
                Se connecter
            </button>
        </div>
    `;

    // Ajouter l'événement pour le formulaire d'inscription
    document.getElementById('registerForm').addEventListener('submit', (e) => {
        e.preventDefault();
        handleRegister();
    });
}

// Gérer l'inscription
function handleRegister() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        showError('Les mots de passe ne correspondent pas');
        return;
    }

    // Simulation d'inscription (à remplacer par votre système d'authentification)
    localStorage.setItem('userName', name);
    localStorage.setItem('userEmail', email);

    // Redirection vers l'application
    window.location.href = 'index.html';
}
