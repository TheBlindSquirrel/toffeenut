const plugin = require('../scripts/plugins');
const fs = require('fs');
const util = require('../scripts/utils');

let config = {
    rootPath: './testFiles/plugins',
    enabled: true,
    pluginsArray: []
};
//example error message Plugin {pluginname} is referenced in {count} files.
describe('Plugins', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        config = {
            rootPath: './testFiles/plugins',
            enabled: true,
            pluginsArray: []
        };
    });

    describe('run', () => {
        beforeEach(() => {
            jest.clearAllMocks();
            jest.restoreAllMocks();
        });

        describe('require root path', () => {
            test('should return error when root path is empty', () => {
                config.rootPath = '';
                const expected = ['Plugins Only Called Once root path cannot be empty'];
                const actual = plugin.run(config);
                expect(actual.length).toBe(1);
                expect(actual).toStrictEqual(expected);
            });
    
            test('should return error when root path is null', () => {
                config.rootPath = null;
                const expected = ['Plugins Only Called Once root path cannot be empty'];
                const actual = plugin.run(config);
                expect(actual.length).toBe(1);
                expect(actual).toStrictEqual(expected);
            });
    
            test('should return error when root path is undefined', () => {
                config.rootPath = undefined;
                const expected = ['Plugins Only Called Once root path cannot be empty'];
                const actual = plugin.run(config);
                expect(actual.length).toBe(1);
                expect(actual).toStrictEqual(expected);
            });
        });

        test('should get only ts files', () => {
            jest.spyOn(util, 'getOnlyFiles');
            plugin.run(config);
            expect(util.getOnlyFiles).toHaveBeenCalledWith(config.rootPath, '.ts');
        });
        
        test('should handle custom plugins', () => {
            config.pluginsArray = ['customPlugin/plugin'];
            const errorMsgs = plugin.run(config);
            expect(errorMsgs).toContain('Plugin customPlugin/plugin is referenced in 2 files.');
        });

        test('should find the @capacitor/keyboard plugin in 2 files', () => {
            const errorMsgs = plugin.run(config);
            expect(errorMsgs).toContain('Plugin @capacitor/keyboard is referenced in 2 files.');
        });
        
        test('should find the @capacitor/device plugin in 2 files', () => {
            const errorMsgs = plugin.run(config);
            expect(errorMsgs).toContain('Plugin @capacitor/device is referenced in 2 files.');
        });
        
        test('should find the @capacitor/app plugin in 2 files', () => {
            const errorMsgs = plugin.run(config);
            expect(errorMsgs).toContain('Plugin @capacitor/app is referenced in 2 files.');
        });

        test('should not find the @capacitor/core plugin', () => {
            const errorMsgs = plugin.run(config);
            expect(errorMsgs).not.toContain('Plugin @capacitor/core is referenced in 2 files.');
        });

        test('should call process file', () => {
            jest.spyOn(plugin, 'processFile');
            plugin.run(config);
            expect(plugin.processFile).toHaveBeenCalled();
        });

        test('should call generate error messages', () => {
            jest.spyOn(plugin, 'generateErrorMessages');
            plugin.run(config);
            expect(plugin.generateErrorMessages).toHaveBeenCalled();
        });
    });

    describe('process file', () => {
        const fileData = "import { HttpClient } from '@angular/common/http';\r\nimport { CustomPlugin } from 'customPlugin/plugin';\r\nimport { Device } from '@capacitor/device';\r\n\r\n@Injectable({\r\n    providedIn: 'root',\r\n  })\r\n  export class CustomService {\r\n    constructor() {}\r\n  \r\n  \r\n  }";

        test('should find 1 instance of custom plugin', () => {
            const pluginName = 'customPlugin/plugin';
            config.pluginsArray = [pluginName];
            const regexMap = {};
            regexMap[pluginName] = new RegExp(pluginName, 'g');
            const actual = plugin.processFile(fileData, config.pluginsArray, regexMap, {});
            expect(actual[pluginName]).toBe(1);
        });

        test('should find supplied plugin', () => {
            const pluginName = '@capacitor/device';
            config.pluginsArray = [pluginName, 'customPlugin/plugin'];
            const regexMap = {};
            regexMap[pluginName] = new RegExp(pluginName, 'g');
            const actual = plugin.processFile(fileData, config.pluginsArray, regexMap, {});
            expect(actual[pluginName]).toBe(1);
        });

        test('should return undefined when plugin is not found', () => {
            const pluginName = '@capacitor/core';
            config.pluginsArray = [pluginName, 'customPlugin/plugin'];
            const regexMap = {};
            regexMap[pluginName] = new RegExp(pluginName, 'g');
            const actual = plugin.processFile(fileData, config.pluginsArray, regexMap, {});
            expect(actual[pluginName]).toBeFalsy();
        });
    });

    describe('generate error messages', () => {
        describe('should return empty message array when ', () => {
            test('plugins to check is empty', () => {
                const actual = plugin.generateErrorMessages([], {});
                expect(actual.length).toBe(0);
            });
    
            test('plugins to check is not an array', () => {
                const actual = plugin.generateErrorMessages({}, {});
                expect(actual.length).toBe(0);
            });
    
            test('plugins to check is undefined', () => {
                const actual = plugin.generateErrorMessages(undefined, {});
                expect(actual.length).toBe(0);
            });
    
            test('plugin count object is null', () => {
                const actual = plugin.generateErrorMessages([], null);
                expect(actual.length).toBe(0);
            });
        });

        test('should not return error message if plugin is only found once', () => {
            const pluginName = '@capacitor/core';
            const countObj = {};
            countObj[pluginName] = 1;
            const actual = plugin.generateErrorMessages([pluginName], countObj);
            expect(actual).not.toContain(`Plugin ${pluginName} is referenced in 1 files.`);
        });

        test('should return error message if plugin is found more than once', () => {
            const pluginName = '@capacitor/core';
            const secondPlugin = '@capacitor/device';
            const countObj = {};
            countObj[pluginName] = 1;
            countObj[secondPlugin] = 2;
            const actual = plugin.generateErrorMessages([pluginName, secondPlugin], countObj);
            expect(actual).toContain(`Plugin ${secondPlugin} is referenced in 2 files.`);
        });
    });
});