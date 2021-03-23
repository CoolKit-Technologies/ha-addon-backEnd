import CkApi from 'coolkit-open-api';
import Controller from '../controller/Controller';
import { updateStates } from '../apis/restApi';
import DiyController from '../controller/DiyDeviceController';
import LanController from '../controller/LanDeviceController';
import CloudSwitchController from '../controller/CloudSwitchController';
import CloudTandHModificationController from '../controller/CloudTandHModificationController';

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
            }
        }
        return 0;
    }
    return -1;
};
