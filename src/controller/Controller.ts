import ICloudDevice from '../ts/interface/ICloudDevice';
import _ from 'lodash';
import {
    ICloudDimmingParams,
    ICloudDualR3Params,
    ICloudMultiChannelSwitchParams,
    ICloudPowerDetectionSwitchParams,
    ICloudRGBLightParams,
    ICloudRGBLightStripParams,
    ICloudSwitchParams,
    IDoubleCloudLightParams,
    ITemperatureAndHumidityModificationParams,
} from '../ts/interface/ICloudDeviceParams';
import TypeMdnsDiyDevice from '../ts/type/TypeMdnsDiyDevice';
import CloudDeviceController from './CloudDeviceController';
import CloudSwitchController from './CloudSwitchController';
import CloudTandHModificationController from './CloudTandHModificationController';
import DiyDeviceController from './DiyDeviceController';
import { getDataSync } from '../utils/dataUtil';
import TypeLanDevice from '../ts/type/TypeMdnsLanDevice';
import LanDeviceController from './LanDeviceController';
import CloudRGBLightController from './CloudRGBLightController';
import CloudDimmingController from './CloudDimmingController';
import CloudPowerDetectionSwitchController from './CloudPowerDetectionSwitchController';
import CloudMultiChannelSwitchController from './CloudMultiChannelSwitchController';
import CloudRGBLightStripController from './CloudRGBLightStripController';
import formatLanDevice from '../utils/formatLanDevice';
import LanSwitchController from './LanSwitchController';
import LanMultiChannelSwitchController from './LanMultiChannelSwitchController';
import { multiChannelSwitchUiidSet, switchUiidSet } from '../config/uiid';
import CloudDoubleColorLightController from './CloudDoubleColorLightController';
import UnsupportDeviceController from './UnsupportDeviceController';
import CloudDualR3Controller from './CloudDualR3Controller';
import { device } from 'coolkit-open-api/dist/api';
import LanDualR3Controller from './LanDualR3Controller';

class Controller {
    static deviceMap: Map<string, DiyDeviceController | CloudDeviceController | LanDeviceController> = new Map();
    static unsupportDeviceMap: Map<string, UnsupportDeviceController> = new Map();
    static count: number = 999;
    static getDevice(id: string) {
        if (id) {
            // 删除switch.等前缀
            const tmp = id.replace(/.*(?=\.)\./, '');
            return Controller.deviceMap.get(tmp);
        }
        return null;
    }

    static getDeviceName(id: string) {
        // 删除switch.等前缀
        const tmp = id.replace(/.*(?=\.)\./, '');
        return (Controller.deviceMap.get(tmp) as CloudDeviceController).deviceName || '';
    }

