import CkApi from 'coolkit-open-api';
import CloudDeviceController from '../controller/CloudDeviceController';
import Controller from '../controller/Controller';
import LanDeviceController from '../controller/LanDeviceController';

/**
 *
 *
 * @param {string} deviceid
 * @param {string} name
 * @description 修改设备名称
 * @return {*}
 */
const updateDeviceNameAPI = async (deviceid: string, name: string) => {
    return await CkApi.device.updateDeviceInfo({
        deviceid,
        name,
    });
};

/**
 *
 *
 * @param {string} deviceid
 * @param {any} tags
 * @description 修改子通道名称
 * @return {*}
 */
const updateChannelNameAPI = async (deviceid: string, tags: any) => {
    const res = await CkApi.device.updateDeviceTag({
        deviceid,
        type: 'merge',
        tags,
    });
    console.log('Jia ~ file: ckApi.ts ~ line 32 ~ updateChannelNameAPI ~ res', JSON.stringify(res, null, 2));
    return res;
};

const getOTAinfoAPI = async (
    list: {
        deviceid: string;
        model: string;
        version: string;
    }[]
) => {
    return await CkApi.device.getOtaInfo({
        deviceInfoList: list,
    });
};

export { updateDeviceNameAPI, updateChannelNameAPI, getOTAinfoAPI };
