import fs from 'fs';
import CheckPackageJson from '../src/checkPackageJson';
import { ICheckPackageJsonConfig } from '../models/ICheckPackageJsonConfig';

describe('check package JSON', () => {
    const checkPackage = new CheckPackageJson();
    let config: ICheckPackageJsonConfig = {
        enabled: true,
        allowGithub: true,
        requireGitCommit: true,
        packagePath: ''
    };

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
            jest.spyOn(checkPackage, 'checkDependencies');
            checkPackage.run(config);
            expect(checkPackage.checkDependencies).toHaveBeenCalledTimes(2);
        });

        test('should return errors', () => {
            const errors = 'check dependencies mock error';
            jest.spyOn(checkPackage, 'checkDependencies').mockReturnValueOnce([errors]);
            const actual = checkPackage.run(config);
            expect(actual).toContain(errors);
        });

        test('should return error when package path is missing', () => {
            //@ts-ignore
            delete config.packagePath;
            const actual = checkPackage.run(config);
            expect(actual.length).toBe(1);
            expect(actual).toStrictEqual(['Package Path is required']);
        });

        test('should return error when package path is empty string', () => {
            config.packagePath = '';
            const actual = checkPackage.run(config);
            expect(actual.length).toBe(1);
            expect(actual).toStrictEqual(['Package Path is required']);
        });

        test('should return error when package path is null', () => {
            //@ts-ignore
            config.packagePath = null;
            const actual = checkPackage.run(config);
            expect(actual.length).toBe(1);
            expect(actual).toStrictEqual(['Package Path is required']);
        });

        test('should return error when package path is undefined', () => {
            //@ts-ignore
            config.packagePath = undefined;
            const actual = checkPackage.run(config);
            expect(actual.length).toBe(1);
            expect(actual).toStrictEqual(['Package Path is required']);
        });

        test('should return error when package path is only white space', () => {
            config.packagePath = '     ';
            const actual = checkPackage.run(config);
            expect(actual.length).toBe(1);
            expect(actual).toStrictEqual(['Package Path is required']);
        });

        test('should call fs file sync with supplied package path', () => {
            const expectedPath = './some/other/path';
            config.packagePath = expectedPath;
            jest.spyOn(fs, 'readFileSync');
            checkPackage.run(config);
            expect(fs.readFileSync).toHaveBeenCalledWith(expectedPath);
        });
    });

    describe('check dependencies', () => {
        describe('special characters', () => {
            test('should return error on ~', () => {
                const dependencies = {       
                    '@angular/common':'~10.0.0',
                };
    
                const actual = checkPackage.checkDependencies(dependencies, config);
    
                expect(actual.length).toBe(1);
                expect(actual).toContain("Package @angular/common : ~10.0.0 is not pinned");
            });
    
            test('should return error on -', () => {
                const dependencies = {       
                    '@angular/common':'-10.0.0',
                };
    
                const actual = checkPackage.checkDependencies(dependencies, config);
    
                expect(actual.length).toBe(1);
                expect(actual).toContain("Package @angular/common : -10.0.0 is not pinned");
            });
    
            test('should return error on ^', () => {
                const dependencies = {       
                    '@angular/common':'^10.0.0',
                };
    
                const actual = checkPackage.checkDependencies(dependencies, config);
    
                expect(actual.length).toBe(1);
                expect(actual).toContain("Package @angular/common : ^10.0.0 is not pinned");
            });
    
            test('should return error on >', () => {
                const dependencies = {       
                    '@angular/common':'>10.0.0',
                };
    
                const actual = checkPackage.checkDependencies(dependencies, config);
    
                expect(actual.length).toBe(1);
                expect(actual).toContain("Package @angular/common : >10.0.0 is not pinned");
            });
    
            test('should return error on <', () => {
                const dependencies = {       
                    '@angular/common':'<10.0.0',
                };
    
                const actual = checkPackage.checkDependencies(dependencies, config);
    
                expect(actual.length).toBe(1);
                expect(actual).toContain("Package @angular/common : <10.0.0 is not pinned");
            });
    
            test('should return error on |', () => {
                const dependencies = {       
                    '@angular/common':'|10.0.0',
                };
    
                const actual = checkPackage.checkDependencies(dependencies, config);
    
                expect(actual.length).toBe(1);
                expect(actual).toContain("Package @angular/common : |10.0.0 is not pinned");
            });
    
            test('should not error on =', () => {
                const dependencies = {       
                    '@angular/common':'=10.0.0',
                };
    
                const actual = checkPackage.checkDependencies(dependencies, config);
    
                expect(actual.length).toBe(0);
            });
        });

        describe('git packages', () => {
            beforeEach(() => {
                config.allowGithub = true;
                config.requireGitCommit = false;
            });

            test('should return error on github package when git is disabled', () => {
                const dependencies = {       
                    'toffeenut':'github:swernimo/toffeenut',
                };
    
                config.allowGithub = false;
                const actual = checkPackage.checkDependencies(dependencies, config);
    
                expect(actual.length).toBe(1);
                expect(actual).toContain("Package toffeenut is set to a git URL and git is not allowed.");
            });
    
            test('should not error on git package when git is enabled', () => {
                const dependencies = {       
                    'toffeenut':'git+https://github.com/visionmedia/express.git',
                };
    
                config.allowGithub = false;
                const actual = checkPackage.checkDependencies(dependencies, config);
    
                expect(actual.length).toBe(1);
                expect(actual).toContain("Package toffeenut is set to a git URL and git is not allowed.");
            });
    
            test('should not error on github package when git is enabled', () => {
                const dependencies = {       
                    'toffeenut':'github:swernimo/toffeenut',
                };
    
                config.allowGithub = true;
                const actual = checkPackage.checkDependencies(dependencies, config);
    
                expect(actual.length).toBe(0);
            });
    
            test('should not return error on git package when git is disabled', () => {
                const dependencies = {       
                    'toffeenut':'git+https://github.com/visionmedia/express.git',
                };
    
                config.allowGithub = true;
                const actual = checkPackage.checkDependencies(dependencies, config);
    
                expect(actual.length).toBe(0);
            });
    
            describe('require git commit', () => {
                test('should return error when git package does not include a commit', () => {
                    const dependencies = {       
                        'toffeenut':'git+https://github.com/visionmedia/express.git',
                    };
        
                    config.requireGitCommit = true;
                    config.allowGithub = true;
        
                    const actual = checkPackage.checkDependencies(dependencies, config);
                    expect(actual.length).toBe(1);
                });
        
                test('should return error when git package does not include a commit', () => {
                    const dependencies = {       
                        'toffeenut':'git+https://github.com/visionmedia/express.git#',
                    };
        
                    config.requireGitCommit = true;
                    config.allowGithub = true;
        
                    const actual = checkPackage.checkDependencies(dependencies, config);
                    expect(actual.length).toBe(1);
                });
    
                test('should not return error when git package includes a commit', () => {
                    const dependencies = {       
                        'toffeenut':'git+https://github.com/visionmedia/express.git#fbbc64657d65221d6262256311a43f5b0a4f7e9d',
                    };
        
                    config.requireGitCommit = true;
                    config.allowGithub = true;
        
                    const actual = checkPackage.checkDependencies(dependencies, config);
                    expect(actual.length).toBe(0);
                });
            });
        });
    });
});