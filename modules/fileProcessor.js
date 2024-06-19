const fs = require('fs');
const csv = require('csv-parser');

function readCsv (filePath) {
    return new Promise((resolve, reject) => {
        const users = [];
        fs.createReadStream(filePath)
        .pipe(csv({ separator: ';', headers: ['firstName', 'lastName', 'email'] }))
        .on('data', (row) => {
            users.push(row);
        })
        .on('end', () => {
            resolve(users);
        })
        .on('error', (error) => {
            reject(error);
        });
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