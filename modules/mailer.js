const nodeMailer = require('nodemailer');
require('dotenv').config();

/**
 * Envoie des emails avec des templates HTML personnalisés.
 * @param {Array} users - Liste des utilisateurs avec des emails et des prénoms.
 * @param {string} html - Template HTML de l'email.
 */
async function sendMail(users, html) {
    const transporter = nodeMailer.createTransport({
        host: process.env.APP_HOST,
        port: process.env.APP_PORT,
        secure: true,
        auth: {
            user: process.env.APP_USER,
            pass: process.env.APP_PWD,
        }
    });

    for (let i = 0; i < users.length; i++) {
        console.log("email : " + users[i].email);
        let personalizedHtml = html.replace(/%Nom%/g, users[i].firstName);

        try {
            const info = await transporter.sendMail({
                from: process.env.APP_INFO_FROM,
                to: users[i].email,
                subject: process.env.APP_INFO_SUBJECT,
                html: personalizedHtml,
                attachments: [
                    {
                        filename: 'Lettre_CACI.pdf',
                        path: './attachements/Lettre_CACI.pdf',
                    },
                    {
                        filename: 'dossier_presse.pdf',
                        path: './attachements/dossier_presse.pdf',
                    },
                    {
                        filename: 'logo-salon.png',
                        path: 'attachements\\logo-salon.png',
                        cid: 'logo'
                    }
                ]
            });
            console.log(`Message envoyé: ${info.messageId}`);
        } catch (error) {
            console.error(`Erreur d'envoi de l'email à ${users[i].email}: ${error}`);
        }
    }
}

async function sendMailWithAttachments(users, html, attachments) {
    const transporter = nodeMailer.createTransport({
        host: process.env.APP_HOST,
        port: process.env.APP_PORT,
        secure: true,
        auth: {
            user: process.env.APP_USER,
            pass: process.env.APP_PWD,
        }
    });

    for (let i = 0; i < users.length; i++) {
        console.log("email : " + users[i].email);
        let personalizedHtml = html.replace(/%Nom%/g, users[i].firstName);

        const mailOptions = {
            from: process.env.APP_INFO_FROM,
            to: users[i].email,
            subject: process.env.APP_INFO_SUBJECT,
            html: personalizedHtml,
            attachments: attachments.map(file => ({
                filename: file.originalname,
                path: file.path,
                cid: file.fieldname === 'logo' ? 'logo' : undefined
            }))
        };

        try {
            const info = await transporter.sendMail(mailOptions);
            console.log(`Message envoyé: ${info.messageId}`);
        } catch (error) {
            console.error(`Erreur d'envoi de l'email à ${users[i].email}: ${error}`);
        }
    }
}

module.exports = {
    sendMailWithAttachments, sendMail
};


