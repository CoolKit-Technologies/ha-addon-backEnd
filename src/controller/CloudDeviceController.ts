import ICloudDeviceConstrucotr from '../ts/interface/ICloudDeviceConstrucotr';

abstract class CloudDeviceController {
    type: number = 4;
    rssi: number;
    abstract deviceName: string;
    abstract uiid: number;
    abstract deviceId: string;
    abstract disabled: boolean;
    abstract entityId: string;
    abstract extra: ICloudDeviceConstrucotr['extra'];
    constructor(data: ICloudDeviceConstrucotr) {
        this.rssi = data.params.rssi;
    }
}

export default CloudDeviceController;
