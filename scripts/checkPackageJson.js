const fs = require('fs');

const checkPackageJson = {
    run,
    checkDependencies
}

function run(testConfig) {
    let errorMessages = [];
    testConfig.packagePath = testConfig.packagePath ?? '';
    testConfig.packagePath = testConfig.packagePath.trim();
    if (!testConfig.packagePath) {
        return ["Package Path is required"]
    }
    try {
        const file = fs.readFileSync(testConfig.packagePath);
        const config = JSON.parse(file);
        const dependencies = config.dependencies;
        const errors = this.checkDependencies(dependencies, testConfig);
        const devDependencies = config.devDependencies;
        const devErrors = this.checkDependencies(devDependencies, testConfig);
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
                    if(testConfig.requireGitCommit) {
                        const gitCommitRegex = new RegExp('#\\w+$');
                        const commitMatch = gitCommitRegex.test(version);
                        if (commitMatch) {
                            continue;
                        }
                        msgs.push(`Package ${packageName} is not set to a git commit.`);
                    } else {
                        continue;
                    }
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