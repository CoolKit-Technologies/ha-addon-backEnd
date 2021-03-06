import CkApi from 'coolkit-open-api';
import Controller from '../controller/Controller';
import DiyController from '../controller/DiyDeviceController';
import LanController from '../controller/LanDeviceController';
import CloudSwitchController from '../controller/CloudSwitchController';
import CloudTandHModificationController from '../controller/CloudTandHModificationController';
import CloudRGBLightController from '../controller/CloudRGBLightController';
import CloudDimmingController from '../controller/CloudDimmingController';
import CloudPowerDetectionSwitchController from '../controller/CloudPowerDetectionSwitchController';
import CloudMultiChannelSwitchController from '../controller/CloudMultiChannelSwitchController';
import CloudRGBLightStripController from '../controller/CloudRGBLightStripController';
import LanMultiChannelSwitchController from '../controller/LanMultiChannelSwitchController';
import { getMaxChannelByUiid } from '../config/channelMap';
import CloudDoubleColorLightController from '../controller/CloudDoubleColorLightController';
import LanSwitchController from '../controller/LanSwitchController';
import CloudDualR3Controller from '../controller/CloudDualR3Controller';
import { getDataSync } from './dataUtil';
import LanDualR3Controller from '../controller/LanDualR3Controller';
import LanTandHModificationController from '../controller/LanTandHModificationController';

// 获取设备并同步到HA
export default async () => {
    const lang = getDataSync('user.json', ['region']) === 'cn' ? 'cn' : 'en';
    const { error, data } = await CkApi.device.getThingList({
        lang,
    });
    if (error === 0) {
        const { thingList } = data;
        console.log('Jia ~ file: getThings.ts ~ line 25 ~ thingList', JSON.stringify(thingList, null, 2));
        for (let i = 0; i < thingList.length; i++) {
            const item = thingList[i];
            const deviceIndex = item.index;
            if (item.itemType < 3) {
                const { extra, deviceid, name, params, devicekey, apikey, tags } = item.itemData;
                const old = Controller.getDevice(deviceid!);
                if (old instanceof DiyController) {
                    // 如果设备已经存在并且是DIY设备就不做任何操作
                    continue;
                }
                // 如果设备已经存在并且是Lan设备就添加该设备的deviceKey
                if (old instanceof LanController) {
                    old.devicekey = devicekey;
                    old.selfApikey = apikey;
                    old.deviceName = name;
                    old.extra = extra;
                    old.params = params;
                    old.index = deviceIndex;
                    if (old instanceof LanSwitchController) {
                        const decryptData = old.parseEncryptedData() as any;
                        if (decryptData) {
                            old.updateState(decryptData.switch);
                        }
                    }
                    if (old instanceof LanMultiChannelSwitchController) {
                        old.channelName = tags?.ck_channel_name;
                        old.maxChannel = getMaxChannelByUiid(extra.uiid);
                        const decryptData = old.parseEncryptedData() as any;
                        if (decryptData) {
                            old.updateState(decryptData.switches);
                        }
                    }
                    if (old instanceof LanDualR3Controller) {
                        old.channelName = tags?.ck_channel_name;
                        const decryptData = old.parseEncryptedData() as any;
                        if (decryptData) {
                            old.updateState(decryptData.switches);
                        }
                    }
                    continue;
                }

                // 添加为Cloud设备
                const device = Controller.setDevice({
                    id: deviceid!,
                    type: 4,
                    data: item.itemData,
                    index: deviceIndex,
                });

                if (device instanceof CloudSwitchController) {
                    !device.disabled && device.updateState(params.switch);
                }
                if (device instanceof CloudTandHModificationController || device instanceof LanTandHModificationController) {
                    !device.disabled && device.updateState(params.switch);
                    !device.disabled && device.updateTandH(params.currentTemperature, params.currentHumidity);
                }
                if (device instanceof CloudRGBLightController) {
                    !device.disabled && device.updateState(device.parseCkData2Ha(params));
                }
                if (device instanceof CloudDimmingController) {
                    !device.disabled &&
                        device.updateState({
                            status: params.switch,
                            bright: params.bright,
                        });
                }
                if (device instanceof CloudPowerDetectionSwitchController) {
                    const { switch: status, power, voltage, current } = params;
                    !device.disabled &&
                        device.updateState({
                            status,
                            power,
                            voltage,
                            current,
                        });
                }
                if (device instanceof CloudMultiChannelSwitchController) {
                    !device.disabled && device.updateState(params.switches.slice(0, device.maxChannel));
                }
                if (device instanceof CloudRGBLightStripController) {
                    const data = device.parseCkData2Ha(params);
                    !device.disabled && device.updateState(data);
                }
                if (device instanceof CloudDoubleColorLightController) {
                    !device.disabled && device.updateState(params);
                }
                if (device instanceof CloudDualR3Controller) {
                    console.log('Jia ~ file: getThings.ts ~ CloudDualR3Controller ~ params', params);
                    !device.disabled && device.updateState(params.switches);
                }
            }
        }
        return 0;
    }
    return -1;
};
