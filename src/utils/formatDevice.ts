import CloudDeviceController from '../controller/CloudDeviceController';
import DiyController from '../controller/DiyDeviceController';
import _ from 'lodash';
import LanDeviceController from '../controller/LanDeviceController';
import CloudMultiChannelSwitchController from '../controller/CloudMultiChannelSwitchController';
import LanMultiChannelSwitchController from '../controller/LanMultiChannelSwitchController';
import Controller from '../controller/Controller';
import { getDataSync } from './dataUtil';
import CloudTandHModificationController from '../controller/CloudTandHModificationController';

const ghostManufacturer = (manufacturer: string = 'eWeLink') => {
    if (~manufacturer.indexOf('松诺') || ~manufacturer.toLocaleUpperCase().indexOf('SONOFF')) {
        return 'SONOFF';
    }
    return 'eWeLink';
};

const formatDevice = (data: DiyController | CloudDeviceController | LanDeviceController) => {
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
            index: data.index,
            tags,
        };
    }

    if (data instanceof CloudDeviceController) {
        let tags, unit;
        if (data instanceof CloudMultiChannelSwitchController) {
            tags = data.channelName;
        }
        if (data instanceof CloudTandHModificationController) {
            unit = data.unit;
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
            index: data.index,
            tags,
            unit,
        };
    }
};

const getFormattedDeviceList = () => {
    const result: any[] = [];
    for (let item of Controller.deviceMap.values()) {
        result.push(formatDevice(item));
    }
    for (let item of Controller.unsupportDeviceMap.values()) {
        result.push(item);
    }
    const oldDiyDevices = getDataSync('diy.json', []) as { [key: string]: boolean };
    for (let key in oldDiyDevices) {
        if (!Controller.getDevice(key)) {
            result.push({
                online: false,
                type: 1,
                deviceId: key,
            });
        }
    }
    result.sort((a, b) => {
        if (!a.index) {
            return 1;
        }
        if (!b.index) {
            return -1;
        }
        return a.index - b.index;
    });
    return result;
};

export { formatDevice, getFormattedDeviceList };
