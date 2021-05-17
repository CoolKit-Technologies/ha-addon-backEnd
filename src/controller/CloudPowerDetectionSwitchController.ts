import CloudDeviceController from './CloudDeviceController';
import { ICloudPowerDetectionSwitchParams } from '../ts/interface/ICloudDeviceParams';
import ICloudDeviceConstrucotr from '../ts/interface/ICloudDeviceConstrucotr';
import { updateStates } from '../apis/restApi';
import coolKitWs from 'coolkit-ws';
import { getDataSync } from '../utils/dataUtil';
class CloudPowerDetectionSwitchController extends CloudDeviceController {
    online: boolean;
    disabled: boolean;
    entityId: string;
    uiid: number;
    params: ICloudPowerDetectionSwitchParams;
    updateSwitch!: (status: string) => Promise<void>;
    updateState!: (params: { status: string; power?: string; current?: string; voltage?: string }) => Promise<void>;
    current?: string;
    voltage?: string;
    power: string;
    state: string;
    rate?: number;
    constructor(params: ICloudDeviceConstrucotr<ICloudPowerDetectionSwitchParams>) {
        super(params);
        this.entityId = `switch.${params.deviceId}`;
        this.params = params.params;
        this.disabled = params.disabled!;
        this.state = params.params.switch;

        this.uiid = params.extra.uiid;
        this.power = params.params.power;
        this.online = params.online;
        this.rate = +getDataSync('rate.json', [this.deviceId]) || 0;

        if (this.uiid === 32) {
            this.current = params.params.current;
            this.voltage = params.params.voltage;
        }
        // // 如果电流电压功率有更新就通知我
        // setInterval(() => {
        //     coolKitWs.updateThing({
        //         deviceApikey: this.apikey,
        //         deviceid: this.deviceId,
        //         params: { uiActive: 120 },
        //     });
        // }, 120000);
    }
}

CloudPowerDetectionSwitchController.prototype.updateSwitch = async function (status) {
    const res = await coolKitWs.updateThing({
        ownerApikey: this.apikey,
        deviceid: this.deviceId,
        params: {
            switch: status,
        },
    });

    if (res.error === 0) {
        this.updateState({ status });
        this.params.switch = status;
    }
};

/**
 * @description 更新状态到HA
 */
CloudPowerDetectionSwitchController.prototype.updateState = async function ({ power, current, voltage, status }) {
    if (this.disabled) {
        return;
    }
    let state = status;
    if (!this.online) {
        state = 'unavailable';
    }
    let attributes: any = {
        restored: true,
        supported_features: 0,
        friendly_name: this.deviceName,
        power: `${power || this.power || 0} W`,
        state: state || this.state,
    };

    if (this.uiid === 32) {
        attributes = {
            ...attributes,
            current: `${current || this.current || 0} A`,
            voltage: `${voltage || this.voltage || 0} V`,
        };
    }

    const res = await updateStates(this.entityId, {
        entity_id: this.entityId,
        state: state || this.state,
        attributes,
    });

    state && (this.state = state);
    power && (this.power = power);
    current && (this.current = current);
    voltage && (this.voltage = voltage);
};

export default CloudPowerDetectionSwitchController;
