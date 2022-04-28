const fs = require('fs');
const Path = require("path");

function hexColors(config) {
    if (!config.colorsFilePath) {
        return ["Hex Colors File Path cannot be empty"];
    }
    if (!config.rootPath) {
        return ["Hex Colors root path cannot be empty"];
    }
    try{
        var files = getAllFiles(config.rootPath);
        files = files.filter(x => Path.resolve(x) != Path.resolve(config.colorsFilePath));
        if (!config.checkHTML) {
            files = files.filter(x => Path.extname(x) !== '.html' && Path.extname(x) !== '.htm');
        }
        if(config.ignoreDirectory) {
            files = files.filter(x => Path.dirname(Path.resolve(x)) != Path.resolve(config.ignoreDirectory));
        }
        files.forEach(f => {
            checkForHexColors(f);
            if (config.checkForRGBA) {
                checkForRGBA(f);
            }
        });
    } catch(err) {
        return[JSON.stringify(err)];
    }
}

function checkForHexColors(filePath) {
    console.log('checking for hex colors');
}

function checkForRGBA(filePath) {
    console.log('checking for RGBA colors');
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
            if (Path.extname(absolute) !== '.ts'){
                return files.push(absolute);
            }
        }
    });
    return files;
}

module.exports = hexColors;