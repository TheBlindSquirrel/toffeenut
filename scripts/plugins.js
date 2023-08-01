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
    if (Array.isArray(config.pluginsArray)) {
        pluginsToCheck.concat(config.pluginsArray);
    }
    const tsFiles = util.getOnlyFiles(config.rootPath, '.ts');
    const regExArr = pluginList.map(p => new RegExp(`^import .+ (${p})$`, 'g'));
    let regex = pluginList.join('|');
    regex = `(${regex})`;
    const regExp = new RegExp(`import\\s+{.+}.+from.+${regex}$`);
    if (Array.isArray(tsFiles)) {        
        /**
         *  need an object to hold the plugin name and how many times the plugin is called. 
         *  Ideally the error message would say "Plugin XXXX is called in 3 files"
         */
        const usedPlugins = {};
        tsFiles.forEach(f => {
            const fileRead = fs.readFileSync(f, 'UTF-8');
            const data = fileRead.split(os.EOL);
            data.forEach(line => {
                
            });
            const matches = new RegExp(regExp);
            /**
             * TODO:
             *      loop over every file
             *      inner loop over every plugin
             *      create a regex that will check if plugin is imported
             *      if plugin is found increase count
             *      add message that "Plugin {..} was imported in {X} files"
             */
            
            console.log(f);
        });
    }
    return msgs;
}

function testLine(regExArr, lineToTest) {
    let msg = undefined;
    regExArr
}

module.exports = pluginsCheck;