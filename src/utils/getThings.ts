import CkApi from 'coolkit-open-api';
import Controller from '../controller/Controller';
import { updateStates } from '../apis/restApi';
import DiyController from '../controller/DiyDeviceController';
import LanController from '../controller/LanDeviceController';
import CloudSwitchController from '../controller/CloudSwitchController';
import CloudTandHModificationController from '../controller/CloudTandHModificationController';
import CloudRGBLightController from '../controller/CloudRGBLightController';
import CloudDimmingController from '../controller/CloudDimmingController';
import CloudPowerDetectionSwitchController from '../controller/CloudPowerDetectionSwitchController';
import CloudMultiChannelSwitch from '../controller/CloudMultiChannelSwitch';

// 获取设备并同步到HA
export default async () => {
    const { error, data } = await CkApi.device.getThingList({
        lang: 'cn',
    });
    if (error === 0) {
        const { thingList } = data;
        for (let i = 0; i < thingList.length; i++) {
            const item = thingList[i];
            if (item.itemType < 3) {
                const { extra, deviceid, name, params } = item.itemData;
                const old = Controller.getDevice(deviceid!);
                // 如果设备已经存在并且是DIY设备就不做任何操作
                if (old instanceof DiyController) {
                    continue;
                }
                // 如果设备已经存在并且是Lan设备就添加该设备的apikey
                if (old instanceof LanController) {
                    (Controller.getDevice(deviceid!) as LanController).apikey = item.itemData.apikey!;
                }
                // 添加为Cloud设备
                const device = Controller.setDevice({
                    id: deviceid!,
                    type: 4,
                    data: item.itemData,
                });

                if (device instanceof CloudSwitchController) {
                    device.updateState(params.switch);
                }
                if (device instanceof CloudTandHModificationController) {
                    device.updateState(params.switch);
                    device.updateTandH(params.currentTemperature, params.currentHumidity);
                }
                if (device instanceof CloudRGBLightController) {
                    device.updateState({
                        status: params.state,
                    });
                }
                if (device instanceof CloudDimmingController) {
                    device.updateState({
                        status: params.switch,
                        bright: params.bright,
                    });
                }
                if (device instanceof CloudPowerDetectionSwitchController) {
                    const { switch: status, power, voltage, current } = params;
                    device.updateState({
                        status,
                        power,
                        voltage,
                        current,
                    });
                }
                if (device instanceof CloudMultiChannelSwitch) {
                    device.updateState(params.switches.slice(0, device.maxChannel));
                }
            }
        }
        return 0;
    }
    return -1;
};
