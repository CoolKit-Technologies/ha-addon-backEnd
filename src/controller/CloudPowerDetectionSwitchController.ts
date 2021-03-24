import CloudDeviceController from './CloudDeviceController';
import { ICloudPowerDetectionSwitchParams } from '../ts/interface/ICloudDeviceParams';
import ICloudDeviceConstrucotr from '../ts/interface/ICloudDeviceConstrucotr';
import { updateStates } from '../apis/restApi';
import coolKitWs from 'coolkit-ws';
class CloudPowerDetectionSwitchController extends CloudDeviceController {
    disabled: boolean;
    entityId: string;
    deviceId: string;
    deviceName: string;
    apikey: string;
    uiid: number = 32;
    params: ICloudPowerDetectionSwitchParams;
    extra: ICloudDeviceConstrucotr['extra'];
    updateSwitch!: (status: string) => Promise<void>;
    updateState!: (params: { status: string; power?: string; current?: string; voltage?: string }) => Promise<void>;
    current: string;
    voltage: string;
    power: string;
    state: string;
    constructor(params: ICloudDeviceConstrucotr<ICloudPowerDetectionSwitchParams>) {
        super();
        this.deviceId = params.deviceId;
        this.entityId = `switch.${params.deviceId}`;
        this.deviceName = params.deviceName;
        this.apikey = params.apikey;
        this.params = params.params;
        this.extra = params.extra;
        this.disabled = params.disabled!;
        this.state = params.params.switch;
        this.current = params.params.current;
        this.voltage = params.params.voltage;
        this.power = params.params.power;

        // 如果电流电压功率有更新就通知我
        setInterval(() => {
            coolKitWs.updateThing({
                deviceApikey: this.apikey,
                deviceid: this.deviceId,
                params: { uiActive: 120 },
            });
        }, 120000);
    }
}

CloudPowerDetectionSwitchController.prototype.updateSwitch = async function (status) {
    const res = await coolKitWs.updateThing({
        deviceApikey: this.apikey,
        deviceid: this.deviceId,
        params: {
            switch: status,
        },
    });

    if (res.error === 0) {
        this.updateState({ status });
    }
};

/**
 * @description 更新状态到HA
 */
CloudPowerDetectionSwitchController.prototype.updateState = async function ({ power, current, voltage, status }) {
    const res = await updateStates(this.entityId, {
        entity_id: this.entityId,
        state: status || this.state,
        attributes: {
            restored: true,
            supported_features: 0,
            friendly_name: this.deviceName,
            power: `${power || this.power} W`,
            current: `${current || this.current} A`,
            voltage: `${voltage || this.voltage} V`,
            state: status || this.state,
        },
    });
    status && (this.state = status);
    power && (this.power = power);
    current && (this.current = current);
    voltage && (this.voltage = voltage);
};

export default CloudPowerDetectionSwitchController;
