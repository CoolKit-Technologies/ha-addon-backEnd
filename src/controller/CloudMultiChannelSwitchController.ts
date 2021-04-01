import CloudDeviceController from './CloudDeviceController';
import { ICloudMultiChannelSwitchParams } from '../ts/interface/ICloudDeviceParams';
import ICloudDeviceConstrucotr from '../ts/interface/ICloudDeviceConstrucotr';
import { updateStates } from '../apis/restApi';
import coolKitWs from 'coolkit-ws';
import { getMaxChannelByUiid } from '../config/channelMap';
class CloudMultiChannelSwitchController extends CloudDeviceController {
    disabled: boolean;
    entityId: string;
    deviceId: string;
    deviceName: string;
    apikey: string;
    uiid: number;
    params: ICloudMultiChannelSwitchParams;
    extra: ICloudDeviceConstrucotr['extra'];
    maxChannel!: number;
    updateSwitch!: (switches: ICloudMultiChannelSwitchParams['switches']) => Promise<void>;
    updateState!: (switches: ICloudMultiChannelSwitchParams['switches']) => Promise<void>;
    constructor(params: ICloudDeviceConstrucotr<ICloudMultiChannelSwitchParams>) {
        super(params);
        this.deviceId = params.deviceId;
        this.entityId = `switch.${params.deviceId}`;
        this.deviceName = params.deviceName;
        this.apikey = params.apikey;
        this.params = params.params;
        this.extra = params.extra;
        this.disabled = params.disabled!;
        this.uiid = params.extra.uiid;
        this.maxChannel = getMaxChannelByUiid(params.extra.uiid);
    }
}

CloudMultiChannelSwitchController.prototype.updateSwitch = async function (switches) {
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
CloudMultiChannelSwitchController.prototype.updateState = async function (switches) {
    if (this.disabled) {
        return;
    }
    switches.forEach(({ outlet, switch: status }) => {
        updateStates(`${this.entityId}_${outlet + 1}`, {
            entity_id: `${this.entityId}_${outlet + 1}`,
            state: status,
            attributes: {
                restored: true,
                supported_features: 0,
                friendly_name: `${this.deviceName}-${outlet + 1}`,
                state: status,
            },
        });
    });
};

export default CloudMultiChannelSwitchController;
