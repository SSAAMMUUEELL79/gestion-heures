document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const forgotPasswordLink = document.getElementById('forgotPassword');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            // Ici nous ajouterons la logique d'authentification
            console.log('Tentative de connexion avec:', { email, password });
            
            // Simulation d'une connexion réussie
            alert('Connexion réussie !');
            
        } catch (error) {
            console.error('Erreur de connexion:', error);
            alert('Erreur de connexion. Veuillez réessayer.');
        }
    });

    forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        // Ici nous ajouterons la logique de récupération de mot de passe
        alert('Fonctionnalité de récupération de mot de passe à implémenter');
    });
});
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const forgotPasswordLink = document.getElementById('forgotPassword');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    // Fonction de validation d'email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Fonction de validation de mot de passe
    function isValidPassword(password) {
        return password.length >= 8;
    }

    // Validation en temps réel de l'email
    emailInput.addEventListener('input', () => {
        if (!isValidEmail(emailInput.value)) {
            emailInput.classList.add('invalid');
            emailInput.setCustomValidity('Email invalide');
        } else {
            emailInput.classList.remove('invalid');
            emailInput.setCustomValidity('');
        }
    });

    // Validation en temps réel du mot de passe
    passwordInput.addEventListener('input', () => {
        if (!isValidPassword(passwordInput.value)) {
            passwordInput.classList.add('invalid');
            passwordInput.setCustomValidity('Le mot de passe doit contenir au moins 8 caractères');
        } else {
            passwordInput.classList.remove('invalid');
            passwordInput.setCustomValidity('');
        }
    });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = emailInput.value;
        const password = passwordInput.value;

        if (!isValidEmail(email)) {
            alert('Veuillez entrer un email valide');
            return;
        }

        if (!isValidPassword(password)) {
            alert('Le mot de passe doit contenir au moins 8 caractères');
            return;
        }

        try {
            // Simulation d'une vérification d'authentification
            const response = await simulateAuth(email, password);
            if (response.success) {
                window.location.href = 'dashboard.html'; // Redirection vers le tableau de bord
            } else {
                alert('Email ou mot de passe incorrect');
            }
        } catch (error) {
            console.error('Erreur de connexion:', error);
            alert('Erreur de connexion. Veuillez réessayer.');
        }
    });

    // Simulation d'une API d'authentification
    async function simulateAuth(email, password) {
        // Simulation d'un délai réseau
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Pour test : accepte uniquement test@test.com / password123
        return {
            success: email === 'test@test.com' && password === 'password123'
        };
    }

    forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'reset-password.html';
    });
});
