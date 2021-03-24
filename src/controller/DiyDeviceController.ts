import axios from 'axios';
import { updateStates } from '../apis/restApi';
import TypeDiyDevice from '../ts/type/TypeMdnsDiyDevice';
type TypeConstrucotr = {
    deviceId: string;
    ip: string;
    port?: number;
    disabled: boolean;
    txt: TypeDiyDevice['txt'];
};

class DiyController {
    deviceId: string;
    entityId: string;
    ip: string;
    port: number;
    type: number = 1;
    disabled: boolean;
    txt: TypeDiyDevice['txt'];
    setSwitch!: (status: string) => Promise<void>;
    updateState!: (status: string) => Promise<void>;
    constructor({ deviceId, ip, port = 8081, disabled, txt }: TypeConstrucotr) {
        this.deviceId = deviceId;
        this.ip = ip;
        this.port = port;
        this.entityId = `switch.${deviceId}`;
        this.disabled = disabled;
        this.txt = txt;
    }
}

DiyController.prototype.setSwitch = async function (status) {
    axios
        .post(`http://${this.ip}:${this.port}/zeroconf/switch`, {
            sequence: Date.now(),
            deviceId: this.deviceId,
            data: {
                switch: status,
            },
        })
        .catch((e) => {
            console.log('控制DIY设备出错，设备id：', this.deviceId);
        });
};
DiyController.prototype.updateState = async function (status) {
    updateStates(this.entityId, {
        entity_id: this.entityId,
        state: status,
        attributes: {
            restored: true,
            supported_features: 0,
            friendly_name: this.entityId,
            state: status,
        },
    }).catch((e) => {
        console.log('更新到HA出错，设备id：', this.deviceId);
    });
};

export default DiyController;
