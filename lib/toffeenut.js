const argv = require('minimist')(process.argv.slice(2));
const init = require('../tests/init');
const checkPackageJson = require('../tests/checkPackageJson');

if (argv._){
    if(argv._.length > 1) {
        //throw error. use color -> red
    }
    const commandName = argv._[0];    
    switch(commandName) {
        case 'init':
            init();
            break;
        case 'checkPackageJson':
            checkPackageJson();
            break;
    }
}
