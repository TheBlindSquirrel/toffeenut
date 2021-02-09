const fs = require('fs');
const checkPackageJson = require('./checkPackageJson');

const run = function() {
    console.log('====== running toffeenut ==========');
    fs.readFile('./toffeenut.config.json', 'utf8', (err, data) => {
        if (err) {
            console.log(`Error could not load config file`); //display in red
        } else {
            // parse JSON string to JSON object
            const config = JSON.parse(data);
    
            // // print all databases
            if (config) {
                if (config.checkPackageJson && config.checkPackageJson.enabled) {
                    checkPackageJson();
                }
                // console.log(`Config Single Export is enabled: ${config.singleExport.enabled}`);
                // console.log(`Config Single Export allow interfaces: ${config.singleExport.allowInterfaces}`);
            }
        }
    
    });
}

module.exports = run;