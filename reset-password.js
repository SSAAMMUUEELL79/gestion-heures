document.addEventListener('DOMContentLoaded', () => {
    const resetRequestForm = document.getElementById('resetRequestForm');
    const resetConfirmForm = document.getElementById('resetConfirmForm');
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');

    // Validation du mot de passe
    function isValidPassword(password) {
        // Au moins 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        return passwordRegex.test(password);
    }

    // Étape 1 : Demande de réinitialisation
    resetRequestForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('resetEmail').value;

        try {
            // Simulation d'envoi d'email
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Pour la démo, on passe directement à l'étape 2
            step1.style.display = 'none';
            step2.style.display = 'block';
            
            alert('Un code de réinitialisation a été envoyé à votre email.');
        } catch (error) {
            alert('Erreur lors de l\'envoi du code. Veuillez réessayer.');
        }
    });

    // Étape 2 : Confirmation et nouveau mot de passe
    resetConfirmForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const code = document.getElementById('resetCode').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Validations
        if (!isValidPassword(newPassword)) {
            alert('Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre.');
            return;
        }

        if (newPassword !== confirmPassword) {
            alert('Les mots de passe ne correspondent pas.');
            return;
        }

        try {
            // Simulation de réinitialisation
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            alert('Mot de passe réinitialisé avec succès !');
            window.location.href = 'index.html'; // Redirection vers la page de connexion
        } catch (error) {
            alert('Erreur lors de la réinitialisation. Veuillez réessayer.');
        }
    });
});
