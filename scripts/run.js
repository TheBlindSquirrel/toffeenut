const fs = require('fs');
const colors = require('colors');
const { exit } = require('process');
const checkPackageJson = require('./checkPackageJson');
const singleExport = require('./singleExport');
const hexColors = require('./hexColors');

const run = function() {
    console.log('====== running toffeenut ==========', colors.black);
    var errorMsg = [];
    try {
        const file = fs.readFileSync('./toffeenut.config.json', 'utf8');
        const config = JSON.parse(file);
        if (config.checkPackageJson && (config.checkPackageJson.enabled || config.checkPackageJson.enabled === undefined)) {
            errorMsg = errorMsg.concat(checkPackageJson());
        }
        if (config.singleExport && (config.singleExport.enabled || config.singleExport.enabled === undefined)) {
            errorMsg = errorMsg.concat(singleExport(config.singleExport.rootPath));
        }
        if(config.hexColors && (config.hexColors.enabled)) {
            errorMsg = errorMsg.concat(hexColors(config.hexColors.colorsFilePath));
        }
    } catch(_) {
        errorMsg.push('Error loading toffeenut config file');
    }
    if (errorMsg.length > 0) {
        errorMsg.forEach(msg => {
            console.log(msg, colors.red);
        });
        exit -1;
    } else {
        console.log('All Tests Passed', colors.green);
        exit;
    }
}

module.exports = run;