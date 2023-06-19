import fs from 'fs';
import { ICheckPackageJsonConfig } from '../models/ICheckPackageJsonConfig';

export default class CheckPackageJson {
    constructor(){}
    
    public run(config: ICheckPackageJsonConfig): string[] {
        let errorMessages: string[] = [];
        config.packagePath = config.packagePath ?? '';
        config.packagePath = config.packagePath.trim();
        if (!config.packagePath) {
            return ["Package Path is required"]
        }
        try {
            const file = fs.readFileSync(config.packagePath).toString();
            const jsonConfig = JSON.parse(file);
            const dependencies = jsonConfig.dependencies;
            const errors = this.checkDependencies(dependencies, config);
            const devDependencies = jsonConfig.devDependencies;
            const devErrors = this.checkDependencies(devDependencies, config);
            errorMessages = errorMessages.concat(errors, devErrors);
        } catch (error) {
            errorMessages.push('Error loading package.json');
        }
        return errorMessages;
    }

    
public checkDependencies(dependencies: { [key:string]: string }, testConfig: ICheckPackageJsonConfig): string[] {
    const msgs: string[] = [];
    const regex = new RegExp('([-^~><||])');
    if(dependencies) {
        const packages = Reflect.ownKeys(dependencies);
        for(var i = 0; i < packages.length; i++) {
            const packageName = packages[i].toString();
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
}