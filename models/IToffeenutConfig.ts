import { ICheckPackageJsonConfig } from './ICheckPackageJsonConfig';
import { ISingleExportConfig } from './ISingleExportConfig';
import { IHexColorsConfig } from './IHexColorsConfig';

export interface IToffeenutConfig {
    checkPackageJson: ICheckPackageJsonConfig,
    singleExport: ISingleExportConfig,
    hexColors: IHexColorsConfig
}