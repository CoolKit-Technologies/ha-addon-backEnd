import ICloudDeviceConstrucotr from '../ts/interface/ICloudDeviceConstrucotr';

abstract class CloudDeviceController {
    type: number = 4;
    rssi: number;
    apikey: string;
    abstract deviceName: string;
    abstract uiid: number;
    abstract deviceId: string;
    abstract disabled: boolean;
    abstract entityId: string;
    abstract extra: ICloudDeviceConstrucotr['extra'];
    constructor(data: ICloudDeviceConstrucotr) {
        this.rssi = data.params.rssi;
        this.apikey = data.apikey;
    }
}

export default CloudDeviceController;
