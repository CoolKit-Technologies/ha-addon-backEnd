import CloudDeviceController from './CloudDeviceController';
import { ITemperatureAndHumidityModificationParams } from '../ts/interface/ICloudDeviceParams';
import ICloudDeviceConstrucotr from '../ts/interface/ICloudDeviceConstrucotr';
import { updateStates } from '../apis/restApi';
import coolKitWs from 'coolkit-ws';
import { getDataSync } from '../utils/dataUtil';
import ILanDeviceConstrucotr from '../ts/interface/ILanDeviceConstrucotr';
import LanDeviceController from './LanDeviceController';
import { setSwitch } from '../apis/lanDeviceApi';
import _ from 'lodash';
class LanTandHModificationController extends LanDeviceController {
    entityId: string;
    uiid: number = 15;
    unit: string;
    params?: ITemperatureAndHumidityModificationParams;
    setSwitch!: (status: string) => Promise<0 | -1>;
    updateState!: (status: string) => Promise<void>;
    updateTandH!: (currentTemperature: string, currentHumidity: string) => Promise<void>;
    constructor(props: ILanDeviceConstrucotr) {
        super(props);
        const { deviceId } = props;
        this.entityId = `switch.${deviceId}`;
        this.unit = getDataSync('unit.json', [this.deviceId]) || 'c';
    }
}

/**
 *
 *
 * @param {on | off} status
 * @description 默认设备处于自动模式下 --> deviceType:normal
 */
LanTandHModificationController.prototype.setSwitch = async function (status) {
    if (!this.devicekey || !this.selfApikey) {
        return -1;
    }
    const res = await setSwitch({
        selfApikey: this.selfApikey,
        deviceid: this.deviceId,
        ip: this.ip! || this.target!,
        port: this.port,
        devicekey: this.devicekey,
        data: JSON.stringify({
            switch: status,
            mainSwitch: status,
            deviceType: 'normal',
        }),
    });

    if (res?.data && res.data.error === 0) {
        this.updateState(status);
        this.params!.switch = status;
        return 0;
    }

    return -1;
};

LanTandHModificationController.prototype.updateState = async function (status) {
    if (this.disabled) {
        return;
    }

    let state = status;
    if (!this.online) {
        state = 'unavailable';
    }

    updateStates(`switch.${this.deviceId}`, {
        entity_id: `switch.${this.deviceId}`,
        state,
        attributes: {
            restored: true,
            supported_features: 0,
            friendly_name: this.deviceName,
            state,
        },
    });
};

LanTandHModificationController.prototype.updateTandH = async function (currentTemperature, currentHumidity) {
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

export default LanTandHModificationController;
