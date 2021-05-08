import _ from 'lodash';
import HASocket from '../class/HASocketClass';
import CloudDualR3Controller from '../controller/CloudDualR3Controller';
import CloudMultiChannelSwitchController from '../controller/CloudMultiChannelSwitchController';
import CloudPowerDetectionSwitchController from '../controller/CloudPowerDetectionSwitchController';
import CloudSwitchController from '../controller/CloudSwitchController';
import CloudTandHModificationController from '../controller/CloudTandHModificationController';
import Controller from '../controller/Controller';
import DiyController from '../controller/DiyDeviceController';
import LanDualR3Controller from '../controller/LanDualR3Controller';
import LanMultiChannelSwitchController from '../controller/LanMultiChannelSwitchController';
import LanSwitchController from '../controller/LanSwitchController';
type TypeCard = {
    type: string;
    entities: string[];
    title: string;
    state_color: boolean;
};

const generateLovelace = async () => {
    const res = await HASocket.getLovelace();
    if (res && Array.isArray(res.views)) {
        const { title, views } = res;
        let lovelace = { path: '', title: 'eWeLink Smart Home', badges: [], cards: [] as TypeCard[] };
        // const tmp = _.findIndex(views, { title: 'eWeLink Smart Home' });
        // if (~tmp) {
        //     lovelace = views[tmp];
        // }
        if (views.length) {
            lovelace = views[0];
        }

        const isDeviceExist = (deviceId: string) => {
            try {
                const tmp = JSON.stringify(lovelace);
                return tmp.includes(deviceId);
            } catch (error) {
                return false;
            }
        };

        const singalSwitchCard = {
            type: 'entities',
            title: 'Switch',
            state_color: true,
            show_header_toggle: false,
            entities: [] as string[],
        };

        for (let device of Controller.deviceMap.values()) {
            if (isDeviceExist(device.entityId)) {
                continue;
            }
            if (device instanceof DiyController || device instanceof CloudSwitchController || device instanceof CloudPowerDetectionSwitchController) {
                singalSwitchCard.entities.push(device.entityId);
                continue;
            }
            if (device instanceof LanSwitchController) {
                if (device.selfApikey && device.devicekey) {
                    singalSwitchCard.entities.push(device.entityId);
                }
                continue;
            }
            if (
                device instanceof CloudMultiChannelSwitchController ||
                device instanceof LanMultiChannelSwitchController ||
                device instanceof CloudDualR3Controller ||
                device instanceof LanDualR3Controller
            ) {
                if (device instanceof LanDualR3Controller) {
                    console.log("Jia ~ file: generateLovelace.ts ~ line 71 ~ generateLovelace ~ device", device);
                }
                if (device.maxChannel === 1 && device.deviceName) {
                    singalSwitchCard.entities.push(`${device.entityId}_1`);
                    continue;
                }
                if (!device.maxChannel || !device.deviceName) {
                    continue;
                }
                const entities = Array.from({ length: device.maxChannel }, (v, k) => {
                    return `${device.entityId}_${k + 1}`;
                });
                const tmpCard = {
                    type: 'entities',
                    entities,
                    title: device.deviceName,
                    state_color: true,
                    show_header_toggle: true,
                };
                let index = _.findIndex(lovelace.cards, { title: device.deviceName });
                if (~index) {
                    lovelace.cards[index] = tmpCard;
                } else {
                    lovelace.cards.push(tmpCard);
                }
            }
            if (device instanceof CloudTandHModificationController) {
                const tmpCard = {
                    type: 'entities',
                    entities: [`switch.${device.deviceId}`, `sensor.${device.deviceId}_t`, `sensor.${device.deviceId}_h`],
                    title: device.deviceName,
                    state_color: true,
                    show_header_toggle: false,
                };
                let index = _.findIndex(lovelace.cards, { title: device.deviceName });
                if (~index) {
                    lovelace.cards[index] = tmpCard;
                } else {
                    lovelace.cards.push(tmpCard);
                }
            }
        }
        // if (~tmp) {
        //     views[tmp] = lovelace;
        // } else {
        //     views.push(lovelace);
        // }
        if (singalSwitchCard.entities.length) {
            lovelace.cards.unshift(singalSwitchCard);
        }
        if (views) {
            views[0] = lovelace;
        }
        console.log('Jia ~ file: generateLovelace.ts ~ line 53 ~ generateLovelace ~ lovelace', lovelace);
        return await HASocket.query({
            type: 'lovelace/config/save',
            config: {
                title,
                views,
            },
        });
    }
};

export default generateLovelace;
