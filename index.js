//this script is only used for debugging. comment out or change the called script as needed.
const checkPackageJson = require('./scripts/checkPackageJson');
const run = require('./scripts/run');
const singleExport = require('./scripts/singleExport');
const hexColors = require('./scripts/hexColors');

// run();
checkPackageJson({
    "enabled": false,
    "allowGithub": true,
    "requireGitCommit": false
});
// singleExport('./testFiles/singleExport');
// hexColors( {
//     "enabled": true,
//     "colorsFilePath": "./testFiles/hexColors/colorFile.scss",
//     "checkHTML": false,
//     "checkForRGBA": false,
//     "ignoreDirectory": "./testFiles/hexColors/ignoreThisFolder",
//     "rootPath": "./testFiles/hexColors"
// });