import { ICloudDeviceParams } from './ICloudDeviceParams';

interface ICloudDeviceConstrucotr<T = ICloudDeviceParams> {
    deviceId: string;
    devicekey: string;
    deviceName: string;
    apikey: string;
    online: boolean;
    index: number;
    extra: {
        model: string;
        ui: string;
        uiid: number;
        description: string;
        manufacturer: string;
        mac: string;
        apmac: string;
        modelInfo: string;
        brandId?: string;
        chipid?: string;
        staMac: string;
    };
    params: T;
    disabled?: boolean;
    tags?: {
        ck_channel_name: {
            [key: string]: string;
        };
    };
}

export default ICloudDeviceConstrucotr;
