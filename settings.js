// settings.js

// Fonction pour charger les paramètres de l'utilisateur
function loadUserSettings() {
    const userEmail = localStorage.getItem('userEmail') || sessionStorage.getItem('userEmail');
    const user = users.find(u => u.email === userEmail);
    
    if (user) {
        // Pré-remplir l'email de récupération s'il existe
        if (user.recoveryEmail) {
            document.getElementById('recoveryEmail').value = user.recoveryEmail;
        }

        // Charger les autres paramètres
        const darkMode = localStorage.getItem('darkMode') === 'enabled';
        document.getElementById('darkMode').checked = darkMode;
        if (darkMode) {
            document.body.classList.add('dark-mode');
        }

        const autoLogoutTime = localStorage.getItem('autoLogoutTime');
        if (autoLogoutTime) {
            document.getElementById('autoLogout').value = autoLogoutTime;
        }
    }
}

// Réinitialiser les formulaires lors du changement de page
function resetSettingsForms() {
    document.getElementById('emailChangeForm').reset();
    document.getElementById('changePasswordForm').reset();
    document.getElementById('recoveryEmailForm').reset();
}

// Gestionnaire pour le bouton Paramètres
document.getElementById('settingsBtn').addEventListener('click', function() {
    resetSettingsForms();
    loadUserSettings();
});

// Gestionnaire pour le mode sombre
document.getElementById('darkMode').addEventListener('change', function() {
    if (this.checked) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('darkMode', 'enabled');
    } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('darkMode', 'disabled');
    }
});

// Gestionnaire pour la déconnexion automatique
document.getElementById('autoLogout').addEventListener('change', function() {
    localStorage.setItem('autoLogoutTime', this.value);
    // Appeler la fonction setAutoLogoutTimer définie dans auth.js
    if (typeof setAutoLogoutTimer === 'function') {
        setAutoLogoutTimer();
    }
});

// Charger les paramètres au chargement de la page
window.addEventListener('load', function() {
    loadUserSettings();
    
    // Vérifier si l'utilisateur est connecté
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true' || 
                      sessionStorage.getItem('isLoggedIn') === 'true';
    
    if (isLoggedIn) {
        // Initialiser les paramètres de déconnexion automatique
        const autoLogoutTime = localStorage.getItem('autoLogoutTime');
        if (autoLogoutTime) {
            document.getElementById('autoLogout').value = autoLogoutTime;
            if (typeof setAutoLogoutTimer === 'function') {
                setAutoLogoutTimer();
            }
        }
    }
});

// Gestionnaire d'erreurs global
window.addEventListener('error', function(e) {
    console.error('Erreur dans settings.js:', e.error);
    alert('Une erreur est survenue. Veuillez réessayer.');
});
