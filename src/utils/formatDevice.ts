import CloudDeviceController from '../controller/CloudDeviceController';
import DiyController from '../controller/DiyDeviceController';
import _ from 'lodash';
import LanDeviceController from '../controller/LanDeviceController';
import CloudMultiChannelSwitchController from '../controller/CloudMultiChannelSwitchController';
import LanMultiChannelSwitchController from '../controller/LanMultiChannelSwitchController';

const ghostManufacturer = (manufacturer: string = 'eWeLink') => {
    if (~manufacturer.indexOf('松诺') || ~manufacturer.toLocaleUpperCase().indexOf('SONOFF')) {
        return 'SONOFF';
    }
    return 'eWeLink';
};

export default (data: DiyController | CloudDeviceController | LanDeviceController) => {
    if (data instanceof DiyController) {
        return {
            key: data.deviceId,
            uiid: data.uiid,
            deviceId: data.deviceId,
            disabled: data.disabled,
            ip: data.ip,
            port: data.port,
            type: data.type,
            rssi: data.txt.data1?.rssi,
            params: data.txt,
            online: true,
        };
    }

    if (data instanceof LanDeviceController) {
        let tags;
        if (data instanceof LanMultiChannelSwitchController) {
            tags = data.channelName;
        }
        return {
            key: data.deviceId,
            deviceId: data.deviceId,
            disabled: data.disabled,
            ip: data.ip,
            uiid: data.extra?.uiid,
            port: data.port,
            type: data.type,
            manufacturer: ghostManufacturer(data.extra?.manufacturer),
            deviceName: data.deviceName,
            model: data.extra?.model,
            apikey: data.selfApikey,
            params: data.params,
            online: data.online,
            tags,
        };
    }

    if (data instanceof CloudDeviceController) {
        let tags;
        if (data instanceof CloudMultiChannelSwitchController) {
            tags = data.channelName;
        }
        return {
            key: data.deviceId,
            deviceId: data.deviceId,
            disabled: data.disabled,
            uiid: data.uiid,
            type: data.type,
            manufacturer: ghostManufacturer(data.extra.manufacturer),
            deviceName: data.deviceName,
            model: data.extra.model,
            rssi: data.rssi,
            apikey: data.apikey,
            params: data.params,
            online: data.online,
            tags,
        };
    }
};
