const fs = require('fs');

const init = function() {
    fs.writeFileSync('./toffeenut.config.json', '{ \r\n\
       "checkPackageJson": { \r\n\
        "enabled": false \r\n\
       \t\t}, \r\n\
       "singleExport": { \r\n\
        "allowInterfaces" : true, \r\n\
        "enabled": true \r\n\
        \t\t}\r\n \
    }');
}

module.exports = init;