const util = require('./utils');
const pluginList = require('./pluginList');
const fs = require('fs');
const os = require("os");

const pluginsCheck = {
    run,
    processFile,
    generateErrorMessages
};

function run(config) {
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
            const fileRead = fs.readFileSync(f, 'UTF-8');
            usedPlugins = this.processFile(fileRead, pluginsToCheck, pluginMap, usedPlugins)
        });
    }
    const msgs = this.generateErrorMessages(pluginsToCheck, usedPlugins);
    return msgs;
}

function processFile(fileData, pluginsArr, regArr, alreadyUsedPlugins) {
    const data = fileData.split(os.EOL);
    data.filter(l => l && l !== '' && l !== undefined).forEach(line => {                
        pluginsArr.forEach(plugin => {
            const regex = regArr[plugin];
            if(regex) {
                const match = regex.test(line);
                if (match) {
                    if (alreadyUsedPlugins[plugin]) {
                        const count = Number(alreadyUsedPlugins[plugin]);
                        alreadyUsedPlugins[plugin] = (count + 1);
                    } else {
                        alreadyUsedPlugins[plugin] = 1;
                    }
                }
            }
        });
    });
    return alreadyUsedPlugins;
}

function generateErrorMessages(pluginsArr, pluginCountObj) {
    const msgs = [];
    if (Array.isArray(pluginsArr) && pluginsArr.length > 0 && pluginCountObj) {
        pluginsArr.forEach(p => {
            if(pluginCountObj[p]) {
                const count = Number(pluginCountObj[p]);
                if (count > 1) {
                    msgs.push(`Plugin ${p} is referenced in ${count} files.`);
                }
            }
        });
    }
    return msgs;
}

module.exports = pluginsCheck;