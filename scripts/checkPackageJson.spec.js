const checkPackageJson = require('./checkPackageJson');
const fs = require('fs');

let config = {
    enabled: true,
    allowGithub: true,
    requireGitCommit: true,
};

describe('check package JSON', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        config = {
            enabled: true,
            allowGithub: true,
            requireGitCommit: true,
            packagePath: './testFiles/package.json'
        };
    });

    describe('run', () => {
        beforeEach(() => {
            jest.clearAllMocks();
            jest.restoreAllMocks();
        });

        test('should call check dependencies twice', () => {
            jest.spyOn(checkPackageJson, 'checkDependencies');
            checkPackageJson.run(config);
            expect(checkPackageJson.checkDependencies).toHaveBeenCalledTimes(2);
        });

        test('should return errors', () => {
            const errors = 'check dependencies mock error';
            jest.spyOn(checkPackageJson, 'checkDependencies').mockReturnValueOnce([errors]);
            const actual = checkPackageJson.run(config);
            expect(actual).toContain(errors);
        });

        test('should return error when package path is missing', () => {
            delete config.packagePath;
            const actual = checkPackageJson.run(config);
            expect(actual.length).toBe(1);
            expect(actual).toStrictEqual(['Package Path is required']);
        });

        test('should return error when package path is empty string', () => {
            config.packagePath = '';
            const actual = checkPackageJson.run(config);
            expect(actual.length).toBe(1);
            expect(actual).toStrictEqual(['Package Path is required']);
        });

        test('should return error when package path is null', () => {
            config.packagePath = null;
            const actual = checkPackageJson.run(config);
            expect(actual.length).toBe(1);
            expect(actual).toStrictEqual(['Package Path is required']);
        });

        test('should return error when package path is undefined', () => {
            config.packagePath = undefined;
            const actual = checkPackageJson.run(config);
            expect(actual.length).toBe(1);
            expect(actual).toStrictEqual(['Package Path is required']);
        });

        test('should return error when package path is only white space', () => {
            config.packagePath = '     ';
            const actual = checkPackageJson.run(config);
            expect(actual.length).toBe(1);
            expect(actual).toStrictEqual(['Package Path is required']);
        });

        test('should call fs file sync with supplied package path', () => {
            const expectedPath = './some/other/path';
            config.packagePath = expectedPath;
            jest.spyOn(fs, 'readFileSync');
            checkPackageJson.run(config);
            expect(fs.readFileSync).toHaveBeenCalledWith(expectedPath);
        });
    });

    describe('check dependencies', () => {
        test('should return error on ~', () => {
            const dependencies = {       
                '@angular/common':'~10.0.0',
            };

            const actual = checkPackageJson.checkDependencies(dependencies, config);

            expect(actual.length).toBe(1);
            expect(actual).toContain("Package @angular/common : ~10.0.0 is not pinned");
        });

        test('should return error on -', () => {
            const dependencies = {       
                '@angular/common':'-10.0.0',
            };

            const actual = checkPackageJson.checkDependencies(dependencies, config);

            expect(actual.length).toBe(1);
            expect(actual).toContain("Package @angular/common : -10.0.0 is not pinned");
        });

        test('should return error on ^', () => {
            const dependencies = {       
                '@angular/common':'^10.0.0',
            };

            const actual = checkPackageJson.checkDependencies(dependencies, config);

            expect(actual.length).toBe(1);
            expect(actual).toContain("Package @angular/common : ^10.0.0 is not pinned");
        });

        test('should return error on >', () => {
            const dependencies = {       
                '@angular/common':'>10.0.0',
            };

            const actual = checkPackageJson.checkDependencies(dependencies, config);

            expect(actual.length).toBe(1);
            expect(actual).toContain("Package @angular/common : >10.0.0 is not pinned");
        });

        test('should return error on <', () => {
            const dependencies = {       
                '@angular/common':'<10.0.0',
            };

            const actual = checkPackageJson.checkDependencies(dependencies, config);

            expect(actual.length).toBe(1);
            expect(actual).toContain("Package @angular/common : <10.0.0 is not pinned");
        });

        test('should return error on |', () => {
            const dependencies = {       
                '@angular/common':'|10.0.0',
            };

            const actual = checkPackageJson.checkDependencies(dependencies, config);

            expect(actual.length).toBe(1);
            expect(actual).toContain("Package @angular/common : |10.0.0 is not pinned");
        });

        test('should not error on =', () => {
            const dependencies = {       
                '@angular/common':'=10.0.0',
            };

            const actual = checkPackageJson.checkDependencies(dependencies, config);

            expect(actual.length).toBe(0);
        });
        
        test('should return error on github package when git is disabled', () => {
            const dependencies = {       
                'toffeenut':'github:swernimo/toffeenut',
            };

            config.allowGithub = false;
            const actual = checkPackageJson.checkDependencies(dependencies, config);

            expect(actual.length).toBe(1);
            expect(actual).toContain("Package toffeenut is set to a git URL and git is not allowed.");
        });

        test('should not error on git package when git is enabled', () => {
            const dependencies = {       
                'toffeenut':'git+https://github.com/visionmedia/express.git',
            };

            config.allowGithub = false;
            const actual = checkPackageJson.checkDependencies(dependencies, config);

            expect(actual.length).toBe(1);
            expect(actual).toContain("Package toffeenut is set to a git URL and git is not allowed.");
        });

        test('should not error on github package when git is enabled', () => {
            const dependencies = {       
                'toffeenut':'github:swernimo/toffeenut',
            };

            config.allowGithub = true;
            const actual = checkPackageJson.checkDependencies(dependencies, config);

            expect(actual.length).toBe(0);
        });

        test('should return error on git package when git is disabled', () => {
            const dependencies = {       
                'toffeenut':'git+https://github.com/visionmedia/express.git',
            };

            config.allowGithub = true;
            const actual = checkPackageJson.checkDependencies(dependencies, config);

            expect(actual.length).toBe(0);
        });
    });
});