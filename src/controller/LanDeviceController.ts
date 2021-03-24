import axios from 'axios';
import { updateStates } from '../apis/restApi';
import TypeMdnsLanDevice from '../ts/type/TypeMdnsLanDevice';
import AuthUtils from '../utils/lanControlAuthenticationUtils';
import { getDataSync } from '../utils/dataUtil';
type TypeConstrucotr = {
    deviceId: string;
    ip: string;
    port?: number;
    disabled: boolean;
    apikey?: string;
    txt: TypeMdnsLanDevice['txt'];
};

class LanDeviceController {
    deviceId: string;
    entityId: string;
    ip: string;
    port: number;
    type: number = 2;
    disabled: boolean;
    txt: TypeMdnsLanDevice['txt'];
    apikey: string;
    setSwitch!: (status: string) => Promise<void>;
    updateState!: (status: string) => Promise<any>;
    constructor({ deviceId, ip, port = 8081, disabled, txt }: TypeConstrucotr) {
        this.deviceId = deviceId;
        this.ip = ip;
        this.port = port;
        this.entityId = `switch.${deviceId}`;
        this.disabled = disabled;
        this.txt = txt;
        const apikey = getDataSync('user.json', ['user', 'apikey']) || '';
        this.apikey = apikey;
    }
}

LanDeviceController.prototype.setSwitch = async function (status) {
    // let apikey = getDataSync('user.json', ['user', 'apikey']);
    console.log('lan设备=========');
    const iv = AuthUtils.encryptionBase64(`12345${Date.now()}67890`.slice(0, 16));
    axios.post(`http://${this.ip}:${this.port}/zeroconf/switch`, {
        sequence: Date.now(),
        encrypt: true,
        deviceId: this.deviceId,
        iv,
        data: AuthUtils.encryptionData({
            iv,
            key: this.apikey,
            data: JSON.stringify({
                switch: status,
            }),
        }),
    });
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

export default LanDeviceController;
