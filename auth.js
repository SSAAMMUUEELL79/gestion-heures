// Données de test pour l'authentification
const users = [
    {
        email: 'test@test.com',
        password: 'test123',
        recoveryEmail: ''
    },
    {
        email: 'admin@admin.com',
        password: 'admin123',
        recoveryEmail: ''
    }
];

// Gestionnaire de connexion
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    // Vérification des identifiants
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        // Stockage de l'état de connexion
        if (rememberMe) {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userEmail', email);
        } else {
            sessionStorage.setItem('isLoggedIn', 'true');
            sessionStorage.setItem('userEmail', email);
        }

        // Redirection vers la page d'accueil
        document.getElementById('authPage').classList.remove('active');
        document.getElementById('loginPage').classList.add('active');
        document.getElementById('mainNav').style.display = 'flex';
    } else {
        alert('Email ou mot de passe incorrect');
    }
});

// Afficher/Masquer le mot de passe
document.querySelector('.toggle-password').addEventListener('click', function() {
    const passwordInput = document.getElementById('password');
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
    } else {
        passwordInput.type = 'password';
    }
});

// Vérification de l'état de connexion au chargement
window.addEventListener('load', function() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true' || 
                      sessionStorage.getItem('isLoggedIn') === 'true';

    if (isLoggedIn) {
        document.getElementById('authPage').classList.remove('active');
        document.getElementById('loginPage').classList.add('active');
        document.getElementById('mainNav').style.display = 'flex';
    } else {
        document.getElementById('mainNav').style.display = 'none';
    }
});

// Gestion de la déconnexion
document.getElementById('logoutBtn').addEventListener('click', function() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('userEmail');
    
    // Redirection vers la page de connexion
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById('authPage').classList.add('active');
    document.getElementById('mainNav').style.display = 'none';
    
    // Réinitialisation du formulaire
    document.getElementById('loginForm').reset();
});

// Gestion du "mot de passe oublié"
document.getElementById('forgotPassword').addEventListener('click', function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const user = users.find(u => u.email === email);
    
    if (!email) {
        alert('Veuillez entrer votre email avant de cliquer sur "Mot de passe oublié"');
        return;
    }
    
    if (user && user.recoveryEmail) {
        alert(`Un email de réinitialisation a été envoyé à ${user.recoveryEmail}`);
    } else {
        alert('Aucun email de récupération n\'est configuré pour cet utilisateur');
    }
});
