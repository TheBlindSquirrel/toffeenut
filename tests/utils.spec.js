const utils = require('../scripts/utils');
const Path = require("path");

describe('utils', () => {
    const path = './testFiles';

    beforeEach(() => {
        jest.clearAllMocks();
    });
    
    describe('get all files', () => {
        test('it should not include ignored extensions', () => {
            const files = utils.getAllFiles(path, ['.html']);
            const exts = files.map(x => Path.extname(x));
            expect(exts.includes('.html')).toBeFalsy();
        });
    });
});