import axios from 'axios';
import { setSwitches } from '../apis/lanDeviceApi';
import { updateStates } from '../apis/restApi';
import ICloudDeviceConstrucotr from '../ts/interface/ICloudDeviceConstrucotr';
import { ICloudDeviceParams } from '../ts/interface/ICloudDeviceParams';
import AuthUtils from '../utils/lanControlAuthenticationUtils';
import LanDeviceController from './LanDeviceController';
type TypeConstrucotr = {
    deviceId: string;
    ip: string;
    port?: number;
    disabled: boolean;
    encryptedData?: string;
    iv: string;
};
type TypeSwitch = {
    outlet: number;
    switch: string;
};
type TypeSwitches = TypeSwitch[];

class LanMultiChannelSwitchController extends LanDeviceController {
    params?: ICloudDeviceParams;
    deviceId: string;
    entityId: string;
    ip: string;
    port: number;
    disabled: boolean;
    iv?: string;
    encryptedData?: string;
    devicekey?: string;
    selfApikey?: string;
    deviceName?: string;
    maxChannel?: number;
    channelName?: { [key: string]: string };
    extra?: ICloudDeviceConstrucotr['extra'];
    setSwitch!: (switches: TypeSwitch[]) => Promise<void>;
    updateState!: (switches: TypeSwitches) => Promise<any>;
    constructor({ deviceId, ip, port = 8081, disabled, encryptedData, iv }: TypeConstrucotr) {
        super();
        this.deviceId = deviceId;
        this.ip = ip;
        this.port = port;
        this.entityId = `switch.${deviceId}`;
        this.disabled = disabled;
        this.iv = iv;
        this.encryptedData = encryptedData;
    }
}

LanMultiChannelSwitchController.prototype.setSwitch = async function (switches) {
    // let apikey = getDataSync('user.json', ['user', 'apikey']);
    if (this.devicekey && this.selfApikey) {
        const res = await setSwitches({
            ip: this.ip,
            port: this.port,
            deviceid: this.deviceId,
            devicekey: this.devicekey,
            selfApikey: this.selfApikey,
            data: JSON.stringify({
                switches,
            }),
        });
        if (res && res.data && res.data.error === 0) {
            this.updateState(switches);
        }
    }
};

LanMultiChannelSwitchController.prototype.updateState = async function (switches) {
    if (this.disabled) {
        return;
    }
    switches.forEach(({ outlet, switch: status }) => {
        const name = this.channelName ? this.channelName[outlet] : outlet + 1;
        updateStates(`${this.entityId}_${outlet + 1}`, {
            entity_id: `${this.entityId}_${outlet + 1}`,
            state: status,
            attributes: {
                restored: true,
                supported_features: 0,
                friendly_name: `${this.deviceName}-${name}`,
                state: status,
            },
        });
    });
};

export default LanMultiChannelSwitchController;