    /**
     *
     *
     * @static
     * @param {id} 设备ID
     * @param {type} 1->DIY 2->LAN 4->CLOUD
     * @param {data} 设备数据
     * @memberof Controller
     */
    static setDevice(params: { id: string; type: number; data: any; lanType?: string; index?: number }) {
        const { id, type, data, lanType, index } = params;
        const _index = index || this.count++;
        if (_.isEmpty(id)) {
            return null;
        }
        const disabled = getDataSync('disabled.json', [id]) || false;
        // DIY
        if (type === 1) {
            const tmp = data as TypeMdnsDiyDevice;
            if (!tmp.a) {
                return;
            }
            const diyDevice = new DiyDeviceController({
                ip: tmp.a,
                port: tmp.srv.port,
                deviceId: id,
                disabled,
                txt: tmp.txt,
            });
            Controller.deviceMap.set(id, diyDevice);
            return diyDevice;
        }
        // LAN
        if (type === 2) {
            const params = formatLanDevice(data as TypeLanDevice);
            // 如果ip不存在说明该设备可能不支持局域网
            if (!params || (!params.ip && !params.target)) {
                console.log('该设备不支持局域网', params?.deviceId);
                return;
            }
            const old = Controller.getDevice(id);
            if (old instanceof LanDeviceController) {
                old.iv = params?.iv;
                old.encryptedData = params?.encryptedData;
                return old;
            }
            if (lanType === 'plug') {
                const lanDevice = new LanSwitchController({
                    ...params,
                    disabled,
                });
                Controller.deviceMap.set(id, lanDevice);
                return lanDevice;
            }

            if (lanType === 'strip') {
                const lanDevice = new LanMultiChannelSwitchController({
                    ...params,
                    disabled,
                });
                Controller.deviceMap.set(id, lanDevice);
                return lanDevice;
            }

            // if (lanType === 'multifun_switch') {
            //     const lanDevice = new LanDualR3Controller({
            //         ...params,
            //         disabled,
            //     });
            //     Controller.deviceMap.set(id, lanDevice);
            //     return lanDevice;
            // }
        }
        // CLOUD
        if (type === 4) {
            if (switchUiidSet.has(data.extra.uiid)) {
                const tmp = data as ICloudDevice<ICloudSwitchParams>;
                const switchDevice = new CloudSwitchController({
                    deviceId: tmp.deviceid,
                    deviceName: tmp.name,
                    apikey: tmp.apikey,
                    extra: tmp.extra,
                    params: tmp.params,
                    online: tmp.online,
                    disabled,
                    index: _index,
                });
                Controller.deviceMap.set(id, switchDevice);
                return switchDevice;
            }
            if (multiChannelSwitchUiidSet.has(data.extra.uiid)) {
                const tmp = data as ICloudDevice<ICloudMultiChannelSwitchParams>;
                const device = new CloudMultiChannelSwitchController({
                    deviceId: tmp.deviceid,
                    deviceName: tmp.name,
                    apikey: tmp.apikey,
                    extra: tmp.extra,
                    params: tmp.params,
                    tags: tmp.tags,
                    online: tmp.online,
                    disabled,
                    index: _index,
                });
                Controller.deviceMap.set(id, device);
                return device;
            }
            // 恒温恒湿改装件
            if (data.extra.uiid === 15) {
                const tmp = data as ICloudDevice<ITemperatureAndHumidityModificationParams>;
                const thmDevice = new CloudTandHModificationController({
                    deviceId: tmp.deviceid,
                    deviceName: tmp.name,
                    apikey: tmp.apikey,
                    extra: tmp.extra,
                    params: tmp.params,
                    online: tmp.online,
                    disabled,
                    index: _index,
                });
                Controller.deviceMap.set(id, thmDevice);
                return thmDevice;
            }
            // RGB灯球
            // if (data.extra.uiid === 22) {
            //     const tmp = data as ICloudDevice<ICloudRGBLightParams>;
            //     const rgbLight = new CloudRGBLightController({
            //         deviceId: tmp.deviceid,
            //         deviceName: tmp.name,
            //         apikey: tmp.apikey,
            //         extra: tmp.extra,
            //         params: tmp.params,
            //         online: tmp.online,
            //         disabled,
            //         index: _index,
            //     });
            //     Controller.deviceMap.set(id, rgbLight);
            //     return rgbLight;
            // }
            // 功率检测告警开关
            if (data.extra.uiid === 32 || data.extra.uiid === 5) {
                const tmp = data as ICloudDevice<ICloudPowerDetectionSwitchParams>;
                const switchDevice = new CloudPowerDetectionSwitchController({
                    deviceId: tmp.deviceid,
                    deviceName: tmp.name,
                    apikey: tmp.apikey,
                    extra: tmp.extra,
                    params: tmp.params,
                    online: tmp.online,
                    disabled,
                    index: _index,
                });
                Controller.deviceMap.set(id, switchDevice);
                return switchDevice;
            }
            // 调光开关
            // if (data.extra.uiid === 36) {
            //     const tmp = data as ICloudDevice<ICloudDimmingParams>;
            //     const dimming = new CloudDimmingController({
            //         deviceId: tmp.deviceid,
            //         deviceName: tmp.name,
            //         apikey: tmp.apikey,
            //         extra: tmp.extra,
            //         params: tmp.params,
            //         online: tmp.online,
            //         disabled,
            //         index: _index,
            //     });
            //     Controller.deviceMap.set(id, dimming);
            //     return dimming;
            // }
            // RGB灯带
            // if (data.extra.uiid === 59) {
            //     const tmp = data as ICloudDevice<ICloudRGBLightStripParams>;
            //     const device = new CloudRGBLightStripController({
            //         deviceId: tmp.deviceid,
            //         deviceName: tmp.name,
            //         apikey: tmp.apikey,
            //         extra: tmp.extra,
            //         params: tmp.params,
            //         online: tmp.online,
            //         disabled,
            //         index: _index,
            //     });
            //     Controller.deviceMap.set(id, device);
            //     return device;
            // }
            // 双色冷暖灯
            // if (data.extra.uiid === 103) {
            //     const tmp = data as ICloudDevice<IDoubleCloudLightParams>;
            //     const device = new CloudDoubleColorLightController({
            //         deviceId: tmp.deviceid,
            //         deviceName: tmp.name,
            //         apikey: tmp.apikey,
            //         extra: tmp.extra,
            //         params: tmp.params,
            //         disabled,
            //         online: tmp.online,
            //         index: _index,
            //     });
            //     Controller.deviceMap.set(id, device);
            //     return device;
            // }
            // DualR3
            if (data.extra.uiid === 126) {
                const tmp = data as ICloudDevice<ICloudDualR3Params>;
                const device = new CloudDualR3Controller({
                    deviceId: tmp.deviceid,
                    deviceName: tmp.name,
                    apikey: tmp.apikey,
                    extra: tmp.extra,
                    params: tmp.params,
                    disabled,
                    online: tmp.online,
                    index: _index,
                });
                Controller.deviceMap.set(id, device);
                return device;
            }
            // 暂不支持的设备
            if (!Controller.deviceMap.has(id)) {
                const unsupportDevice = new UnsupportDeviceController(data);
                Controller.unsupportDeviceMap.set(id, unsupportDevice);
            }
        }
    }
}

export default Controller;
