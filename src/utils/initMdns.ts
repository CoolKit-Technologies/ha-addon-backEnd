import Mdns from '../class/MdnsClass';
import formatDiyDevice from './formatDiyDevice';
import TypeDevice from '../ts/type/TypeMdnsDevice';
import TypeDiyDevice from '../ts/type/TypeMdnsDiyDevice';
import DiyController from '../controller/DiyDeviceController';
import LanDeviceController from '../controller/LanDeviceController';
import LanSwitchController from '../controller/LanSwitchController';
import LanMultiChannelSwitchController from '../controller/LanMultiChannelSwitchController';

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
            }
            if (device instanceof LanSwitchController) {
                // todo
                console.log('found lan switch');
            }
            if (device instanceof LanMultiChannelSwitchController) {
                // todo
                console.log('found lan multiChannelSwitch');
            }
        },
    });
};
