const fs = require('fs');
const checkPackageJson = require('./checkPackageJson');
const toffeenutconfig = require('../models/toffeenut.config');

const run = function() {
    console.log('======running toffeenut ==========');
    fs.readFile('./toffeenut.config.json', 'utf8', (err, data) => {

        if (err) {
            console.log(`Error could not load config file`); //display in red
        } else {
            let config = new toffeenutconfig();
            const configJSON = Object.assign(config, data);
            // parse JSON string to JSON object
            // const databases = JSON.parse(data);
    
            // // print all databases
            if (config) {
                console.log(`Config Check PackageJson is enabled: ${config.checkPackageJson.enabled}`);

                console.log(`Config Single Export is enabled: ${config.singleExport.enabled}`);
                console.log(`Config Single Export allow interfaces: ${config.singleExport.allowInterface}`);
            }
            // databases.forEach(db => {
            //     console.log(`${db.name}: ${db.type}`);
            // });
        }
    
    });
}

module.exports = run;