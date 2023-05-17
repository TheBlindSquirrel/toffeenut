const fs = require('fs');

function checkPackageJson(testConfig) {
    let errorMessages = [];
    try {
        const file = fs.readFileSync('./package.json');
        const config = JSON.parse(file);
        const dependencies = config.dependencies;
        const errors = checkDependencies(dependencies, testConfig);
        const devDependencies = config.devDependencies;
        const devErrors = checkDependencies(devDependencies, testConfig);
        errorMessages = errorMessages.concat(errors, devErrors);
    } catch (error) {
        errorMessages.push('Error loading package.json');
    }
    return errorMessages;
}

function checkDependencies(dependencies, testConfig) {
    const msgs = [];
    const regex = new RegExp('([-^~><||])');
    if(dependencies) {
        const packages = Reflect.ownKeys(dependencies);
        for(var i = 0; i < packages.length; i++) {
            const packageName = packages[i];
            const version = dependencies[packageName];
            const match = regex.test(version);
            if(version.startsWith('git')) {
                if (testConfig.allowGithub) {
                    continue;
                } else {
                    msgs.push(`Package ${packageName} is set to a git URL and git is not allowed.`);
                    continue;
                }
            }
            if(match) {
                msgs.push(`Package ${packageName} : ${version} is not pinned`);
            }
        }
    }
    return msgs;
}

module.exports = checkPackageJson;