import Mdns from '../class/MdnsClass';
import formatDiyDevice from './formatDiyDevice';
import TypeDevice from '../ts/type/TypeMdnsDevice';
import TypeDiyDevice from '../ts/type/TypeMdnsDiyDevice';
import DiyController from '../controller/DiyDeviceController';
import LanDeviceController from '../controller/LanDeviceController';
import LanSwitchController from '../controller/LanSwitchController';
import LanMultiChannelSwitchController from '../controller/LanMultiChannelSwitchController';
import { appendData, saveData } from './dataUtil';
import eventBus from './eventBus';

export default () => {
    return Mdns.createInstance({
        queryParams: {
            questions: [
                {
                    name: '_ewelink._tcp.local',
                    type: 'PTR',
                },
            ],
        },
        queryCb() {
            console.log('finding local eWelink devices');
        },
        onResponseCb(device: TypeDevice) {
            if (device instanceof DiyController) {
                console.log('found diy device');
                const diyDevice = formatDiyDevice(device as TypeDiyDevice);
                device.updateState(diyDevice.data?.switch!);
                // 表示该diy设备在线
                appendData('diy.json', [diyDevice.id], true);
            }
            if (device instanceof LanSwitchController) {
                const decryptData = device.parseEncryptedData();
                if (decryptData) {
                    device.updateState(decryptData.switch);
                    device.params = decryptData;
                }
            }
            if (device instanceof LanMultiChannelSwitchController) {
                const decryptData = device.parseEncryptedData();
                if (decryptData) {
                    device.updateState(decryptData.switches);
                    device.params = decryptData;
                }
            }
            // 触发sse
            eventBus.emit('sse');
        },
    });
};
