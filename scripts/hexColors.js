const fs = require('fs');
const Path = require("path");
const os = require("os");

function hexColors(config) {
    if (!config.colorsFilePath) {
        return ["Hex Colors File Path cannot be empty"];
    }
    if (!config.rootPath) {
        return ["Hex Colors root path cannot be empty"];
    }
    try{
        var files = getAllFiles(config.rootPath);
        var messages = [];
        files = files.filter(x => Path.resolve(x) != Path.resolve(config.colorsFilePath));
        if (!config.checkHTML) {
            files = files.filter(x => Path.extname(x) !== '.html' && Path.extname(x) !== '.htm');
        }
        if(config.ignoreDirectory) {
            files = files.filter(x => Path.dirname(Path.resolve(x)) != Path.resolve(config.ignoreDirectory));
        }
        files.forEach(f => {
            const fileName = Path.basename(f);
            const fileRead = fs.readFileSync(f, 'UTF-8');
            const data = fileRead.split(os.EOL);
            data.forEach(l => {
                const result = validateLine(l, config);
                if(!result.isValid) {
                    result.errorMessages.forEach(msg => {
                        messages.push(`${fileName} ${msg}`);
                    });
                }
            });
        });
        return messages;
    } catch(err) {
        return[JSON.stringify(err)];
    }
}

function validateLine(line, config) {
    const result = {
        isValid: true,
        errorMessages: []
    };
    const hexError = checkForHexColors(line);
    let rgbError = '';
    if (config.checkForRGBA) {
        rgbError = checkForRGBA(line);
    }
    if(hexError) {
        result.isValid = false;
        result.errorMessages.push(hexError);
    }
    if(rgbError) {
        result.isValid = false;
        result.errorMessages.push(rgbError);
    }
    return result;
}

function checkForHexColors(line) {
    let errorMessage = '';
    const regex = new RegExp('#([0-9]{0,6}|[a-f]{0,6}){0,6}([0-9|a-f]){0,2};?');
    if(regex.test(line)) {
        const split = line.split(':');
        errorMessage = `${split[0].trim()} has a hex color defined`;
    }
    return errorMessage;
}

function checkForRGBA(line) {
    let errorMessage = '';
    const regex = new RegExp('(rgb)?a?\\\(?(\\\d{1,3},\\\s?){2}(\\\d{1,3})(,?\\\s?[0|1]?.?\\\d?)\\\)?');
    if(regex.test(line)) {
        const split = line.split(':');
        errorMessage = `${split[0].trim()} has a rgb/rgba color defined`;
    }
    return errorMessage;
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