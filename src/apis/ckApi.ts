import CkApi from 'coolkit-open-api';

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
 * @description 修个子通道名称
 * @return {*}
 */
const updateChannelNameAPI = async (deviceid: string, tags: { [key: string]: string }) => {
    return await CkApi.device.updateDeviceTag({
        deviceid,
        type: 'merge',
        tags,
    });
};

export { updateDeviceNameAPI, updateChannelNameAPI };
