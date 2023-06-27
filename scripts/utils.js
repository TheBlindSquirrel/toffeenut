const fs = require('fs');
const Path = require("path");

const utils = {
    getAllFiles
}

function getAllFiles(path, ignoreExtensions) {
    let files = []
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(File => {
            const absolute = Path.join(path, File);
            const stats = fs.statSync(absolute);
            if (stats.isDirectory()) {
                files = files.concat(this.getAllFiles(absolute, ignoreExtensions));
                return files;
            }
            else {
                const extension = Path.extname(absolute);
                if(Array.isArray(ignoreExtensions)) {
                    if(!ignoreExtensions.includes(extension)) {
                        files.push(absolute);
                    }
                } else {
                    files.push(absolute);
                }
            }
        });
    }
    return files;
}

module.exports = utils;