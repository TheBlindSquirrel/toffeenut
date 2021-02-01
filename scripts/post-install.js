const fs = require('fs');

class postInstall {
    constructor() {
        this.makeConfigfile();
    }

    makeConfigfile() {
        fs.copyFile('toffeenut.config.json', '../../toffeenut.config.json', () => {
            console.log('copy successful');
        });
    }
}

new postInstall();