//this script is only used for debugging. comment out or change the called script as needed.
const checkPackageJson = require('./scripts/checkPackageJson');
const run = require('./scripts/run');
const singleExport = require('./scripts/singleExport');
const hexColors = require('./scripts/hexColors');

// checkPackageJson();
// run();
// singleExport('./testFiles/singleExport');
hexColors('./testFiles/hexColors/colorFile.scss', './testFiles/hexColors');