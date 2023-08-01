const util = require('./utils');
const pluginList = require('./pluginList');
const fs = require('fs');
const os = require("os");

const pluginsCheck = {
    run
};

function run(config) {
    let msgs = [];
    if(config.rootPath) {
        config.rootPath = config.rootPath.trim();
    }
    if (!config.rootPath) {
        return ["Plugins Only Called Once root path cannot be empty"];
    }
    const pluginsToCheck = pluginList;
    if (Array.isArray(config.pluginsArray) && config.pluginsArray.length > 0) {
        pluginsToCheck.push(...config.pluginsArray);
    }
    const tsFiles = util.getOnlyFiles(config.rootPath, '.ts');
    const pluginMap = {};
    pluginList.forEach(p => pluginMap[p] = new RegExp(`${p}`, 'g'));
    const usedPlugins = {};
    if (Array.isArray(tsFiles)) {
        tsFiles.forEach(f => {
            const fileRead = fs.readFileSync(f, 'UTF-8');
            const data = fileRead.split(os.EOL);
            data.filter(l => l && l !== '' && l !== undefined).forEach(line => {                
                pluginList.forEach(plugin => {
                    const regex = pluginMap[plugin];
                    const match = regex.test(line);
                    if (match) {
                        if (usedPlugins[plugin]) {
                            const count = Number(usedPlugins[plugin]);
                            usedPlugins[plugin] = (count + 1);
                        } else {
                            usedPlugins[plugin] = 1;
                        }
                    }
                });
            });
        });
    }
    pluginList.forEach(p => {
        if(usedPlugins[p]) {
            const count = Number(usedPlugins[p]);
            if (count > 1) {
                msgs.push(`Plugin ${p} is referenced in ${count} files.`);
            }
        }
    });
    return msgs;
}

module.exports = pluginsCheck;