export default interface ILanDeviceConstrucotr {
    deviceId: string;
    ip: string;
    target: string;
    port?: number;
    disabled: boolean;
    encryptedData?: string;
    iv: string;
    index?: number;
}
