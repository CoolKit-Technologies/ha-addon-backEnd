import _ from 'lodash';
import { setSwitches } from '../apis/lanDeviceApi';
import { updateStates } from '../apis/restApi';
import { ICloudMultiChannelSwitchParams } from '../ts/interface/ICloudDeviceParams';
import ILanDeviceConstrucotr from '../ts/interface/ILanDeviceConstrucotr';
import mergeDeviceParams from '../utils/mergeDeviceParams';
import LanDeviceController from './LanDeviceController';

type TypeSwitch = {
    outlet: number;
    switch: string;
};
type TypeSwitches = TypeSwitch[];

class LanMultiChannelSwitchController extends LanDeviceController {
    entityId: string;
    params?: ICloudMultiChannelSwitchParams;
    maxChannel?: number;
    channelName?: { [key: string]: string };
    setSwitch!: (switches: TypeSwitch[]) => Promise<0 | -1>;
    updateState!: (switches: TypeSwitches) => Promise<any>;
    constructor(props: ILanDeviceConstrucotr) {
        const { deviceId } = props;
        super(props);
        this.entityId = `switch.${deviceId}`;
    }
}

LanMultiChannelSwitchController.prototype.setSwitch = async function (switches) {
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
        if (_.get(res, ['data', 'error']) === 0) {
            this.updateState(switches);
            this.params = mergeDeviceParams(this.params, { switches });
            return 0;
        }
    }
    return -1;
};

LanMultiChannelSwitchController.prototype.updateState = async function (switches) {
    if (this.disabled) {
        return;
    }
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

export default LanMultiChannelSwitchController;
