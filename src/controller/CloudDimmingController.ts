import CloudDeviceController from './CloudDeviceController';
import { ICloudDimmingParams } from '../ts/interface/ICloudDeviceParams';
import ICloudDeviceConstrucotr from '../ts/interface/ICloudDeviceConstrucotr';
import { updateStates } from '../apis/restApi';
import coolKitWs from 'coolkit-ws';
class CloudDimmingController extends CloudDeviceController {
    disabled: boolean;
    entityId: string;
    deviceId: string;
    deviceName: string;
    apikey: string;
    uiid: number = 36;
    params: ICloudDimmingParams;
    extra: ICloudDeviceConstrucotr['extra'];
    updateLight!: (params: { switch: string; bright?: number }) => Promise<void>;
    updateState!: (params: { status: string; bright: number }) => Promise<void>;
    constructor(params: ICloudDeviceConstrucotr<ICloudDimmingParams>) {
        super();
        this.deviceId = params.deviceId;
        this.entityId = `light.${params.deviceId}`;
        this.deviceName = params.deviceName;
        this.apikey = params.apikey;
        this.params = params.params;
        this.extra = params.extra;
        this.disabled = params.disabled!;
    }
}

CloudDimmingController.prototype.updateLight = async function (params) {
    const res = await coolKitWs.updateThing({
        deviceApikey: this.apikey,
        deviceid: this.deviceId,
        params,
    });
    // todo
    if (res.error === 0) {
        // this.updateState({
        //     status: params.state!,
        // });
    }
};

/**
 * @description 更新状态到HA
 */
CloudDimmingController.prototype.updateState = async function ({ status, bright }) {
    updateStates(this.entityId, {
        entity_id: this.entityId,
        state: status,
        attributes: {
            restored: true,
            supported_features: 1,
            friendly_name: this.deviceName,
            state: status,
            brightness: bright * 2.55,
        },
    });
};

export default CloudDimmingController;
