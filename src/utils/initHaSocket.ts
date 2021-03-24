import _ from 'lodash';
import HASocket from '../class/HASocketClass';
import Controller from '../controller/Controller';
import DiyDeviceController from '../controller/DiyDeviceController';
import CloudSwitchController from '../controller/CloudSwitchController';
import { TypeHaSocketStateChangedData, TypeHaSocketCallServiceData } from '../ts/type/TypeHaSocketMsg';
import CloudRGBLightController from '../controller/CloudRGBLightController';
import CloudDimmingController from '../controller/CloudDimmingController';
import CloudPowerDetectionSwitchController from '../controller/CloudPowerDetectionSwitchController';
import CloudMultiChannelSwitch from '../controller/CloudMultiChannelSwitch';

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
                    const device = Controller.getDevice(entity_id.replace(/_\d+$/, ''));
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
                        const params = device.parseHaData2Ck({ hs_color, color_temp, brightness_pct, state });
                        device.updateLight(params);
                    }
                    if (device instanceof CloudDimmingController) {
                        const { brightness_pct } = res.service_data;
                        device.updateLight({
                            switch: state,
                            bright: brightness_pct,
                        });
                    }
                    if (device instanceof CloudPowerDetectionSwitchController) {
                        device.updateSwitch(state);
                    }
                    if (device instanceof CloudMultiChannelSwitch) {
                        const [id, outlet] = entity_id.split('_');
                        const switches = [
                            {
                                outlet: +outlet - 1,
                                switch: state,
                            },
                        ];
                        device.updateSwitch(switches);
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
