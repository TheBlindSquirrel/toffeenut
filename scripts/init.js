const fs = require('fs');

const init = function() {
    fs.writeFileSync('./toffeenut.config.json', '{ \r\n\
       "checkPackageJson": { \r\n\
        \t"enabled": false \r\n\
       \t}, \r\n\
       "singleExport": { \r\n\
        \t"rootPath" : \"\", \r\n\
        \t"enabled": true \r\n\
        \t},\r\n \
        "hexColors": { \r\n\
            \t"rootPath" : \"\", \r\n\
            \t"enabled": true, \r\n\
            \t"checkHTML" : false, \r\n\
            \t"checkForRGBA": false, \r\n\
            \t"ignoreDirectory" : \"\", \r\n\
            \t"colorsFilePath": \"\" \r\n\
        },\r\n \
    }');
}

module.exports = init;