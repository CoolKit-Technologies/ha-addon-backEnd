import ICloudDeviceConstrucotr from '../ts/interface/ICloudDeviceConstrucotr';

abstract class CloudDeviceController {
    type: number = 4;
    abstract deviceName: string;
    abstract uiid: number;
    abstract deviceId: string;
    abstract disabled: boolean;
    abstract extra: ICloudDeviceConstrucotr['extra'];
    constructor() {}
}

export default CloudDeviceController;
