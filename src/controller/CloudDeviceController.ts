import ICloudDeviceConstrucotr from '../ts/interface/ICloudDeviceConstrucotr';

abstract class CloudDeviceController {
    type: number = 4;
    rssi: number;
    apikey: string;
    deviceName: string;
    devicekey: string;
    deviceId: string;
    index: number;
    online: boolean;
    extra: ICloudDeviceConstrucotr['extra'];
    abstract params: ICloudDeviceConstrucotr['params'];
    abstract uiid: number;
    abstract disabled: boolean;
    abstract entityId: string;
    constructor(data: ICloudDeviceConstrucotr) {
        this.rssi = data.params.rssi;
        this.apikey = data.apikey;
        this.deviceId = data.deviceId;
        this.deviceName = data.deviceName;
        this.extra = data.extra;
        this.index = data.index;
        this.online = data.online;
        this.devicekey = data.devicekey;
    }
}

export default CloudDeviceController;
