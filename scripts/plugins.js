const util = require('./utils');
const pluginList = require('./pluginList');
const fs = require('fs');
const os = require("os");

const pluginsCheck = {
    run,
    processFile
};

function run(config) {
    let msgs = [];
    if(config.rootPath) {
        config.rootPath = config.rootPath.trim();
    }
    if (!config.rootPath) {
        return ["Plugins Only Called Once root path cannot be empty"];
    }
    const pluginsToCheck = [...pluginList];
    if (Array.isArray(config.pluginsArray) && config.pluginsArray.length > 0) {
        pluginsToCheck.push(...config.pluginsArray);
    }
    const tsFiles = util.getOnlyFiles(config.rootPath, '.ts');
    const pluginMap = {};
    pluginsToCheck.forEach(p => pluginMap[p] = new RegExp(`${p}`, 'g'));
    let usedPlugins = {};
    if (Array.isArray(tsFiles)) {
        tsFiles.forEach(f => {
            usedPlugins = this.processFile(f, pluginsToCheck, pluginMap, usedPlugins)
        });
    }
    pluginsToCheck.forEach(p => {
        if(usedPlugins[p]) {
            const count = Number(usedPlugins[p]);
            if (count > 1) {
                msgs.push(`Plugin ${p} is referenced in ${count} files.`);
            }
        }
    });
    return msgs;
}

function processFile(path, pluginsArr, regArr, alreadyUsedPlugins) {
    const fileRead = fs.readFileSync(path, 'UTF-8');
    const data = fileRead.split(os.EOL);
    data.filter(l => l && l !== '' && l !== undefined).forEach(line => {                
        pluginsArr.forEach(plugin => {
            const regex = regArr[plugin];
            const match = regex.test(line);
            if (match) {
                if (alreadyUsedPlugins[plugin]) {
                    const count = Number(alreadyUsedPlugins[plugin]);
                    alreadyUsedPlugins[plugin] = (count + 1);
                } else {
                    alreadyUsedPlugins[plugin] = 1;
                }
            }
        });
    });
    return alreadyUsedPlugins;
}

module.exports = pluginsCheck;