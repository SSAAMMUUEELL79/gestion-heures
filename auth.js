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
