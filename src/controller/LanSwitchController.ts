import axios from 'axios';
import { updateStates } from '../apis/restApi';
import AuthUtils from '../utils/lanControlAuthenticationUtils';
type TypeConstrucotr = {
    deviceId: string;
    ip: string;
    port?: number;
    disabled: boolean;
    encryptedData?: string;
    iv: string;
};

class LanDeviceController {
    deviceId: string;
    entityId: string;
    ip: string;
    port: number;
    type: number = 2;
    disabled: boolean;
    devicekey?: string;
    encryptedData?: string;
    iv?: string;
    setSwitch!: (status: string) => Promise<void>;
    updateState!: (status: string) => Promise<any>;
    parseEncryptedData!: () => null | Object;
    constructor({ deviceId, ip, port = 8081, disabled, encryptedData, iv }: TypeConstrucotr) {
        this.deviceId = deviceId;
        this.ip = ip;
        this.port = port;
        this.entityId = `switch.${deviceId}`;
        this.disabled = disabled;
        this.iv = iv;
        this.encryptedData = encryptedData;
    }
}

LanDeviceController.prototype.setSwitch = async function (status) {
    // let apikey = getDataSync('user.json', ['user', 'apikey']);
    console.log('lan设备=========');
    if (this.devicekey) {
        const iv = AuthUtils.encryptionBase64(`12345${Date.now()}67890`.slice(0, 16));
        axios.post(`http://${this.ip}:${this.port}/zeroconf/switch`, {
            sequence: Date.now(),
            encrypt: true,
            deviceId: this.deviceId,
            iv,
            data: AuthUtils.encryptionData({
                iv,
                key: this.devicekey,
                data: JSON.stringify({
                    switch: status,
                }),
            }),
        });
    }
};

LanDeviceController.prototype.updateState = async function (status) {
    const res = await updateStates(this.deviceId, {
        entity_id: `switch.${this.deviceId}`,
        state: status,
        attributes: {
            restored: true,
            supported_features: 0,
            friendly_name: this.deviceId,
            state: status,
        },
    });
    console.log(res);
};

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
