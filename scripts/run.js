const fs = require('fs');
const checkPackageJson = require('./checkPackageJson');
const singleExport = require('./singleExport');
const hexColors = require('./hexColors');
const pluginOnlyOnce = require('./plugins');

const run = {
    go, 
    exit
}

function go() {
    console.info('====== running toffeenut ==========');
    var errorMsg = [];
    var exitCode = 0;
    try {
        const file = fs.readFileSync('./toffeenut.config.json', 'utf8');
        const config = JSON.parse(file);
        const checkPackageEnabled = config.checkPackageJson && (config.checkPackageJson.enabled || config.checkPackageJson.enabled === undefined);
        const singleExportEnabled = config.singleExport && (config.singleExport.enabled || config.singleExport.enabled === undefined);
        const hexColorsEnabled = config.hexColors && (config.hexColors.enabled || config.hexColors.enabled === undefined);
        const pluginsOnlyOnceEnabled = config.pluginOnlyCalledOnce && (config.pluginOnlyCalledOnce.enabled || config.pluginOnlyCalledOnce.enabled === undefined);
        if (checkPackageEnabled) {
            errorMsg = errorMsg.concat(checkPackageJson.run(config.checkPackageJson));
        }
        if (singleExportEnabled) {
            errorMsg = errorMsg.concat(singleExport.run(config.singleExport));
        }
        if (hexColorsEnabled) {
            errorMsg = errorMsg.concat(hexColors.run(config.hexColors));
        }
        if (pluginsOnlyOnceEnabled) {
            errorMsg = errorMsg.concat(pluginOnlyOnce.run(config.pluginOnlyCalledOnce));
        }
        if (!checkPackageEnabled && !singleExportEnabled && !hexColorsEnabled && !pluginsOnlyOnceEnabled) {
            console.warn("Toffeenut loaded but not tests were enabled.".yellow);
            this.exit(exitCode);
        }
    } catch(_) {
        errorMsg.push('Error loading toffeenut config file'.red);
    }
    if (errorMsg.length > 0) {
        errorMsg.forEach(msg => {
            console.error(msg.red);
        });
        console.error("\r");
        console.error(`Total Errors Found: ${errorMsg.length}`.red);
        exitCode = 1;
    } else {
        console.info('All Tests Passed'.green);
    }
    this.exit(exitCode);
}

function exit(code) {
    code = code ?? 0;
    console.info('====== toffeenut complete ==========');
    process.exit(code);
}

module.exports = run;