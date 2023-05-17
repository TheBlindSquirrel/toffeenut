const fs = require('fs');
const colors = require('colors');
const { exit } = require('process');
const checkPackageJson = require('./checkPackageJson');
const singleExport = require('./singleExport');
const hexColors = require('./hexColors');

const run = function() {
    console.info('====== running toffeenut ==========');
    var errorMsg = [];
    const exitCode = 0;
    try {
        const file = fs.readFileSync('./toffeenut.config.json', 'utf8');
        const config = JSON.parse(file);
        const checkPackageEnabled = config.checkPackageJson && (config.checkPackageJson.enabled || config.checkPackageJson.enabled === undefined);
        const singleExportEnabled = config.singleExport && (config.singleExport.enabled || config.singleExport.enabled === undefined);
        const hexColorsEnabled = config.hexColors && (config.hexColors.enabled || config.hexColors.enabled === undefined);
        if (checkPackageEnabled) {
            errorMsg = errorMsg.concat(checkPackageJson(config.checkPackageJson));
        }
        if (singleExportEnabled) {
            errorMsg = errorMsg.concat(singleExport(config.singleExport.rootPath));
        }
        if (hexColorsEnabled) {
            errorMsg = errorMsg.concat(hexColors(config.hexColors));
        }
        if (!checkPackageEnabled && !singleExportEnabled && !hexColorsEnabled) {
            console.warn("Toffeenut loaded but not tests were enabled.".yellow);
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

    console.info('====== toffeenut complete ==========');
    process.exit(exitCode);
}

module.exports = run;