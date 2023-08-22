const run = require('../scripts/run');
const checkPackageJson = require('../scripts/checkPackageJson');
const singleExport = require('../scripts/singleExport');
const hexColors = require('../scripts/hexColors');

describe('run', () => {
    let mockConfig = 
    {
        checkPackageJson: {
            "enabled": true,
            "allowGithub": false,
            "requireGitCommit": false,
            "packagePath": "../mockPackage.json"
        },
        singleExport: { 
            "enabled": false,
            "rootPath": ""
        },
        hexColors: {
            "enabled": true,
            "colorsFilePath": "",
            "checkHTML": false,
            "checkForRGBA": false,
            "ignoreFiles": [],
            "rootPath": ""
        }
    }

    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
        jest.spyOn(process, 'exit').mockImplementation(() => {});
        jest.spyOn(console, 'error').mockImplementation(() => {});
        jest.spyOn(console, 'info').mockImplementation(() => {});
        jest.spyOn(console, 'warn').mockImplementation(() => {});

        mockConfig = {
            checkPackageJson: {
                "enabled": true,
                "allowGithub": false,
                "requireGitCommit": false,
                "packagePath": "../mockPackage.json"
            },
            singleExport: { 
                "enabled": false,
                "rootPath": ""
            },
            hexColors: {
                "enabled": true,
                "colorsFilePath": "",
                "checkHTML": false,
                "checkForRGBA": false,
                "ignoreFiles": [],
                "rootPath": ""
            }
        }
    });

    describe('check package json', () => {
        test('should run when test is enabled', () => {
            mockConfig.checkPackageJson.enabled = true;
            jest.spyOn(JSON, 'parse').mockReturnValueOnce(mockConfig);
            jest.spyOn(checkPackageJson, 'run');
            run.go();
            expect(checkPackageJson.run).toHaveBeenCalled();
        });

        test('should not run when test is disabled', () => {
            mockConfig.checkPackageJson.enabled = false;
            jest.spyOn(JSON, 'parse').mockReturnValueOnce(mockConfig);
            jest.spyOn(checkPackageJson, 'run');
            run.go();
            expect(checkPackageJson.run).not.toHaveBeenCalled();
        });

        test('should not run when config section is missing', () => {
            delete mockConfig.checkPackageJson;
            jest.spyOn(JSON, 'parse').mockReturnValueOnce(mockConfig);
            jest.spyOn(checkPackageJson, 'run');
            run.go();
            expect(checkPackageJson.run).not.toHaveBeenCalled();
        });
    });

    describe('single export tests', () => {
        test('should run when test is enabled', () => {
            mockConfig.singleExport.enabled = true;
            jest.spyOn(JSON, 'parse').mockReturnValueOnce(mockConfig);
            jest.spyOn(singleExport, 'run');
            run.go();
            expect(singleExport.run).toHaveBeenCalled();
        });

        test('should not run when test is disabled', () => {
            mockConfig.singleExport.enabled = false;
            jest.spyOn(JSON, 'parse').mockReturnValueOnce(mockConfig);
            jest.spyOn(singleExport, 'run');
            run.go();
            expect(singleExport.run).not.toHaveBeenCalled();
        });

        test('should not run when config section is missing', () => {
            delete mockConfig.singleExport;
            jest.spyOn(JSON, 'parse').mockReturnValueOnce(mockConfig);
            jest.spyOn(singleExport, 'run');
            run.go();
            expect(singleExport.run).not.toHaveBeenCalled();
        });
    });

    describe('hex color tests', () => {
        test('should run when test is enabled', () => {
            mockConfig.hexColors.enabled = true;
            jest.spyOn(JSON, 'parse').mockReturnValueOnce(mockConfig);
            jest.spyOn(hexColors, 'run');
            run.go();
            expect(hexColors.run).toHaveBeenCalled();
        });

        test('should not run when test is disabled', () => {
            mockConfig.hexColors.enabled = false;
            jest.spyOn(JSON, 'parse').mockReturnValueOnce(mockConfig);
            jest.spyOn(hexColors, 'run');
            run.go();
            expect(hexColors.run).not.toHaveBeenCalled();
        });

        test('should not run when config section is missing', () => {
            delete mockConfig.hexColors;
            jest.spyOn(JSON, 'parse').mockReturnValueOnce(mockConfig);
            jest.spyOn(hexColors, 'run');
            run.go();
            expect(hexColors.run).not.toHaveBeenCalled();
        });
    });

    describe('when no tests are enabled', () => {
        test('should warn user', () => {
            mockConfig.checkPackageJson.enabled = false;
            mockConfig.hexColors.enabled = false;
            mockConfig.singleExport.enabled = false;
            jest.spyOn(JSON, 'parse').mockReturnValueOnce(mockConfig);
            run.go();
            expect(console.warn).toHaveBeenCalled();
        });
        
        test('should exit toffeenut', () => {
            mockConfig.checkPackageJson.enabled = false;
            mockConfig.hexColors.enabled = false;
            mockConfig.singleExport.enabled = false;
            jest.spyOn(JSON, 'parse').mockReturnValueOnce(mockConfig);
            jest.spyOn(run, 'exit');
            run.go();
            expect(run.exit).toHaveBeenCalled();
        });
    });

    test('when there are errors should exit with code 1', () => {
        mockConfig.checkPackageJson.enabled = true;
        mockConfig.hexColors.enabled = false;
        mockConfig.singleExport.enabled = false;
        jest.spyOn(JSON, 'parse').mockReturnValueOnce(mockConfig);
        jest.spyOn(checkPackageJson, 'run').mockReturnValueOnce(['some errors']);
        jest.spyOn(run, 'exit');
        run.go();
        expect(run.exit).toHaveBeenCalledWith(1);
    });

    describe('exit', () => {
        test('should exit with supplied code', () => {
            const code = 45;
            run.exit(code);
            expect(process.exit).toHaveBeenCalledWith(code);
        });

        test('should print complete message', () => {
            run.exit();
            expect(console.info).toHaveBeenCalledWith('====== toffeenut complete ==========');
        });

        test('should exit with code 0 when no code is supplied', () => {
            run.exit();
            expect(process.exit).toHaveBeenCalledWith(0);
        });
    });
});