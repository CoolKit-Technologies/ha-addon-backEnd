import CloudDeviceController from './CloudDeviceController';
import { ITemperatureAndHumidityModificationParams } from '../ts/interface/ICloudDeviceParams';
import ICloudDeviceConstrucotr from '../ts/interface/ICloudDeviceConstrucotr';
import { updateStates } from '../apis/restApi';
import coolKitWs from 'coolkit-ws';
import { getDataSync } from '../utils/dataUtil';
class CloudTandHModificationController extends CloudDeviceController {
    online: boolean;
    disabled: boolean;
    entityId: string;
    uiid: number = 15;
    unit: string;
    params: ITemperatureAndHumidityModificationParams;
    updateSwitch!: (status: string) => Promise<void>;
    updateState!: (status: string) => Promise<void>;
    updateTandH!: (currentTemperature: string, currentHumidity: string) => Promise<void>;
    constructor(params: ICloudDeviceConstrucotr<ITemperatureAndHumidityModificationParams>) {
        super(params);
        this.params = params.params;
        this.entityId = `switch.${params.deviceId}`;
        this.disabled = params.disabled || false;
        this.online = params.online;
        this.unit = getDataSync('unit', [this.deviceId]) || 'c';
    }
}

CloudTandHModificationController.prototype.updateSwitch = async function (status) {
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
CloudTandHModificationController.prototype.updateState = async function (status) {
    if (this.disabled) {
        return;
    }
    updateStates(`switch.${this.deviceId}`, {
        entity_id: `switch.${this.deviceId}`,
        state: status,
        attributes: {
            restored: true,
            supported_features: 0,
            friendly_name: this.deviceName,
            state: status,
        },
    });
};
CloudTandHModificationController.prototype.updateTandH = async function (currentTemperature, currentHumidity) {
    updateStates(`sensor.${this.deviceId}_t`, {
        entity_id: `sensor.${this.deviceId}_t`,
        state: currentTemperature,
        attributes: {
            restored: true,
            supported_features: 0,
            friendly_name: `${this.deviceName}-Temperature`,
            device_class: 'temperature',
            state: currentTemperature,
            unit_of_measurement: '°C',
        },
    });
    updateStates(`sensor.${this.deviceId}_h`, {
        entity_id: `sensor.${this.deviceId}_h`,
        state: currentHumidity,
        attributes: {
            restored: true,
            supported_features: 0,
            friendly_name: `${this.deviceName}-Humidity`,
            device_class: 'humidity',
            state: currentHumidity,
            unit_of_measurement: '%',
        },
    });
};

export default CloudTandHModificationController;
