const fs = require('fs');
const semverRegex = require('semver-regex');

function checkPackageJson() {
    const specialCharacters = ['^', '~', '>', '>=', '<', '<=', '-', '||'];
    console.log('checking package.json ....');
    fs.readFile('./package.json', 'utf8', (err, data) => {
        if (err) {
            return ['could not load package.json'];
        } else {
            const config = JSON.parse(data);
        }
    });
}

module.exports = checkPackageJson;