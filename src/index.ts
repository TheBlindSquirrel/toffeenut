import CheckPackageJson from './checkPackageJson';
import HexColors from './hexColors';
import Run from './run';
import SingleExport from './singleExport';

const errorMsgs: string[] = [];
const checkPJ = new CheckPackageJson();
const hexColors = new HexColors();
const singleExport = new SingleExport();
const r = new Run(checkPJ, singleExport, hexColors);

// errorMsgs.concat(checkPJ.run({
//     "enabled": false,
//     "allowGithub": true,
//     "requireGitCommit": false,
//     "packagePath": "./testFiles/package.json"
// }));

errorMsgs.forEach(msg => {
    console.error(msg);
});