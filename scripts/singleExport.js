const fs = require('fs');
const Path = require("path");

function singleExport(config) {
    if (!config.rootPath) {
        return ["Single Export Path cannot be empty"];
    }
    try{
        const errorMessages = [];
        const files = getAllFiles(config.rootPath);
        files.forEach(file => {
            const fileName = Path.basename(file);
            const fileData = fs.readFileSync(file, 'UTF-8');
            const msg = validateFile(fileData, fileName);
            if(msg) {
                errorMessages.push(msg);
            }
        });

        return errorMessages;
    } catch(err) {
        return [
            `Single Export encountered an error: ${JSON.stringify(err)}`
        ];
    }
}

function validateFile(fileData, fileName) {
    let errorMsg = undefined;
   const regexArr = [new RegExp('(export\\s+default\\s+interface)', 'g'), new RegExp('(export\\s+default\\s+class)', 'g'), new RegExp('(export\\s+interface)', 'g'), new RegExp('(export\\s+class)', 'g')];
   let matchCount = 0;
   regexArr.forEach(r => {
    if(r.test(fileData)) {
        matchCount++;
    }
   });
    if(matchCount > 1) {
        errorMsg = `${fileName} has multiple interface or class exports`;
    }
    return errorMsg;
}

function getAllFiles(path) {
    let files = []
    fs.readdirSync(path).forEach(File => {
        const absolute = Path.join(path, File);
        const stats = fs.statSync(absolute);
        if (stats.isDirectory()) {
            files = files.concat(getAllFiles(absolute));
            return files;
        }
        else {
            if (Path.extname(absolute) === '.ts' && !absolute.endsWith('.spec.ts')){
                return files.push(absolute);
            }
        }
    });
    return files;
}

module.exports = singleExport;