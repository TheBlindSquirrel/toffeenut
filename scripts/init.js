const fs = require('fs');

const init = function() {
    fs.writeFileSync('./toffeenut.config.json', '{ \r\n\
       "checkPackageJson": { \r\n\
        \t"enabled": false \r\n\
       \t}, \r\n\
       "singleExport": { \r\n\
        \t"allowInterfaces" : true, \r\n\
        \t"enabled": true \r\n\
        \t}\r\n \
    }');
}

module.exports = init;