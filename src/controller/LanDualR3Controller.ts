import axios from 'axios';
import { setSwitches } from '../apis/lanDeviceApi';
import { updateStates } from '../apis/restApi';
import { ICloudDualR3Params } from '../ts/interface/ICloudDeviceParams';
import ILanDeviceConstrucotr from '../ts/interface/ILanDeviceConstrucotr';
import mergeDeviceParams from '../utils/mergeDeviceParams';
import LanDeviceController from './LanDeviceController';

type TypeSwitch = {
    outlet: number;
    switch: string;
};
type TypeSwitches = TypeSwitch[];
class LanDualR3Controller extends LanDeviceController {
    params?: ICloudDualR3Params;
    entityId: string;
    maxChannel: number = 2;
    channelName?: { [key: string]: string };
    setSwitch!: (switches: TypeSwitch[]) => Promise<void>;
    updateState!: (switches: TypeSwitches) => Promise<any>;
    constructor(props: ILanDeviceConstrucotr) {
        super(props);
        const { deviceId } = props;
        this.entityId = `switch.${deviceId}`;
    }
}

LanDualR3Controller.prototype.setSwitch = async function (switches) {
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
            this.params = mergeDeviceParams(this.params, { switches });
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
            let state = status;
            if (!this.online) {
                state = 'unavailable';
            }
            updateStates(`${this.entityId}_${outlet + 1}`, {
                entity_id: `${this.entityId}_${outlet + 1}`,
                state,
                attributes: {
                    restored: true,
                    supported_features: 0,
                    friendly_name: `${this.deviceName}-${name}`,
                    state,
                },
            });
        });
};

export default LanDualR3Controller;
