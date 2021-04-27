import CloudDeviceController from './CloudDeviceController';
import { ICloudDualR3Params } from '../ts/interface/ICloudDeviceParams';
import ICloudDeviceConstrucotr from '../ts/interface/ICloudDeviceConstrucotr';
import { updateStates } from '../apis/restApi';
import coolKitWs from 'coolkit-ws';

class CloudDualR3Controller extends CloudDeviceController {
    params: ICloudDualR3Params;
    online: boolean;
    disabled: boolean;
    entityId: string;
    uiid: number;
    maxChannel: number = 2;
    channelName?: { [key: string]: string };
    updateSwitch!: (switches: ICloudDualR3Params['switches']) => Promise<void>;
    updateState!: (switches: ICloudDualR3Params['switches']) => Promise<void>;
    constructor(params: ICloudDeviceConstrucotr<ICloudDualR3Params>) {
        super(params);
        this.entityId = `switch.${params.deviceId}`;
        this.params = params.params;
        this.disabled = params.disabled!;
        this.uiid = params.extra.uiid;
        this.channelName = params.tags?.ck_channel_name;
        this.online = params.online;
    }
}

CloudDualR3Controller.prototype.updateSwitch = async function (switches) {
    const res = await coolKitWs.updateThing({
        deviceApikey: this.apikey,
        deviceid: this.deviceId,
        params: {
            switches,
        },
    });
    if (res.error === 0) {
        this.updateState(switches);
    }
};

/**
 * @description 更新状态到HA
 */
CloudDualR3Controller.prototype.updateState = async function (switches) {
    console.log('Jia ~ file: CloudDualR3Controller.ts ~ line 44 ~ switches', switches);
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

export default CloudDualR3Controller;
