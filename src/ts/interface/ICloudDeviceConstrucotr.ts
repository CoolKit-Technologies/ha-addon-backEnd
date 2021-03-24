interface ICloudDeviceConstrucotr<T = any> {
    deviceId: string;
    deviceName: string;
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
        brandId?: string;
        chipid?: string;
        staMac: string;
    };
    params: T;
    disabled?: boolean;
}

export default ICloudDeviceConstrucotr;
