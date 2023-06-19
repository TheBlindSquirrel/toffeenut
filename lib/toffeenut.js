const argv = require('minimist')(process.argv.slice(2));
const init = require('../scripts/init');
const run = require('../scripts/run');

if (argv._){
    if(argv._.length > 1) {
        //throw error. use color -> red
    }
    const commandName = argv._[0];    
    switch(commandName) {
        case 'init':
            init();
            break;
        case 'run':
            run.go();
            break;
    }
}
