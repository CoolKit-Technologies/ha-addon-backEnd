import _ from 'lodash';
import HASocket from '../class/HASocketClass';
import Controller from '../controller/Controller';
import DiyDeviceController from '../controller/DiyDeviceController';
import CloudSwitchController from '../controller/CloudSwitchController';
import { TypeHaSocketStateChangedData, TypeHaSocketCallServiceData } from '../ts/type/TypeHaSocketMsg';
import CloudRGBLightController from '../controller/CloudRGBLightController';

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
                const state = service === 'turn_off' ? 'off' : 'on';
                if (entity_id) {
                    const device = Controller.getDevice(entity_id);
                    if (device instanceof DiyDeviceController) {
                        device.setSwitch(state);
                    }
                    if (device instanceof CloudSwitchController) {
                        device.updateSwitch(state);
                    }
                    if (device instanceof CloudRGBLightController) {
                        if (state === 'off') {
                            device.updateLight({
                                state,
                            });
                            return;
                        }
                        const { hs_color, color_temp, brightness_pct = 0 } = res.service_data;
                        const brightness = brightness_pct * 2.55;
                        let channel0 = 0,
                            channel1 = 0,
                            channel2 = 0,
                            channel3 = 0,
                            channel4 = 0,
                            type;
                        if (hs_color) {
                            [channel2, channel3, channel4] = device.parseHS2RGB(hs_color);
                        }
                        if (color_temp) {
                            if (color_temp < 34) {
                                type = 'cold';
                                channel0 = 128;
                            } else if (color_temp > 67) {
                                type = 'warm';
                                channel1 = 128;
                            } else {
                                type = 'middle';
                                channel0 = 128;
                                channel1 = 128;
                            }
                        }
                        if (brightness) {
                            channel0 = brightness;
                            channel1 = brightness;
                        }
                        if (state === 'on' && !hs_color && !color_temp && !brightness) {
                            channel0 = 128;
                            channel1 = 128;
                        }
                        device.updateLight({
                            channel0: `${channel0}`,
                            channel1: `${channel1}`,
                            channel2: `${channel2}`,
                            channel3: `${channel3}`,
                            channel4: `${channel4}`,
                            state,
                            type,
                        });
                    }
                }
            });

            HASocket.subscribeEvents('state_changed');
            // todo
            // HASocket.handleEvent('state_changed', (res: TypeHaSocketStateChangedData) => {
            //     try {
            //         const { entity_id, new_state } = res;
            //         console.log('Jia ~ file: initHaSocket.ts ~ line 33 ~ HASocket.handleEvent ~ new_state', new_state);
            //         if (entity_id) {
            //             const data = Controller.getDevice(entity_id);
            //             if (data && data.type === 1) {
            //                 (data as DiyDeviceController).updateState(new_state.state);
            //                 // (data as DiyDeviceController).setSwitch(new_state.state);
            //             }
            //             if (data && data.type === 4) {
            //                 (data as CloudSwitchController).updateSwitch(new_state.state);
            //             }
            //         }
            //     } catch (error) {
            //         console.log('Jia ~ file: initHaSocket.ts ~ line 45 ~ HASocket.handleEvent ~ error', error);
            //     }
            // });
        }
    } catch (err) {
        console.log('Jia ~ file: initHaSocket.ts ~ line 28 ~ err', err);
    }
};
