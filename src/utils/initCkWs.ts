import coolKitWs from 'coolkit-ws';
import { getDataSync } from './dataUtil';
import Controller from '../controller/Controller';
import { appId, appSecret } from '../config/app';
import CloudSwitchController from '../controller/CloudSwitchController';
import CloudTandHModificationController from '../controller/CloudTandHModificationController';
import CloudRGBLightController from '../controller/CloudRGBLightController';
import CloudDimmingController from '../controller/CloudDimmingController';
import CloudPowerDetectionSwitchController from '../controller/CloudPowerDetectionSwitchController';
import CloudMultiChannelSwitchController from '../controller/CloudMultiChannelSwitchController';
import CloudRGBLightStripController from '../controller/CloudRGBLightStripController';
import { IPowerDetectionSwitchSocketParams, ITandHModificationSocketParams } from '../ts/interface/ICkSocketParams';
import { getStateByEntityId, updateStates } from '../apis/restApi';
import CloudDoubleColorLightController from '../controller/CloudDoubleColorLightController';
import eventBus from './eventBus';
import CloudDualR3Controller from '../controller/CloudDualR3Controller';
import LanDualR3Controller from '../controller/LanDualR3Controller';

const apikey = getDataSync('user.json', ['user', 'apikey']);

export default async () => {
    const at = getDataSync('user.json', ['at']);
    const region = getDataSync('user.json', ['region']);
    if (!at || !apikey) {
        return -1;
    }
    await coolKitWs.init({
        appid: appId,
        at,
        apikey,
        region,
        userAgent: 'app',
    });
    console.log('Jia ~ file: initCkWs.ts ~ line 29 ~ at', at);

    coolKitWs.on('message', async (ws) => {
        try {
            const { type, data } = ws;
            console.log('接受到CKWS消息:type-->', data);
            console.log('接受到CKWS消息:\n', data);
            if (type === 'message' && data !== 'pong') {
                const tmp = JSON.parse(data);
                if (!tmp.deviceid) {
                    return;
                }
                const device = Controller.getDevice(tmp.deviceid);
                if (tmp.action === 'update') {
                    if (device instanceof CloudSwitchController) {
                        device.updateState(tmp.params.switch);
                    }
                    if (device instanceof CloudTandHModificationController) {
                        const { currentTemperature, currentHumidity, switch: state } = tmp.params as ITandHModificationSocketParams;
                        if (currentHumidity && currentTemperature) {
                            device.updateTandH(currentTemperature, currentHumidity);
                        } else if (state) {
                            device.updateState(state);
                        }
                    }
                    if (device instanceof CloudRGBLightController) {
                        const params = device.parseCkData2Ha(tmp.params);
                        device.updateState(params);
                    }
                    if (device instanceof CloudDimmingController) {
                        const { bright, switch: status } = tmp.params;
                        device.updateState({
                            status,
                            bright,
                        });
                    }
                    if (device instanceof CloudPowerDetectionSwitchController) {
                        const { current, voltage, power, switch: status } = tmp.params as IPowerDetectionSwitchSocketParams;
                        console.log('接收到功率检查插座的消息->params:', tmp.params);
                        device.updateState({
                            status,
                            current,
                            voltage,
                            power,
                        });
                    }
                    if (device instanceof CloudMultiChannelSwitchController) {
                        const { switches } = tmp.params;
                        if (Array.isArray(switches)) {
                            device.updateState(switches.slice(0, device.maxChannel));
                        }
                    }
                    if (device instanceof CloudRGBLightStripController) {
                        device.updateState(device.parseCkData2Ha(tmp.params));
                    }
                    if (device instanceof CloudDoubleColorLightController) {
                        console.log('接收到双色灯的信息：', tmp.params);
                        device.updateState(tmp.params);
                    }
                    if (device instanceof CloudDualR3Controller || device instanceof LanDualR3Controller) {
                        console.log('接收到DualR3的信息：', tmp.params);
                        if (tmp.params && tmp.params.switches) {
                            device.updateState(tmp.params.switches);
                        }
                    }

                    eventBus.emit('update-controller', data);
                }

                if (tmp.action === 'sysmsg' && device?.entityId) {
                    const { online } = tmp.params;
                    // 设备下线通知同步到HA
                    if (online === false) {
                        const res = await getStateByEntityId(device.entityId);
                        if (res && res.data) {
                            updateStates(device.entityId, {
                                entity_id: device.entityId,
                                state: 'unavailable',
                                attributes: {
                                    ...res.data.attributes,
                                    state: 'unavailable',
                                },
                            });
                        }
                        eventBus.emit('device-offline', device.deviceId);
                    }
                }

                // 同步状态到前端
                eventBus.emit('sse');
            }
        } catch (error) {
            console.log(error);
        }
    });
};
