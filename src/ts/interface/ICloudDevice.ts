import { ICloudDeviceParams } from './ICloudDeviceParams';
interface ICloudDevice<P = ICloudDeviceParams> {
    name: string;
    deviceid: string;
    apikey: string;
    extra: {
        model: string;
        ui: string;
        uiid: number;
        description: string;
        manufacturer: string;
        mac: string;
        apmac: string;
        modelInfo: string;
        brandId: string;
        staMac: string;
        chipid: string;
    };
    brandName: string;
    brandLogo: string;
    showBrand: false;
    productModel: string;
    devConfig: Object;
    settings: Object;
    family: {
        familyid: string;
        index: number;
    };
    shareTo: string[];
    devicekey: string;
    online: true;
    params: P;
    denyFeatures: string[];
    tags?: {
        ck_channel_name: {
            [key: string]: string;
        };
    };
}

export default ICloudDevice;
