const checkPackageJson = require('./checkPackageJson');

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
        };
    });

    describe('run', () => {
        beforeEach(() => {
            jest.restoreAllMocks();
        });

        test('should call check dependencies twice', () => {
            jest.spyOn(checkPackageJson, 'checkDependencies');
            checkPackageJson.run(config);
            expect(checkPackageJson.checkDependencies).toHaveBeenCalledTimes(2);
            jest.restoreAllMocks();
        });

        test('should return errors', () => {
            const errors = 'test error';
            jest.mock('./checkPackageJson', () => jest.fn());
            checkPackageJson.checkDependencies = jest.fn(() => { return [errors] })
            const actual = checkPackageJson.run(config);
            expect(actual).toContain(errors);
        });
    });
});