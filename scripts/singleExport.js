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
    /**
     * TODO: create 1 regex for interface and 1 for class.
     *  if both have a match OR if either have mutliple matches fail the test
    */
    const regEx = new RegExp('\\b(?:export)\\b\\s+(?:default)?\\s+(?:interface)?|(?:class)+');
    const matches = Array.from(regEx.exec(fileData));
    console.log('');
    if(matches.length > 1) {
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
            //TODO: ignore all spec.ts files
            if (Path.extname(absolute) === '.ts'){
                return files.push(absolute);
            }
        }
    });
    return files;
}

module.exports = singleExport;