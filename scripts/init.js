const fs = require('fs');

const init = function() {
    fs.writeFileSync('./toffeenut.config.json', '{ \r\n\
       "checkPackageJson": { \r\n\
        \t"enabled": true, \r\n\
        \t"allowGithub": true,\r\n\
        \t"requireGitCommit": false,\r\n\
        \t"packagePath": "./package.json"\r\n\
       \t}, \r\n\
       "singleExport": { \r\n\
        \t"rootPath" : \"\", \r\n\
        \t"enabled": true \r\n\
        \t},\r\n \
        "hexColors": { \r\n\
            \t"rootPath" : \"\", \r\n\
            \t"enabled": true, \r\n\
            \t"checkHTML" : true, \r\n\
            \t"checkForRGBA": true, \r\n\
            \t"ignoreFiles" : [], \r\n\
            \t"colorsFilePath": \"\" \r\n\
        }\r\n \
    }');
}

module.exports = init;