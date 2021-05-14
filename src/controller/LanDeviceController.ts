import ICloudDeviceConstrucotr from '../ts/interface/ICloudDeviceConstrucotr';
import { ICloudDeviceParams } from '../ts/interface/ICloudDeviceParams';
import ILanDeviceConstrucotr from '../ts/interface/ILanDeviceConstrucotr';
import AuthUtils from '../utils/lanControlAuthenticationUtils';

abstract class LanDeviceController {
    abstract entityId: string;

    deviceId: string;
    port: number;
    disabled: boolean;
    type: number = 2;
    target?: string;
    ip?: string;
    iv?: string;
    encryptedData?: string;
    devicekey?: string;
    selfApikey?: string;
    deviceName?: string;
    extra?: ICloudDeviceConstrucotr['extra'];
    params?: ICloudDeviceParams;
    online: boolean;
    index?: number;
    parseEncryptedData!: () => any;

    constructor(props: ILanDeviceConstrucotr) {
        const { deviceId, ip, port = 8081, disabled, encryptedData, iv, target, index } = props;
        this.ip = ip;
        this.target = target;
        this.port = port;
        this.deviceId = deviceId;
        this.iv = iv;
        this.disabled = disabled;
        this.encryptedData = encryptedData;
        this.online = true;
        if (index) {
            this.index = index;
        }
    }
}

LanDeviceController.prototype.parseEncryptedData = function () {
    try {
        if (this.iv && this.devicekey && this.encryptedData) {
            const res = AuthUtils.decryptionData({
                iv: this.iv,
                key: this.devicekey,
                data: this.encryptedData,
            });
            return JSON.parse(res);
        }
        return null;
    } catch (error) {
        console.log('Jia ~ file: LanDeviceController.ts ~ line 82 ~ error', error);
        return null;
    }
};

export default LanDeviceController;
