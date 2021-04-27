import _ from 'lodash';
import HASocket from '../class/HASocketClass';
import CloudDualR3Controller from '../controller/CloudDualR3Controller';
import CloudMultiChannelSwitchController from '../controller/CloudMultiChannelSwitchController';
import Controller from '../controller/Controller';
import LanMultiChannelSwitchController from '../controller/LanMultiChannelSwitchController';
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
        const tmp = _.findIndex(views, { title: 'eWeLink Smart Home' });

        if (~tmp) {
            lovelace = views[tmp];
        }
        for (let device of Controller.deviceMap.values()) {
            if (device instanceof CloudMultiChannelSwitchController || device instanceof LanMultiChannelSwitchController || device instanceof CloudDualR3Controller) {
                console.log('Jia ~ file: generateLovelace.ts ~ line 24 ~ generateLovelace ~ device', device);
                if (!device.maxChannel || device.maxChannel === 1 || !device.deviceName) {
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
                };
                let index = _.findIndex(lovelace.cards, { title: device.deviceName });
                if (~index) {
                    lovelace.cards[index] = tmpCard;
                } else {
                    lovelace.cards.push(tmpCard);
                }
            }
        }
        if (~tmp) {
            views[tmp] = lovelace;
        } else {
            views.push(lovelace);
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
