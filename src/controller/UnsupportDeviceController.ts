import CloudDeviceController from './CloudDeviceController';
import { ICloudDeviceParams, ICloudSwitchParams } from '../ts/interface/ICloudDeviceParams';
import ICloudDeviceConstrucotr from '../ts/interface/ICloudDeviceConstrucotr';
class UnsupportDeviceController {
    uiid: number = 1;
    params: ICloudDeviceParams;
    online: boolean;
    constructor(params: ICloudDeviceConstrucotr<ICloudDeviceParams>) {
        this.params = params.params;
        this.uiid = params.extra.uiid;
        this.online = params.online;
    }
}

export default UnsupportDeviceController;
