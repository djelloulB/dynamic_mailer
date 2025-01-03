const fs = require('fs');
const csv = require('csv-parser');

// function readCsv (filePath) {
//     return new Promise((resolve, reject) => {
//         const users = [];
//         fs.createReadStream(filePath)
//         .pipe(csv({ separator: ';', headers: ['firstName', 'lastName', 'email'] }))
//         .on('data', (row) => {
//             users.push(row);
//         })
//         .on('end', () => {
//             resolve(users);
//         })
//         .on('error', (error) => {
//             reject(error);
//         });
//     });
// }

/**
 * Lecture d'un fichier CSV et extraction des utilisateurs
 * @param {string} filePath Chemin du fichier CSV
 * @param {Object} options Options pour la lecture du CSV
 * @returns {Promise<Array>} Une promesse qui résout en une liste d'utilisateurs
 */
function readCsv(filePath, options = {}) {
    const defaultOptions = {
        separator: ';',
        headers: ['firstName', 'lastName', 'email'],
        ...options, // Fusionne les options par défaut avec celles fournies
    };

    return new Promise((resolve, reject) => {
        try {
            const users = [];
            fs.createReadStream(filePath)
                .pipe(csv(defaultOptions))
                .on('data', (row) => {
                    // Validation des données
                    if (row.email) { // S'assure qu'un email est présent
                        users.push(row);
                    } else {
                        console.warn(`Données incomplètes ignorées : ${JSON.stringify(row)}`);
                    }
                })
                .on('end', () => {
                    console.log(`Lecture terminée : ${users.length} utilisateur(s) chargé(s).`);
                    resolve(users);
                })
                .on('error', (error) => {
                    console.error('Erreur lors de la lecture du fichier CSV:', error.message);
                    reject(error);
                });
        } catch (error) {
            console.error('Une erreur s\'est produite:', error.message);
            reject(error);
        }
    });
}

function readFile(fileName) {
    try {
        const fileExist = fs.existsSync(fileName);
        if (fileExist) {
            console.log("Start reading : " + fileName);
            const file = fs.readFileSync(fileName, encoding="UTF-8");
            
            console.log("File readed successfully ! ");
            return file
        } else {
            console.log("File not exist ! ");
        }
    } catch (error) {
        console.error(error);
    }
}

// var readHTMLFile = function(path, callback) {

//     const file = fs.readFileSync(path, {encoding: 'utf-8'});
// };

module.exports = { readCsv, readFile};