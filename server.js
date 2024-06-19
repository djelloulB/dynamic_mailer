const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const fp = require('./modules/fileProcessor');
const mailer = require('./modules/mailer');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Middleware pour parser les données JSON et les données de formulaire
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir les fichiers statiques
app.use(express.static('public'));

// Route pour envoyer les emails avec pièces jointes
app.post('/send-emails', upload.fields([
    { name: 'attachments', maxCount: 10 },
    { name: 'csvFile' }
]), async (req, res) => {
    try {
        const htmlTemplateName = req.body.htmlTemplate;
        const csvFilePath = req.files['csvFile'][0].path;
        const attachments = req.files['attachments'] || [];

        // Lire le contenu du fichier HTML
        const htmlTemplatePath = path.join(__dirname, 'templates', htmlTemplateName);
        if (!fs.existsSync(htmlTemplatePath)) {
            throw new Error(`Le template HTML n'existe pas : ${htmlTemplateName}`);
        }

        const htmlTemplate = fs.readFileSync(htmlTemplatePath, 'utf8');

        // Lire les utilisateurs depuis le fichier CSV
        const users = await fp.readCsv(csvFilePath);

        // Envoyer les emails avec pièces jointes
        await mailer.sendMailWithAttachments(users, htmlTemplate, attachments);

        res.send('Emails envoyés avec succès !');
    } catch (error) {
        console.error('Erreur lors de l\'envoi des emails:', error);
        res.status(500).send('Erreur lors de l\'envoi des emails: ' + error.message);
    }
});

// Route pour enregistrer un template
app.post('/save-template', (req, res) => {
    const { name, content } = req.body;
    let templates = JSON.parse(fs.readFileSync('templates.json', 'utf8'));

    const newId = templates.length ? templates[templates.length - 1].id + 1 : 1;
    const newFileName = `template${newId}.html`;

    const newTemplate = {
        id: newId,
        name,
        file: newFileName
    };

    templates.push(newTemplate);
    fs.writeFileSync('templates.json', JSON.stringify(templates, null, 2));

    // Enregistrer le contenu HTML dans un fichier
    fs.writeFileSync(path.join(__dirname, 'templates', newFileName), content);

    res.send('Template enregistré avec succès !');
});

// Route pour récupérer les templates
app.get('/get-templates', (req, res) => {
    const templates = JSON.parse(fs.readFileSync('templates.json', 'utf8'));
    res.json(templates);
});

// Route pour récupérer le contenu d'un template
app.get('/get-template-content/:fileName', (req, res) => {
    try {
        const { fileName } = req.params;
        const content = fs.readFileSync(path.join(__dirname, 'templates', fileName), 'utf8');
        res.send(content);
        
    } catch (error) {
        console.error('Erreur lors de la récupération du contenu du template:', error);
        res.status(500).send('Erreur lors de la récupération du contenu du template: ' + error.message);
    }
});

// Nouvelle route pour charger le fichier CSV et renvoyer la liste des utilisateurs
app.post('/upload-csv', upload.single('csvFile'), async (req, res) => {
    try {
        const csvFilePath = req.file.path;
        const users = await fp.readCsv(csvFilePath);
        
        res.json(users);
    } catch (error) {
        res.status(500).send('Erreur lors du chargement du fichier CSV: ' + error.message);
    }
});

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
