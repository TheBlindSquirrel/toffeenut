const fs = require('fs');

const init = function() {
    fs.writeFileSync('./toffeenut.config.json', '{ \r\n\
       "checkPackageJson": { }, \r\n\
       "singleExport": { \r\n\
        "allowInterfaces" : true \r\n\
        \t}\r\n \
    }');
}

module.exports = init;