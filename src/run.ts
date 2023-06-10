const singleExport = require('../scripts/singleExport');
const hexColors = require('../scripts/hexColors');
import fs from 'fs';
import CheckPackageJson from './checkPackageJson';
import { Color } from 'colors';

export default class Run {
    public go(): void {
        console.info('====== running toffeenut ==========');
        let errorMsg: string[] = [];
        let exitCode: number = 0;
        const checkPackage = new CheckPackageJson();
        try {
            const file = fs.readFileSync('./toffeenut.config.json', 'utf8');
            const config = JSON.parse(file);
            const checkPackageEnabled = config.checkPackageJson && (config.checkPackageJson.enabled || config.checkPackageJson.enabled === undefined);
            const singleExportEnabled = config.singleExport && (config.singleExport.enabled || config.singleExport.enabled === undefined);
            const hexColorsEnabled = config.hexColors && (config.hexColors.enabled || config.hexColors.enabled === undefined);
            if (checkPackageEnabled) {
                errorMsg = errorMsg.concat(checkPackage.run(config.checkPackageJson));
            }
            if (singleExportEnabled) {
                errorMsg = errorMsg.concat(singleExport.run(config.singleExport));
            }
            if (hexColorsEnabled) {
                errorMsg = errorMsg.concat(hexColors.run(config.hexColors));
            }
            if (!checkPackageEnabled && !singleExportEnabled && !hexColorsEnabled) {
                console.warn("Toffeenut loaded but not tests were enabled.".yellow);
                this.exit(exitCode);
            }
        } catch(_) {
            errorMsg.push('Error loading toffeenut config file'.red);
        }
        if (errorMsg.length > 0) {
            errorMsg.forEach(msg => {
                console.error(msg.red);
            });
            console.error("\r");
            console.error(`Total Errors Found: ${errorMsg.length}`.red);
            exitCode = 1;
        } else {
            console.info('All Tests Passed'.green);
        }
        this.exit(exitCode);
    }
    
    public exit(code: number): void {
        code = code ?? 0;
        console.info('====== toffeenut complete ==========');
        process.exit(code);
    }
}
