import coolKitWs from 'coolkit-ws';
import { getDataSync } from './dataUtil';
import Controller from '../controller/Controller';
import { appId, appSecret } from '../config/app';
import CloudSwitchController from '../controller/CloudSwitchController';
import CloudTandHModificationController from '../controller/CloudTandHModificationController';
import CloudRGBLightController from '../controller/CloudRGBLightController';
import CloudDimmingController from '../controller/CloudDimmingController';
import CloudPowerDetectionSwitchController from '../controller/CloudPowerDetectionSwitchController';
import CloudMultiChannelSwitch from '../controller/CloudMultiChannelSwitch';
import CloudRGBLightStripController from '../controller/CloudRGBLightStripController';
import { IPowerDetectionSwitchSocketParams, IRGBLightStripSocketParams, ITandHModificationSocketParams } from '../ts/interface/ICkSocketParams';

const at = getDataSync('user.json', ['at']);
const apikey = getDataSync('user.json', ['user', 'apikey']);

export default async () => {
    if (!at || !apikey) {
        return -1;
    }
    await coolKitWs.init({
        appid: appId,
        secret: appSecret,
        at,
        apikey,
    });
    console.log('Jia ~ file: initCkWs.ts ~ line 21 ~ apikey user============', apikey);

    // await coolKitWs.init({
    //     appid: 'KOBxGJna5qkk3JLXw3LHLX3wSNiPjAVi',
    //     secret: '4v0sv6X5IM2ASIBiNDj6kGmSfxo40w7n',
    //     at: '975e779a41b27031cc41307a0bf3292f6113e08b',
    //     apikey: 'efe86fc8-bf2f-40ec-8286-49f4012cef52',
    // });

    await coolKitWs.on('message', (ws) => {
        try {
            const { type, data } = ws;
            if (type === 'message' && data !== 'pong') {
                const tmp = JSON.parse(data);
                if (tmp.action === 'update') {
                    if (!tmp.deviceid) {
                        return;
                    }
                    const device = Controller.getDevice(tmp.deviceid);
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
                        device.updateState({
                            status,
                            current,
                            voltage,
                            power,
                        });
                    }
                    if (device instanceof CloudMultiChannelSwitch) {
                        const { switches } = tmp.params;
                        if (Array.isArray(switches)) {
                            device.updateState(switches.slice(0, device.maxChannel));
                        }
                    }
                    if (device instanceof CloudRGBLightStripController) {
                        device.updateState(device.parseCkData2Ha(tmp.params));
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    });
};
