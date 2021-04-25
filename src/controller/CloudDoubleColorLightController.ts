import CloudDeviceController from './CloudDeviceController';
import { IDoubleCloudLightParams } from '../ts/interface/ICloudDeviceParams';
import ICloudDeviceConstrucotr from '../ts/interface/ICloudDeviceConstrucotr';
import { updateStates } from '../apis/restApi';
import coolKitWs from 'coolkit-ws';
import _ from 'lodash';
import { TypeLtypeParams, TypeLtype } from '../ts/type/TypeLtype';
class CloudDoubleColorLightController extends CloudDeviceController {
    online: boolean;
    disabled: boolean;
    entityId: string;
    deviceName: string;
    apikey: string;
    uiid: number = 103;
    params: IDoubleCloudLightParams;
    ct: number;
    br: number;
    ltype: string;
    updateLight!: (params: { switch?: string; ct?: number; br?: number }) => Promise<void>;
    updateState!: (params: { switch: string; ltype: TypeLtype } & Partial<TypeLtypeParams>) => Promise<void>;

    constructor(params: ICloudDeviceConstrucotr<IDoubleCloudLightParams>) {
        super(params);
        const { ltype } = params.params;
        this.entityId = `light.${params.deviceId}`;
        this.deviceName = params.deviceName;
        this.apikey = params.apikey;
        this.disabled = params.disabled!;
        this.ltype = ltype;
        const { br, ct } = params.params[ltype];
        this.br = br;
        this.ct = 255 - ct;
        this.online = params.online;
        this.params = params.params;
    }
}

CloudDoubleColorLightController.prototype.updateLight = async function ({ switch: status = 'on', br, ct }) {
    if (this.disabled) {
        return;
    }
    let tmp: any = {};
    if (status === 'off') {
        tmp.switch = 'off';
    } else {
        tmp = {
            ltype: 'white' as TypeLtype,
            white: {
                br: br !== undefined ? br : this.br,
                ct: 255 - (ct !== undefined ? ct : this.ct),
            },
        };
    }
    const res = await coolKitWs.updateThing({
        deviceApikey: this.apikey,
        deviceid: this.deviceId,
        params: tmp,
    });
    if (res.error === 0) {
        console.log('Jia ~ file: CloudDoubleColorLightController.ts ~ line 80 ~ tmp', tmp);
        this.updateState(tmp);
    }
};

/**
 * @description 更新状态到HA
 */
CloudDoubleColorLightController.prototype.updateState = async function (params) {
    const { switch: status = 'on', ltype } = params;
    let br: number | undefined;
    let ct: number | undefined;
    const tmp = params[ltype];
    if (tmp) {
        const { br: tmpBr, ct: tmpCt } = tmp;
        br = tmpBr;
        ct = tmpCt;
    }
    updateStates(this.entityId, {
        entity_id: this.entityId,
        state: status,
        attributes: {
            restored: true,
            supported_features: 3,
            friendly_name: this.deviceName,
            state: status,
            min_mireds: 1,
            max_mireds: 255,
            light_type: ltype,
            brightness: (br !== undefined ? br : this.br) * 2.55,
            color_temp: 255 - (ct !== undefined ? ct : this.ct),
        },
    });
    if (status === 'on') {
        br !== undefined && (this.br = br);
        ct !== undefined && (this.ct = 255 - ct);
    }
};

export default CloudDoubleColorLightController;
