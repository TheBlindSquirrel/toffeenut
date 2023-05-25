const singleExport = require('./singleExport');

const config = {
    rootPath: '',
    enabled: true
}

describe('single export', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    })
    
    describe('run', () => {
        describe('without root path', () => {
            test('should return error when root path is null', () => {
                config.rootPath = null;
                const result = singleExport.run(config);
                expect(result).toContain('Single Export Path cannot be empty');
            });
    
            test('should return error when root path is undefined', () => {
                config.rootPath = null;
                const result = singleExport.run(config);
                expect(result).toContain('Single Export Path cannot be empty');
            });
    
            test('should return error when root path is empty string', () => {
                config.rootPath = '';
                const result = singleExport.run(config);
                expect(result).toContain('Single Export Path cannot be empty');
            });
    
            test('should return error when root path is only spaces', () => {
                config.rootPath = '     ';
                const result = singleExport.run(config);
                expect(result).toContain('Single Export Path cannot be empty');
            });
        });
    
        test('should call get all files', () => {
            config.rootPath = './testFiles';
            jest.spyOn(singleExport, 'getAllFiles');
            singleExport.run(config);
            expect(jest.mocked(singleExport.getAllFiles).mock.calls).toHaveLength(1);
        });
    
        test('should call validate file', () => {
            config.rootPath = './testFiles/singleExport/subfolder/';
            jest.spyOn(singleExport, 'validateFile');
            jest.mocked(singleExport.getAllFiles).mockImplementation(() => {
                return ['./testFiles/singleExport/subfolder/validClass.ts'];
            });
            singleExport.run(config);
            expect(jest.mocked(singleExport.validateFile).mock.calls).toHaveLength(1);
        });
    });
    
    describe('get all files', () => {
        test('should only include typescript file', () => {
            const files = singleExport.getAllFiles('./testFiles');
            const tsFiles = files.filter(f => f.endsWith('.ts'));
            expect(tsFiles.length).toBe(files.length);
        });
    });

    describe('validate file', () => {
        test('multiple classes should fail', () => {
            const fileName = 'multipleClassExports.ts';
            const msg = singleExport.validateFile('export class Class1 {\n\n}\n\nexport class Class2 {\n    \n}\n\nexport default class Class3 {\n    \n}', fileName);

            expect(msg).toBe(`${fileName} has multiple interface or class exports`);
        });

        test('multiple interfaces should fail', () => {
            const fileName = 'multipleInterfaceExports.ts';
            const msg = singleExport.validateFile('export interface ISomeInterface {\n\n}\n\nexport default interface IDefaultInterface {\n    \n}', fileName);

            expect(msg).toBe(`${fileName} has multiple interface or class exports`);
        });

        test('mixed classes and interfaces should fail', () => {
            const fileName = 'mixedExports.ts';
            const msg = singleExport.validateFile('export default interface IInterface {\n\n}\n\nexport class MyClass {\n\n}', fileName);

            expect(msg).toBe(`${fileName} has multiple interface or class exports`);
        });

        test('single classes should pass', () => {
            const fileName = 'validClass.ts';
            const msg = singleExport.validateFile('export default class ValidClass {\n    \n}', fileName);

            expect(msg).toBe(undefined);
        });

        test('single interface should pass', () => {
            const fileName = 'validInterface.ts';
            const msg = singleExport.validateFile('export interface ITestInterface {\n    \n}', fileName);

            expect(msg).toBe(undefined);
        });
    });
});