import CkApi from 'coolkit-open-api';
import { updateStates } from '../apis/restApi';
import Controller from '../controller/Controller';
import DiyController from '../controller/DiyDeviceController';

export default async () => {
    await CkApi.user.login({
        countryCode: '+86',
        phoneNumber: '+8618875224960',
        lang: 'cn',
        password: 'coolkit666',
    });
    const { error, data } = await CkApi.device.getThingList({
        lang: 'cn',
    });

    if (error === 0) {
        const { thingList } = data;
        for (let i = 0; i < thingList.length; i++) {
            const item = thingList[i];
            if (item.itemType < 3) {
                const { extra, deviceid, name, params } = item.itemData;
                const old = Controller.getDevice(deviceid!);
                if (old instanceof DiyController) {
                    continue;
                }
                Controller.setDevice({
                    id: deviceid!,
                    type: 4,
                    data: item.itemData,
                });
                if (extra?.uiid === 1) {
                    updateStates(`switch.${deviceid}`, {
                        entity_id: `switch.${deviceid}`,
                        state: params.switch,
                        attributes: {
                            restored: true,
                            supported_features: 0,
                            friendly_name: name,
                        },
                    });
                }
            }
        }
    }
};
