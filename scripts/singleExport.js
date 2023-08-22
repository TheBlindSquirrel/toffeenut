const fs = require('fs');
const Path = require("path");
const util = require('./utils');

const singleExport = {
    run,
    validateFile
}

function run(config) {
    if(config.rootPath) {
        config.rootPath = config.rootPath.trim();
    }
    if (!config.rootPath) {
        return ["Single Export Path cannot be empty"];
    }
    try{
        const errorMessages = [];
        let files = util.getAllFiles(config.rootPath, ['.html', '.htm', '.scss', '.css', '.js', '.json']);
        files = files.filter(x => Path.extname(x) === '.ts');
        files.forEach(file => {
            const fileName = Path.basename(file);
            const fileData = fs.readFileSync(file, 'UTF-8');
            const msg = this.validateFile(fileData, fileName);
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

module.exports = singleExport;