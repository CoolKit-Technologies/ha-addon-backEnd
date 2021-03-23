import Mdns from '../class/MdnsClass';
import { updateStates } from '../apis/restApi';
import formatDiyDevice from './formatDiyDevice';
import TypeDevice from '../ts/type/TypeMdnsDevice';
import TypeDiyDevice from '../ts/type/TypeMdnsDiyDevice';
import TypeLanDevice from '../ts/type/TypeMdnsLanDevice';
import formatLanDevice from './formatLanDevice';

export default () => {
    return Mdns.createInstance({
        queryParams: {
            questions: [
                {
                    name: '_ewelink._tcp.local',
                    type: 'PTR',
                },
            ],
        },
        queryCb() {
            console.log('finding local eWelink devices');
        },
        onResponseCb(type: 'diy' | 'lan', data: TypeDevice) {
            if (data.txt?.id) {
                if (type === 'diy') {
                    console.log('found diy device');
                    const device = formatDiyDevice(data as TypeDiyDevice);
                    const entityId = `switch.${device.id}`;
                    updateStates(entityId, {
                        entity_id: entityId,
                        state: device.data?.switch,
                        attributes: {
                            restored: true,
                            supported_features: 0,
                            friendly_name: entityId,
                            state: device.data?.switch,
                        },
                    });
                }
                if (type === 'lan') {
                    console.log('found lan device');
                    const device = formatLanDevice(data as TypeLanDevice);
                    if (device) {
                        const entityID = `switch.${device.id}`;
                        updateStates(entityID, {
                            entity_id: entityID,
                            state: device.data?.switch || 'on',
                            attributes: {
                                restored: true,
                                supported_features: 0,
                                friendly_name: entityID,
                                state: device.data?.switch || 'on',
                            },
                        });
                    }
                }
            }
        },
    });
};
