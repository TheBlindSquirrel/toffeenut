import { ICheckPackageJsonConfig } from './ICheckPackageJsonConfig';
import { ISingleExportConfig } from './ISingleExportConfig';
import { IHexColorsConfig } from './IHexColorsConfig';
import { IPluginOnlyCalledOnceConfig } from './IPluginOnlyCalledOnceConfig';

export interface IToffeenutConfig {
    checkPackageJson: ICheckPackageJsonConfig,
    singleExport: ISingleExportConfig,
    hexColors: IHexColorsConfig,
    pluginOnlyCalledOnce: IPluginOnlyCalledOnceConfig
}