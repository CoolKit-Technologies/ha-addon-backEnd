import ICloudDevice from '../ts/interface/ICloudDevice';
import {
    ICloudDimmingParams,
    ICloudMultiChannelSwitchParams,
    ICloudPowerDetectionSwitchParams,
    ICloudRGBLightParams,
    ICloudSwitchParams,
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
import _ from 'lodash';
import CloudRGBLightController from './CloudRGBLightController';
import CloudDimmingController from './CloudDimmingController';
import CloudPowerDetectionSwitchController from './CloudPowerDetectionSwitchController';
import CloudMultiChannelSwitch from './CloudMultiChannelSwitch';

class Controller {
    static deviceMap: Map<string, DiyDeviceController | CloudDeviceController | LanDeviceController> = new Map();

    static getDevice(id: string) {
        // 删除switch.等前缀
        const tmp = id.replace(/.*(?=\.)\./, '');
        return Controller.deviceMap.get(tmp);
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
    static setDevice(params: { id: string; type: number; data: any }) {
        const { id, type, data } = params;
        if (_.isEmpty(id)) {
            return null;
        }
        const disabled = getDataSync('disabled.json', [id]) || false;
        // DIY
        if (type === 1) {
            const tmp = data as TypeMdnsDiyDevice;
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
            const tmp = data as TypeLanDevice;
            const lanDevice = new LanDeviceController({
                ip: tmp.a,
                port: tmp.srv?.port,
                deviceId: id,
                txt: tmp.txt,
                disabled,
            });
            Controller.deviceMap.set(id, lanDevice);
            return lanDevice;
        }
        // CLOUD
        if (type === 4) {
            // 1->单通道插座;6->单通道开关
            if (data.extra.uiid === 1 || data.extra.uiid === 6) {
                const tmp = data as ICloudDevice<ICloudSwitchParams>;
                const switchDevice = new CloudSwitchController({
                    deviceId: tmp.deviceid,
                    deviceName: tmp.name,
                    apikey: tmp.apikey,
                    extra: tmp.extra,
                    params: tmp.params,
                    disabled,
                });
                Controller.deviceMap.set(id, switchDevice);
                return switchDevice;
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
                    disabled,
                });
                Controller.deviceMap.set(id, thmDevice);
                return thmDevice;
            }
            // RGB灯球
            if (data.extra.uiid === 22) {
                const tmp = data as ICloudDevice<ICloudRGBLightParams>;
                const rgbLight = new CloudRGBLightController({
                    deviceId: tmp.deviceid,
                    deviceName: tmp.name,
                    apikey: tmp.apikey,
                    extra: tmp.extra,
                    params: tmp.params,
                    disabled,
                });
                Controller.deviceMap.set(id, rgbLight);
                return rgbLight;
            }
            // 功率检测告警开关
            if (data.extra.uiid === 32) {
                const tmp = data as ICloudDevice<ICloudPowerDetectionSwitchParams>;
                const switchDevice = new CloudPowerDetectionSwitchController({
                    deviceId: tmp.deviceid,
                    deviceName: tmp.name,
                    apikey: tmp.apikey,
                    extra: tmp.extra,
                    params: tmp.params,
                    disabled,
                });
                Controller.deviceMap.set(id, switchDevice);
                return switchDevice;
            }
            // 调光开关
            if (data.extra.uiid === 36) {
                const tmp = data as ICloudDevice<ICloudDimmingParams>;
                const dimming = new CloudDimmingController({
                    deviceId: tmp.deviceid,
                    deviceName: tmp.name,
                    apikey: tmp.apikey,
                    extra: tmp.extra,
                    params: tmp.params,
                    disabled,
                });
                Controller.deviceMap.set(id, dimming);
                return dimming;
            }
            // 双通道开关
            if (data.extra.uiid === 7) {
                const tmp = data as ICloudDevice<ICloudMultiChannelSwitchParams>;
                const device = new CloudMultiChannelSwitch({
                    deviceId: tmp.deviceid,
                    deviceName: tmp.name,
                    apikey: tmp.apikey,
                    extra: tmp.extra,
                    params: tmp.params,
                    disabled,
                });
                Controller.deviceMap.set(id, device);
                return device;
            }
        }
    }
}

export default Controller;
