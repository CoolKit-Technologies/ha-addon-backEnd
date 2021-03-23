import ICloudDevice from '../ts/interface/ICloudDevice';
import { ICloudSwitchParams, ITemperatureAndHumidityModificationParams } from '../ts/interface/ICloudDeviceParams';
import TypeMdnsDiyDevice from '../ts/type/TypeMdnsDiyDevice';
import CloudDeviceController from './CloudDeviceController';
import CloudSwitchController from './CloudSwitchController';
import CloudTandHModificationController from './CloudTandHModificationController';
import DiyDeviceController from './DiyDeviceController';
import { getDataSync } from '../utils/dataUtil';
import TypeLanDevice from '../ts/type/TypeMdnsLanDevice';
import LanDeviceController from './LanDeviceController';
import _ from 'lodash';

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
            if (data.extra.uiid === 1) {
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
        }
    }
}

export default Controller;
