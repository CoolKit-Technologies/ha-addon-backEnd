import CloudDeviceController from './CloudDeviceController';
import { ICloudDeviceParams, ICloudDimmingParams } from '../ts/interface/ICloudDeviceParams';
import ICloudDeviceConstrucotr from '../ts/interface/ICloudDeviceConstrucotr';
import { updateStates } from '../apis/restApi';
import coolKitWs from 'coolkit-ws';
class CloudDimmingController extends CloudDeviceController {
    disabled: boolean;
    entityId: string;
    uiid: number = 36;
    params: ICloudDimmingParams;
    updateLight!: (params: { switch: string; bright?: number }) => Promise<void>;
    updateState!: (params: { status: string; bright: number }) => Promise<void>;
    constructor(params: ICloudDeviceConstrucotr<ICloudDimmingParams>) {
        super(params);
        this.entityId = `light.${params.deviceId}`;
        this.disabled = params.disabled!;
        this.params = params.params;
    }
}

CloudDimmingController.prototype.updateLight = async function (params) {
    console.log('Jia ~ file: CloudDimmingController.ts ~ line 30 ~ params', params);
    const res = await coolKitWs.updateThing({
        ownerApikey: this.apikey,
        deviceid: this.deviceId,
        params,
    });
    console.log('Jia ~ file: CloudDimmingController.ts ~ line 35 ~ res', res);
};

/**
 * @description 更新状态到HA
 */
CloudDimmingController.prototype.updateState = async function ({ status, bright }) {
    if (this.disabled) {
        return;
    }
    let state = status;
    if (!this.online) {
        state = 'unavailable';
    }

    updateStates(this.entityId, {
        entity_id: this.entityId,
        state,
        attributes: {
            restored: true,
            supported_features: 1,
            friendly_name: this.deviceName,
            state,
            brightness: bright * 2.55,
        },
    });
};

export default CloudDimmingController;
