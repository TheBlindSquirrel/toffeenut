const fs = require('fs');
const Path = require("path");

const utils = {
    getAllFiles,
    getOnlyFiles
}

function getAllFiles(path, ignoreExtensions) {
    let files = []
    const alwaysIgnoredFileExt = ['.eot', '.svg', '.ttf', '.woff', '.png'];
    if(!Array.isArray(ignoreExtensions)) {
        ignoreExtensions = [];
    }
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(File => {
            const absolute = Path.join(path, File);
            const stats = fs.statSync(absolute);
            if (stats.isDirectory()) {
                const dirName = Path.basename(absolute);
                if (dirName.toLocaleLowerCase() === 'node_modules') {
                    return files;
                }
                files = files.concat(this.getAllFiles(absolute, ignoreExtensions));
                return files;
            }
            else {
                const extension = Path.extname(absolute);
                if(!ignoreExtensions.includes(extension) && !alwaysIgnoredFileExt.includes(extension)) {
                    files.push(absolute);
                }
            }
        });
    }
    return files;
}

function getOnlyFiles(path, extension) {
    const files = this.getAllFiles(path, []);
    return files.filter(f => Path.extname(f) === extension && !f.toString().endsWith('.spec.ts'));
}

module.exports = utils;