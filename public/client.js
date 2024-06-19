// client.js

// Fonction pour charger les templates existants depuis le serveur
async function loadTemplates() {
    const response = await fetch('/get-templates');
    const templates = await response.json();
    const templateList = document.getElementById('templateList');

    // Remplir le sélecteur avec les templates chargés
    templateList.innerHTML = '';
    templates.forEach(template => {
        const option = document.createElement('option');
        option.value = template.file; // Utilisation du nom de fichier comme valeur
        option.textContent = template.name;
        templateList.appendChild(option);
    });
}

// Fonction pour sélectionner un template existant depuis le serveur
async function selectTemplate() {
    const templateList = document.getElementById('templateList');
    const selectedFileName = templateList.value;

    if (selectedFileName) {
        const response = await fetch(`/get-template-content/${selectedFileName}`);
        const content = await response.text();

        // Charger le contenu du template dans TinyMCE
        tinymce.get('htmlTemplate').setContent(content);
    }
}

// Fonction pour enregistrer le template
async function saveTemplate() {
    const templateName = document.getElementById('templateName').value;
    const templateContent = tinymce.get('htmlTemplate').getContent();

    // Envoi du nom et du contenu du template au serveur
    const response = await fetch('/save-template', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: templateName, content: templateContent })
    });

    if (response.ok) {
        alert('Template enregistré avec succès !');
        loadTemplates(); // Recharger la liste des templates après enregistrement
        document.getElementById('saveTemplateForm').reset(); // Réinitialiser le formulaire
        tinymce.get('htmlTemplate').setContent(''); // Effacer le contenu de TinyMCE
    } else {
        alert('Erreur lors de l\'enregistrement du template');
    }
}

// Fonction pour soumettre le formulaire et envoyer l'email
async function submitEmailForm() {
    const templateList = document.getElementById('templateList');
    const selectedTemplate = templateList.value;

    if (selectedTemplate) {
        try {
            const response = await fetch(`/get-template-content/${selectedTemplate}`);
            const content = await response.text();

            let formData = new FormData();
            formData.append('htmlTemplate', selectedTemplate); // Nom du template
            formData.append('htmlContent', content); // Contenu du template

            const csvFile = document.getElementById('csvFile').files[0];
            formData.append('csvFile', csvFile); // Fichier CSV

            const attachments = document.getElementById('attachments').files;
            for (let i = 0; i < attachments.length; i++) {
                formData.append('attachments', attachments[i]); // Ajouter chaque pièce jointe
            }

            const sendEmailForm = document.getElementById('sendEmailForm');
            sendEmailForm.setAttribute('enctype', 'multipart/form-data');
            sendEmailForm.setAttribute('method', 'post');
            sendEmailForm.setAttribute('action', '/send-emails');

            const emailResponse = await fetch('/send-emails', {
                method: 'POST',
                body: formData
            });

            if (emailResponse.ok) {
                alert('Email envoyé avec succès !');
                // Réinitialiser le formulaire ou effectuer d'autres actions nécessaires
            } else {
                const errorMessage = await emailResponse.text();
                console.error('Erreur lors de l\'envoi de l\'email:', errorMessage);
                alert('Erreur lors de l\'envoi de l\'email: ' + errorMessage);
            }
        } catch (error) {
            console.error('Erreur lors de l\'envoi de l\'email:', error);
            alert('Erreur lors de l\'envoi de l\'email: ' + error.message);
        }
    } else {
        alert('Veuillez sélectionner un template');
    }
}

// Fonction pour charger et afficher les utilisateurs du fichier CSV
async function loadCsvFile() {
    const csvFile = document.getElementById('csvFile').files[0];
    if (csvFile) {
        const formData = new FormData();
        formData.append('csvFile', csvFile);

        const response = await fetch('/upload-csv', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const users = await response.json();
            displayUsers(users);
        } else {
            alert('Erreur lors du chargement du fichier CSV');
        }
    }
}

// Fonction pour afficher les utilisateurs dans la liste
function displayUsers(users) {
    const userList = document.getElementById('userListItems');
    userList.innerHTML = '';

    users.forEach(user => {
        const li = document.createElement('li');
        li.textContent = `Nom: ${user.lastName}, Email: ${user.email}`;
        userList.appendChild(li);
    });
}

// Chargement initial des templates au chargement de la page
window.onload = () => {
    loadTemplates();
};
