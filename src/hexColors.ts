import fs from 'fs';
import Path from 'path';
import os from 'os';
import { IHexColorsConfig } from '../models/IHexColorsConfig';

export default class HexColors {

    public run(config: IHexColorsConfig): string[] {
        config.colorsFilePath = config.colorsFilePath?.trim();
        config.rootPath = config.rootPath?.trim();
        
        if (!config.colorsFilePath) {
            return ["Hex Colors File Path cannot be empty"];
        }
        if (!config.rootPath) {
            return ["Hex Colors root path cannot be empty"];
        }
        try{
            var files = this.getAllFiles(config.rootPath, config.checkHTML);
            var messages: string[] = [];
            files = files.filter(x => Path.resolve(x) != Path.resolve(config.colorsFilePath));
            if (Array.isArray(config.ignoreFiles)){
                config.ignoreFiles.forEach(path => {
                    files = files.filter(x => Path.dirname(Path.resolve(x)) != Path.resolve(path));
                    files = files.filter(x => Path.dirname(Path.resolve(x)) != Path.dirname(Path.resolve(path)));
                });
            }
            if(Array.isArray(files)) {
                files.forEach(f => {
                    const fileName = Path.basename(f);
                    const fileExt = Path.extname(f);
                    const fileRead = fs.readFileSync(f, 'utf8');
                    const data = fileRead.split(os.EOL);
                    data.forEach(l => {
                        const result = this.validateLine(l, config, fileExt);
                        if(!result.isValid) {
                            result.errorMessages.forEach(msg => {
                                messages.push(`${fileName} ${msg}`);
                            });
                        }
                    });
                });
            }
            return messages;
        } catch(err) {
            return[JSON.stringify(err)];
        }
    }
    
    public validateLine(line: string, config: IHexColorsConfig, fileExt: string): { isValid: boolean, errorMessages: string[] }
     {
        const result: { isValid: boolean, errorMessages: string[] } = {
            isValid: true,
            errorMessages: []
        };
        const hexError = this.checkForHexColors(line, fileExt);
        let rgbError = '';
        if (config.checkForRGBA) {
            rgbError = this.checkForRGBA(line);
        }
        if(hexError) {
            result.isValid = false;
            result.errorMessages.push(hexError);
        }
        if(rgbError) {
            result.isValid = false;
            result.errorMessages.push(rgbError);
        }
        return result;
    }
    
    public checkForHexColors(line: string, fileExt: string): string {
        let errorMessage: string = '';
        const split = line.split(':');
        const regex = new RegExp('#[^\\s+{\\s+]([0-9]|[^aA-fF]){0,6}');
        if(regex.test(line)) {
            if(fileExt == '.html' || fileExt == '.html') {
                if(line.includes('style') && line.includes('color')) {
                    errorMessage = `${split[0].trim()} has a hex color defined`;
                }
            } else if(fileExt == '.scss'){
                if (line.includes('color')) {
                    errorMessage = `${split[0].trim()} has a hex color defined`;
                }
            } else {
                errorMessage = `${split[0].trim()} has a hex color defined`;
            }
        }
        return errorMessage;
    }
    
    public checkForRGBA(line: string): string {
        let errorMessage = '';
        const regex = new RegExp('(rgb)?a?\\\(?(\\\d{1,3},\\\s?){2}(\\\d{1,3})(,?\\\s?[0|1]?.?\\\d?)\\\)?');
        if(regex.test(line)) {
            const split = line.split(':');
            errorMessage = `${split[0].trim()} has a rgb/rgba color defined`;
        }
        return errorMessage;
    }
    
    public getAllFiles(path: string, ignoreHtml: boolean): string[] {
        let files: string[] = []
        fs.readdirSync(path).forEach(File => {
            const absolute = Path.join(path, File);
            const stats = fs.statSync(absolute);
            if (stats.isDirectory()) {
                files = files.concat(this.getAllFiles(absolute, ignoreHtml));
                return files;
            }
            else {
                const fileExt = Path.extname(absolute);
                const ignoreFileExts = ['.ts', '.eot', '.svg', '.ttf', '.woff', '.png', '.js'];
                if (ignoreHtml) {
                    ignoreFileExts.push('.html');
                    ignoreFileExts.push('.htm');
                }
                if (!ignoreFileExts.includes(fileExt)) {
                    return files.push(absolute);
                }
            }
        });
        return files;
    }
}