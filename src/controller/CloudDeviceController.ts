import ICloudDeviceConstrucotr from '../ts/interface/ICloudDeviceConstrucotr';

abstract class CloudDeviceController {
    type: number = 4;
    rssi: number;
    apikey: string;
    deviceName: string;
    deviceId: string;
    extra: ICloudDeviceConstrucotr['extra'];
    abstract params: ICloudDeviceConstrucotr['params'];
    abstract uiid: number;
    abstract disabled: boolean;
    abstract entityId: string;
    abstract online: boolean;
    constructor(data: ICloudDeviceConstrucotr) {
        this.rssi = data.params.rssi;
        this.apikey = data.apikey;
        this.deviceId = data.deviceId;
        this.deviceName = data.deviceName;
        this.extra = data.extra;
    }
}

export default CloudDeviceController;
