import coolKitWs from 'coolkit-ws';

/**
 *
 *
 * @param {string} apikey
 * @param {string} deviceid
 * @param {('on' | 'off')} status
 * @description 修改网络指示灯状态
 * @return {*}
 */
const modifyDeviceSledOnlineAPI = async (apikey: string, deviceid: string, status: 'on' | 'off') => {
    return await coolKitWs.updateThing({
        deviceApikey: apikey,
        deviceid,
        params: {
            sledOnline: status,
        },
    });
};

/**
 *
 *
 * @param {string} apikey
 * @param {string} deviceid
 * @param {('on' | 'off' | 'stay')} status
 * @description 修改单通道的通电反应
 * @return {*}
 */
const modifySingleDeviceStartupAPI = async (apikey: string, deviceid: string, status: 'on' | 'off' | 'stay') => {
    return await coolKitWs.updateThing({
        deviceApikey: apikey,
        deviceid,
        params: {
            startup: status,
        },
    });
};

/**
 *
 *
 * @param {string} apikey
 * @param {string} deviceid
 * @param {('on' | 'off')} pulse
 * @param {number} pulseWidth
 * @description 修改单通道的点动状态
 * @return {*}
 */
const modifySingleDevicePulseAPI = async (apikey: string, deviceid: string, pulse: 'on' | 'off', pulseWidth: number) => {
    return await coolKitWs.updateThing({
        deviceApikey: apikey,
        deviceid,
        params: {
            pulse,
            pulseWidth,
        },
    });
};

/**
 *
 *
 * @param {string} apikey
 * @param {string} deviceid
 * @param {({ startup: 'on' | 'off' | 'stay'; outlet: number }[])} configure
 * @description 修改多通道的点动状态
 * @return {*}
 */
const modifyMultiDevicePulsesAPI = async (apikey: string, deviceid: string, configure: { startup: 'on' | 'off' | 'stay'; outlet: number }[]) => {
    return await coolKitWs.updateThing({
        deviceApikey: apikey,
        deviceid,
        params: {
            configure,
        },
    });
};

/**
 *
 *
 * @param {string} apikey
 * @param {string} deviceid
 * @param {({ pulse: 'on' | 'off'; width: number; outlet: number }[])} pulses
 * @description 修改多通道的通电反应
 * @return {*}
 */
const modifyMultiDeviceStartupAPI = async (apikey: string, deviceid: string, pulses: { pulse: 'on' | 'off'; width: number; outlet: number }[]) => {
    return await coolKitWs.updateThing({
        deviceApikey: apikey,
        deviceid,
        params: {
            pulses,
        },
    });
};

const modifyMultiDeviceLockAPI = async (apikey: string, deviceid: string, lock: 0 | 1) => {
    return await coolKitWs.updateThing({
        deviceApikey: apikey,
        deviceid,
        params: {
            lock,
            zyx_clear_timers: Boolean(lock),
        },
    });
};

export { modifyDeviceSledOnlineAPI, modifySingleDeviceStartupAPI, modifySingleDevicePulseAPI, modifyMultiDevicePulsesAPI, modifyMultiDeviceStartupAPI, modifyMultiDeviceLockAPI };
