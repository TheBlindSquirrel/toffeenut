const fs = require('fs');
const Path = require("path");

function singleExport(path) {
    if (!path) {
        return ["Single Export Path cannot be empty"];
    }
    try{
        const files = getAllFiles(path);
        //TODO: implement test
        console.log('');
    } catch(err) {
        return [
            `Single Export encountered an error`,
            JSON.stringify(err)    
        ];
    }
    console.log('');
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
            if (Path.extname(absolute) === '.ts'){
                return files.push(absolute);
            }
        }
    });
    return files;
}

module.exports = singleExport;