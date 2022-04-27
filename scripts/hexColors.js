const fs = require('fs');
const Path = require("path");

function hexColors(colorsFilePath, rootPath) {
    if (!colorsFilePath) {
        return ["Hex Colors File Path cannot be empty"];
    }
    if (!rootPath) {
        return ["Hex Colors root path cannot be empty"];
    }
    try{
        const files = getAllFiles(rootPath);
        console.log('');
    } catch(err) {
        console.log('');//return err
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
            return files.push(absolute);
        }
    });
    return files;
}

module.exports = hexColors;