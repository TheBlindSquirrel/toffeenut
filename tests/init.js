const fs = require('fs');

const init = function() {
    fs.writeFileSync('./toffeenut.config.json', '{ \
       "checkPackageJson": { }, \
       "singleExport": { "allowInterfaces" : true } \
    }');
}

module.exports = init;