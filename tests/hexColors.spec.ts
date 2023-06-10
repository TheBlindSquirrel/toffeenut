import HexColors from '../src/hexColors';
import { IHexColorsConfig } from '../models/IHexColorsConfig';

describe('Hex Colors', () => {
    let config: IHexColorsConfig = {
        enabled: true,
        colorsFilePath: './testFiles/hexColors/colorFile.scss',
        checkHTML: false,
        checkForRGBA: false,
        ignoreFiles: ['./testFiles/hexColors/ignoreThisFolder', './testFiles/hexColors/ignoreThisFile.scss'],
        rootPath: './testFiles/hexColors'
    };
    const hexColors = new HexColors();
    beforeEach(() => {
        jest.clearAllMocks();
        config = {
            enabled: true,
            colorsFilePath: './testFiles/hexColors/colorFile.scss',
            checkHTML: false,
            checkForRGBA: false,
            ignoreFiles: ['./testFiles/hexColors/ignoreThisFolder', './testFiles/hexColors/ignoreThisFile.scss'],
            rootPath: './testFiles/hexColors'
        };
    });

    describe('run', () => {
        describe('missing colors file path', () => {
            test('should return error when colors file path is empty', () => {
                const expected = ['Hex Colors File Path cannot be empty'];
                config.colorsFilePath = '';
                const actual = hexColors.run(config);
                expect(actual).toStrictEqual(expected);
            });
    
            test('should return error when colors file path is null', () => {
                const expected = ['Hex Colors File Path cannot be empty'];
                config.colorsFilePath = '';
                const actual = hexColors.run(config);
                expect(actual).toStrictEqual(expected);
            });
    
            test('should return error when colors file path is undefined', () => {
                const expected = ['Hex Colors File Path cannot be empty'];
                //@ts-ignore
                config.colorsFilePath = undefined;
                const actual = hexColors.run(config);
                expect(actual).toStrictEqual(expected);
            });
    
            test('should return error when colors file path is null', () => {
                const expected = ['Hex Colors File Path cannot be empty'];
                //@ts-ignore
                config.colorsFilePath = null;
                const actual = hexColors.run(config);
                expect(actual).toStrictEqual(expected);
            });
    
            test('should return error when colors file path is only whitespace', () => {
                const expected = ['Hex Colors File Path cannot be empty'];
                config.colorsFilePath = '     ';
                const actual = hexColors.run(config);
                expect(actual).toStrictEqual(expected);
            });
        });

        describe('missing root path', () => {
            test('should return error when path is empty', () => {
                const expected = ['Hex Colors root path cannot be empty'];
                config.rootPath = '';
                const actual = hexColors.run(config);
                expect(actual).toStrictEqual(expected);
            });
    
            test('should return error when path is null', () => {
                const expected = ['Hex Colors root path cannot be empty'];
                config.rootPath = '';
                const actual = hexColors.run(config);
                expect(actual).toStrictEqual(expected);
            });
    
            test('should return error when path is undefined', () => {
                const expected = ['Hex Colors root path cannot be empty'];
                //@ts-ignore
                config.rootPath = undefined;
                const actual = hexColors.run(config);
                expect(actual).toStrictEqual(expected);
            });
    
            test('should return error when path is null', () => {
                const expected = ['Hex Colors root path cannot be empty'];
                //@ts-ignore
                config.rootPath = null;
                const actual = hexColors.run(config);
                expect(actual).toStrictEqual(expected);
            });
    
            test('should return error when colors file path is only whitespace', () => {
                const expected = ['Hex Colors root path cannot be empty'];
                config.rootPath = '     ';
                const actual = hexColors.run(config);
                expect(actual).toStrictEqual(expected);
            });
        });

        test('should call get all files', () => {
            jest.spyOn(hexColors, 'getAllFiles');
            hexColors.run(config);
            expect(hexColors.getAllFiles).toHaveBeenCalledWith(config.rootPath, config.checkHTML);
        });

        test('should call validate line', () => {
            jest.spyOn(hexColors, 'validateLine');
            hexColors.run(config);
            expect(hexColors.validateLine).toHaveBeenCalled();
        });
    });

    describe('validate line', () => {
        test('should call check for hex color', () => {
            jest.spyOn(hexColors, 'checkForHexColors');
            hexColors.validateLine('', config, '');
            expect(hexColors.checkForHexColors).toHaveBeenCalled();
        });

        test('should check for rgba when config is enabled', () => {
            jest.spyOn(hexColors, 'checkForRGBA');
            config.checkForRGBA = true;
            hexColors.validateLine('', config, '');
            expect(hexColors.checkForRGBA).toHaveBeenCalled();
        });

        test('should not check for rgba when config is disabled', () => {
            jest.spyOn(hexColors, 'checkForRGBA');
            config.checkForRGBA = false;
            hexColors.validateLine('', config, '');
            expect(hexColors.checkForRGBA).not.toHaveBeenCalled();
        });

        test('set isValid to false when hex color errors', () => {
            const mockError = 'this is an error message';
            jest.mocked(hexColors.checkForHexColors).mockImplementation(() => {
                return mockError;
            });
            const actual = hexColors.validateLine('', config, '.html');
            expect(actual.isValid).toBeFalsy();
        });

        test('set isValid to false when rgba color errors', () => {
            const mockError = 'this is an error message';
            jest.mocked(hexColors.checkForRGBA).mockImplementation(() => {
                return mockError;
            });
            config.checkForRGBA = true;
            const actual = hexColors.validateLine('', config, '.html');
            expect(actual.isValid).toBeFalsy();
        });
        
        test('should include error message when hex color errors', () => {
            const mockError = 'this is an error message';
            jest.mocked(hexColors.checkForHexColors).mockImplementation(() => {
                return mockError;
            });
            const actual = hexColors.validateLine('', config, '.html');
            expect(actual.errorMessages).toContain(mockError);
        });

        test('should include error message when rgba color errors', () => {
            const mockError = 'this is an error message';
            jest.mocked(hexColors.checkForRGBA).mockImplementation(() => {
                return mockError;
            });
            config.checkForRGBA = true;
            const actual = hexColors.validateLine('', config, '.html');
            expect(actual.errorMessages).toContain(mockError);
        });

        test('set isValid to true when no errors', () => {
            config.checkForRGBA = true;
            jest.mocked(hexColors.checkForRGBA).mockImplementation(() => {
                return '';
            });
            jest.mocked(hexColors.checkForHexColors).mockImplementation(() => {
                return '';
            });
            const actual = hexColors.validateLine('', config, '.html');
            expect(actual.isValid).toBe(true);
            expect(actual.errorMessages.length).toBe(0);
        });

    });

    describe('check for hex colors', () => {
        beforeEach(() => {
            jest.restoreAllMocks();
        });

        describe('html files', () => {
            test('should return error when color is present within the style tag', () => {
                const line = '<div style="color:#fff">'
                const actual = hexColors.checkForHexColors(line, '.html');
                expect(actual).toMatch(new RegExp('has a hex color defined'));
            });
            
            test('should return error when color and other tags are present within the style tag', () => {
                const line = '<p style="font-weight:700;color:#1232;" ></p>';
                const actual = hexColors.checkForHexColors(line, '.html');
                expect(actual).toMatch(new RegExp('has a hex color defined'));
            });

            test('should return empty string when id is used', () => {
                const line = '  <input type="text" #keyInfoComponentEmail></input>';
                const actual = hexColors.checkForHexColors(line, '.html');
                expect(actual).toBeFalsy();
            });


            test('should return empty string when style is present but no color', () => {
                const line = '<p style="font-weight: 500" #abc123>';
                const actual = hexColors.checkForHexColors(line, '.html');
                expect(actual).toBeFalsy();
            });
        });

        describe('scss files', () => {
            test('should return error when color is present', () => {
                const line = ' --ion-color-primary: #3880ff;';
                const actual = hexColors.checkForHexColors(line, '.scss');
                expect(actual).toMatch(new RegExp('has a hex color defined'));
            });

            test('should return empty string when line is id selector', () => {
                const line = '#companyName {';
                const actual = hexColors.checkForHexColors(line, '.scss');
                expect(actual).toBeFalsy();
            });
        });
    });

    describe('check for RGBA', () => {
        beforeEach(() => {
            jest.restoreAllMocks();
        });

        test('should not return error for hex color', () => {
            const line = '<div style="color:#fff">';
            const actual = hexColors.checkForRGBA(line);
            expect(actual).toBeFalsy();
        });

        test('should error on rgb color', () => {
            const line ='    --ion-color-primary-rgb: 56, 128, 255;';
            const actual = hexColors.checkForRGBA(line);
            expect(actual).toMatch(new RegExp('has a rgb/rgba color defined'));
        });

        test('should error on rgba color', () => {
            const line ='background-color: rgba(255, 255, 255, 0.5);';
            const actual = hexColors.checkForRGBA(line);
            expect(actual).toMatch(new RegExp('has a rgb/rgba color defined'));
        });
    });
});