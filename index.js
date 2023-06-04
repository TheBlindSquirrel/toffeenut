//this script is only used for debugging. comment out or change the called script as needed.
const checkPackageJson = require('./scripts/checkPackageJson');
const run = require('./scripts/run');
const singleExport = require('./scripts/singleExport');
const hexColors = require('./scripts/hexColors');

run.go()
// const errorMsg = checkPackageJson.run({
//     "enabled": false,
//     "allowGithub": true,
//     "requireGitCommit": false,
//     "packagePath": "./testFiles/package.json"
// });
// const errorMsg = singleExport.run({
//     'enabled': true,
//     'rootPath': './testFiles/singleExport'
// });
// const errorMsg = hexColors.run( {
//     "enabled": true,
//     "colorsFilePath": "./testFiles/hexColors/colorFile.scss",
//     "checkHTML": true,
//     "checkForRGBA": true,
//     "ignoreFiles": ["./testFiles/hexColors/ignoreThisFolder", "./testFiles/hexColors/ignoreThisFile.scss"],
//     "rootPath": "./testFiles/hexColors"
// });

errorMsg.forEach(msg => {
    console.error(msg.red);
});

if (errorMsg.length > 0) {
    console.error(`Total Errors: ${errorMsg.length}`.red);
}