import AuthUtils from '../utils/lanControlAuthenticationUtils';

abstract class LanDeviceController {
    type: number = 2;
    abstract deviceId: string;
    abstract entityId: string;
    abstract ip: string;
    abstract port: number;
    abstract disabled: boolean;
    abstract iv?: string;
    abstract encryptedData?: string;
    abstract devicekey?: string;
    abstract selfApikey?: string;
    abstract deviceName?: string;
    parseEncryptedData!: () => null | Object;
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
