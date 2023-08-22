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
/**
 * 'import { Injectable } from '@angular/core';\r\nimport { Capacitor } from '@capacitor/core';\r\nimport * from '@capacitor/action-sheet';\r\nimport * from '@capacitor/app';\r\nimport * from '@capacitor/browser';\r\nimport * from '@capacitor/camera';\r\nimport * from '@capacitor/clipboard';\r\nimport * from '@capacitor/device';\r\nimport * from '@capacitor/dialog';\r\nimport * from '@capacitor/filesystem';\r\nimport * from '@capacitor/geolocation';\r\nimport * from '@capacitor/google-maps';\r\nimport * from '@capacitor/h…from '@capacitor/network';\r\nimport * from '@capacitor/preferences';\r\nimport * from '@capacitor/storage';\r\nimport * from '@capacitor/push-notifications';\r\nimport * from '@capacitor/screen-reader';\r\nimport * from '@capacitor/share';\r\nimport * from '@capacitor/splash-screen';\r\nimport * from '@capacitor/status-bar';\r\nimport * from '@capacitor/text-zoom';\r\nimport * from '@capacitor/toast';\r\n\r\n@Injectable({\r\n  providedIn: 'root',\r\n})\r\nexport class AllTheServicesService {\r\n  constructor() {}\r\n\r\n\r\n}\r\n'
 */
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
    });
});