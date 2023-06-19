import fs from 'fs';
import Path from 'path'
import { ISingleExportConfig } from '../models/ISingleExportConfig';

export default class SingleExport {
    public run(config: ISingleExportConfig): string[] {
        if(config.rootPath) {
            config.rootPath = config.rootPath.trim();
        }
        if (!config.rootPath) {
            return ["Single Export Path cannot be empty"];
        }
        try{
            const errorMessages: string[] = [];
            const files = this.getAllFiles(config.rootPath);
            files.forEach(file => {
                const fileName = Path.basename(file);
                const fileData = fs.readFileSync(file, 'utf8');
                const msg = this.validateFile(fileData, fileName);
                if(msg) {
                    errorMessages.push(msg);
                }
            });
    
            return errorMessages;
        } catch(err) {
            return [
                `Single Export encountered an error: ${JSON.stringify(err)}`
            ];
        }
    }
    
    public validateFile(fileData: string, fileName: string): string {
       let errorMsg: string = '';
       const regexArr = [new RegExp('(export\\s+default\\s+interface)', 'g'), new RegExp('(export\\s+default\\s+class)', 'g'), new RegExp('(export\\s+interface)', 'g'), new RegExp('(export\\s+class)', 'g')];
       let matchCount = 0;
       regexArr.forEach(r => {
        if(r.test(fileData)) {
            matchCount++;
        }
       });
        if(matchCount > 1) {
            errorMsg = `${fileName} has multiple interface or class exports`;
        }
        return errorMsg;
    }
    
    public getAllFiles(path: string): string[]  {
        let files: string[] = [];
        fs.readdirSync(path).forEach(File => {
            const absolute = Path.join(path, File);
            const stats = fs.statSync(absolute);
            if (stats.isDirectory()) {
                files = files.concat(this.getAllFiles(absolute));
                return files;
            }
            else {
                if (Path.extname(absolute) === '.ts' && !absolute.endsWith('.spec.ts')){
                    return files.push(absolute);
                }
            }
        });
        return files;
    }
}