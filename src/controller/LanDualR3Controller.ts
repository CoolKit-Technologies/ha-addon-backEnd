import axios from 'axios';
import { setSwitches } from '../apis/lanDeviceApi';
import { updateStates } from '../apis/restApi';
import ICloudDeviceConstrucotr from '../ts/interface/ICloudDeviceConstrucotr';
import { ICloudDualR3Params } from '../ts/interface/ICloudDeviceParams';
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

class LanDualR3Controller extends LanDeviceController {
    params?: ICloudDualR3Params;
    entityId: string;
    maxChannel?: number;
    channelName?: { [key: string]: string };
    setSwitch!: (switches: TypeSwitch[]) => Promise<void>;
    updateState!: (switches: TypeSwitches) => Promise<any>;
    constructor(props: TypeConstrucotr) {
        const { deviceId } = props;
        super(props);
        this.entityId = `switch.${deviceId}`;
    }
}

LanDualR3Controller.prototype.setSwitch = async function (switches) {
    // let apikey = getDataSync('user.json', ['user', 'apikey']);
    if (this.devicekey && this.selfApikey) {
        const res = await setSwitches({
            ip: this.ip! || this.target!,
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

LanDualR3Controller.prototype.updateState = async function (switches) {
    if (this.disabled) {
        return;
    }
    switches &&
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

export default LanDualR3Controller;
