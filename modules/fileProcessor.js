const fs = require('fs');
const csv = require('csv-parser');
// function readCsv(fileName) {
//     try {
//         const fileExist = fs.existsSync(fileName);
//         var usersList = [];
//         if (fileExist) {
//             console.log("Start reading : " + fileName);
//             const file = fs.readFileSync(fileName, encoding = "UTF-8");
//             // console.log(data);
//             const csvLines = file.split('\n');

//             for (var i = 0; i < csvLines.length; i++) {
//                 const user = {};
//                 // console.log(`Ligne ${i + 1} ${csvLines[i]}`);
//                 const userDatas = csvLines[i].split(';');
//                 // console.log('Ligne ' + i + ' => ' + userDatas);
//                 user.firstName = userDatas[0].trim();
//                 user.lastName = userDatas[1].trim();
//                 user.email = userDatas[2].trim();

//                 usersList.push(user);
//             }
//             console.log("CSV file readed successfully ! ");
//             return usersList;
//         }

//     } catch (error) {
//         console.error(error);
//     }
// }
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
            // console.log(file);
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