import CloudDeviceController from './CloudDeviceController';
import { ICloudSwitchParams } from '../ts/interface/ICloudDeviceParams';
import ICloudDeviceConstrucotr from '../ts/interface/ICloudDeviceConstrucotr';
import { updateStates } from '../apis/restApi';
import { getDataSync } from '../utils/dataUtil';
import coolKitWs from 'coolkit-ws';
class CloudSwitchController extends CloudDeviceController {
    disabled: boolean;
    entityId: string;
    deviceId: string;
    deviceName: string;
    apikey: string;
    uiid: number = 1;
    params: ICloudSwitchParams;
    extra: ICloudDeviceConstrucotr['extra'];
    updateSwitch!: (status: string) => Promise<void>;
    updateState!: (status: string) => Promise<void>;
    constructor(params: ICloudDeviceConstrucotr<ICloudSwitchParams>) {
        super();
        this.deviceId = params.deviceId;
        this.entityId = `switch.${params.deviceId}`;
        this.deviceName = params.deviceName;
        this.apikey = params.apikey;
        this.params = params.params;
        this.extra = params.extra;
        this.disabled = params.disabled!;
    }
}

CloudSwitchController.prototype.updateSwitch = async function (status) {
    const res = await coolKitWs.updateThing({
        deviceApikey: this.apikey,
        deviceid: this.deviceId,
        params: {
            switch: status,
        },
    });
    if (res.error === 0) {
        this.updateState(status);
    }
};

/**
 * @description 更新状态到HA
 */
CloudSwitchController.prototype.updateState = async function (status) {
    updateStates(this.entityId, {
        entity_id: this.entityId,
        state: status,
        attributes: {
            restored: true,
            supported_features: 0,
            friendly_name: this.deviceName,
            state: status,
        },
    });
};

export default CloudSwitchController;
