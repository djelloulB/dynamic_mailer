const nodeMailer = require('nodemailer')
require('dotenv').config()

function sendEmail(users, html){
    return new Promise((resolve, reject) => {
        const transporter = nodeMailer.createTransport({
            host: process.env.APP_HOST,
            port: process.env.APP_PORT,
            secure: true,
            auth: {
                user: process.env.APP_USER,
                pass: process.env.APP_PWD,
            }
        });
        const mail_configs = {
            from: process.env.APP_INFO_FROM,
            to: users[i].email,
            subject:  process.env.APP_INFO_SUBJECT,
            html : html, 
            attachments : [ {
                filename: 'Lettre_CACI.pdf',
                path: './attachements/Lettre_CACI.pdf',
                },
                {
                filename: 'dossier_presse.pdf',
                path: './attachements/dossier_presse.pdf',
                },
                {
                filename: 'logo-salon.png',
                path: './attachements/logo-salon.png',
                cid: '@logo'
                }
            ]
        };
        transporter.sendMail(mail_configs, (err, info) => {
            if (err) {
                console.error(err);
                return reject({message: 'An error has occured !'});
            }
            return resolve({message: 'Email sent succesfully !'})
        });
    });
}

module.exports = { sendEmail };