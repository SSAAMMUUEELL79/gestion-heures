// Données de test pour l'authentification (accessibles globalement)
window.users = [
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

// Gestion du changement de mot de passe
document.getElementById('changePasswordForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const currentPassword = document.getElementById('currentPassword2').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Récupérer l'email de l'utilisateur connecté
    const userEmail = localStorage.getItem('userEmail') || sessionStorage.getItem('userEmail');
    const user = users.find(u => u.email === userEmail);
    
    if (!user) {
        alert('Erreur : utilisateur non trouvé');
        return;
    }
    
    // Vérifier le mot de passe actuel
    if (user.password !== currentPassword) {
        alert('Le mot de passe actuel est incorrect');
        return;
    }
    
    // Vérifier que les nouveaux mots de passe correspondent
    if (newPassword !== confirmPassword) {
        alert('Les nouveaux mots de passe ne correspondent pas');
        return;
    }
    
    // Mettre à jour le mot de passe
    user.password = newPassword;
    alert('Mot de passe modifié avec succès');
    
    // Réinitialiser le formulaire
    document.getElementById('changePasswordForm').reset();
});

// Gestion du changement d'email
document.getElementById('emailChangeForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const newEmail = document.getElementById('newEmail').value;
    const currentPassword = document.getElementById('currentPassword').value;
    
    // Récupérer l'email de l'utilisateur connecté
    const userEmail = localStorage.getItem('userEmail') || sessionStorage.getItem('userEmail');
    const user = users.find(u => u.email === userEmail);
    
    if (!user) {
        alert('Erreur : utilisateur non trouvé');
        return;
    }
    
    // Vérifier le mot de passe
    if (user.password !== currentPassword) {
        alert('Le mot de passe est incorrect');
        return;
    }
    
    // Mettre à jour l'email
    user.email = newEmail;
    localStorage.setItem('userEmail', newEmail);
    sessionStorage.setItem('userEmail', newEmail);
    
    alert('Email modifié avec succès');
    
    // Réinitialiser le formulaire
    document.getElementById('emailChangeForm').reset();
});

// Gestion de l'email de récupération
document.getElementById('recoveryEmailForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const recoveryEmail = document.getElementById('recoveryEmail').value;
    
    // Récupérer l'email de l'utilisateur connecté
    const userEmail = localStorage.getItem('userEmail') || sessionStorage.getItem('userEmail');
    const user = users.find(u => u.email === userEmail);
    
    if (!user) {
        alert('Erreur : utilisateur non trouvé');
        return;
    }
    
    // Mettre à jour l'email de récupération
    user.recoveryEmail = recoveryEmail;
    alert('Email de récupération mis à jour avec succès');
    
    // Réinitialiser le formulaire
    document.getElementById('recoveryEmailForm').reset();
});
