import coolKitWs from 'coolkit-ws';
import { getDataSync } from './dataUtil';
import Controller from '../controller/Controller';
import { appId, appSecret } from '../config/app';
import CloudSwitchController from '../controller/CloudSwitchController';
import CloudDeviceController from '../controller/CloudDeviceController';
import CloudTandHModificationController from '../controller/CloudTandHModificationController';

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
            console.log('接收到消息：', ws.data);

            const { type, data } = ws;
            if (type === 'message' && data !== 'pong') {
                const tmp = JSON.parse(data);
                if (tmp.action === 'update') {
                    const device = Controller.getDevice(tmp.deviceid)!;
                    if (device && device.type === 4) {
                        if ((device as CloudDeviceController).uiid === 1) {
                            (device as CloudSwitchController).updateState(tmp.params.switch);
                        }
                        if ((device as CloudDeviceController).uiid === 15) {
                            console.log('Jia ~ file: initCkWs.ts ~ line 45 ~ awaitcoolKitWs.on ~ device', device);
                            const cur = device as CloudTandHModificationController;
                            const { currentTemperature, currentHumidity, switch: state } = tmp.params;
                            if (currentHumidity && currentTemperature) {
                                cur.updateTandH(currentTemperature, currentHumidity);
                            } else if (state) {
                                cur.updateState(state);
                            }
                            // (device as CloudTandHModificationController).updateState(tmp.params.switch);
                        }
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    });
};
