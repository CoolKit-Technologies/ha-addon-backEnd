import _ from 'lodash';
import HASocket from '../class/HASocketClass';
import Controller from '../controller/Controller';
import DiyDeviceController from '../controller/DiyDeviceController';
import CloudSwitchController from '../controller/CloudSwitchController';
import { TypeHaSocketStateChangedData, TypeHaSocketCallServiceData } from '../ts/type/TypeHaSocketMsg';

export default async () => {
    try {
        const res = await HASocket.init();
        if (res === 0) {
            HASocket.subscribeEvents('call_service');
            HASocket.handleEvent('call_service', (res: TypeHaSocketCallServiceData) => {
                const {
                    service_data: { entity_id },
                    service,
                } = res;
                if (entity_id) {
                    const data = Controller.getDevice(entity_id);
                    if (data && data.type === 1) {
                        (data as DiyDeviceController).setSwitch(service === 'turn_off' ? 'off' : 'on');
                    }
                    if (data && data.type === 4) {
                        (data as CloudSwitchController).updateSwitch(service === 'turn_off' ? 'off' : 'on');
                    }
                }
            });

            HASocket.subscribeEvents('state_changed');
            HASocket.handleEvent('state_changed', (res: TypeHaSocketStateChangedData) => {
                console.log('=====================');
                console.log('=====================');
                console.log('=====================');
                console.log('=====================');
                console.log('=====================');
                
                try {
                    const { entity_id, new_state } = res;
                    console.log('Jia ~ file: initHaSocket.ts ~ line 33 ~ HASocket.handleEvent ~ new_state', new_state);
                    if (entity_id) {
                        const data = Controller.getDevice(entity_id);
                        if (data && data.type === 1) {
                            (data as DiyDeviceController).updateState(new_state.state);
                            // (data as DiyDeviceController).setSwitch(new_state.state);
                        }
                        if (data && data.type === 4) {
                            (data as CloudSwitchController).updateSwitch(new_state.state);
                        }
                    }
                } catch (error) {
                    console.log('Jia ~ file: initHaSocket.ts ~ line 45 ~ HASocket.handleEvent ~ error', error);
                }
            });
        }
    } catch (err) {
        console.log('Jia ~ file: initHaSocket.ts ~ line 28 ~ err', err);
    }
};
