import CheckPackageJson from "../src/checkPackageJson";
import Init from "../src/init";
import Run from "../src/run";
import * as argv from 'minimist';
import SingleExport from "../src/singleExport";
import HexColors from "../src/hexColors";

export default class Toffeenut {
    private _init: Init;
    private _run: Run;

    constructor() {
        this._init = new Init();
        this._run = new Run(new CheckPackageJson(), new SingleExport(), new HexColors());
    }

    public run(): void {
        if (argv.default()._){
            if(argv.default()._.length > 1) {
                //throw error. use color -> red
            }
            const commandName = argv.default()._[0];
            switch(commandName) {
                case 'init':
                    this._init.run();
                    break;
                case 'run':
                    this._run.go();
                    break;
            }
        }
    }
}



