const util = require('./utils');
const pluginList = require('./pluginList');

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
    /**
     * TODO:
     *      get all ts files
     *      loop over every file
     *      inner loop over every plugin
     *      create a regex that will check if plugin is imported
     *      if plugin is found increase count
     *      add message that "Plugin {..} was imported in {X} files"
     */
    return msgs;
}

module.exports = pluginsCheck;