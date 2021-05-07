import _ from 'lodash';
import HASocket from '../class/HASocketClass';
import Controller from '../controller/Controller';
import DiyDeviceController from '../controller/DiyDeviceController';
import LanSwitchController from '../controller/LanSwitchController';
import CloudSwitchController from '../controller/CloudSwitchController';
import CloudRGBLightController from '../controller/CloudRGBLightController';
import CloudDimmingController from '../controller/CloudDimmingController';
import CloudPowerDetectionSwitchController from '../controller/CloudPowerDetectionSwitchController';
import CloudMultiChannelSwitchController from '../controller/CloudMultiChannelSwitchController';
import CloudRGBLightStripController from '../controller/CloudRGBLightStripController';
import { TypeHaSocketCallServiceData } from '../ts/type/TypeHaSocketMsg';
import LanMultiChannelSwitchController from '../controller/LanMultiChannelSwitchController';
import CloudTandHModificationController from '../controller/CloudTandHModificationController';
import CloudDoubleColorLightController from '../controller/CloudDoubleColorLightController';
import CloudDualR3Controller from '../controller/CloudDualR3Controller';
import eventBus from './eventBus';

/**
 * @param {string} entity_id 实体id
 * @param {string} state // on | off
 * @param {*} res socket 返回的信息主体
 * @param {{ outlet: number; switch: string }[]} [mutiSwitchState] 可选，控制多通道的全开/全关
 * @return {*}
 */
const handleDeviceByEntityId = async (entity_id: string, state: string, res: any, mutiSwitchState?: { outlet: number; switch: string }[]) => {
    const device = Controller.getDevice(entity_id.replace(/_\d+$/, ''));
    // DIY
    if (device instanceof DiyDeviceController) {
        await device.setSwitch(state);
    }

    // LAN
    if (device instanceof LanSwitchController) {
        await device.setSwitch(state);
    }

    // LAN
    if (device instanceof LanMultiChannelSwitchController) {
        if (mutiSwitchState) {
            await device.setSwitch(mutiSwitchState);
        } else {
            const [id, outlet] = entity_id.split('_');
            await device.setSwitch([
                {
                    outlet: +outlet - 1,
                    switch: state,
                },
            ]);
        }
    }

    // Cloud
    if (device instanceof CloudSwitchController) {
        await device.updateSwitch(state);
    }
    if (device instanceof CloudRGBLightController) {
        if (state === 'off') {
            await device.updateLight({
                state,
            });
            return;
        }
        const { hs_color, brightness_pct = 0 } = res.service_data;
        const params = device.parseHaData2Ck({ hs_color, brightness_pct, state });
        await device.updateLight(params);
    }
    if (device instanceof CloudDimmingController) {
        const { brightness_pct } = res.service_data;
        await device.updateLight({
            switch: state,
            bright: brightness_pct,
        });
    }
    if (device instanceof CloudPowerDetectionSwitchController) {
        await device.updateSwitch(state);
    }

    if (device instanceof CloudTandHModificationController) {
        await device.updateSwitch(state);
    }

    if (device instanceof CloudMultiChannelSwitchController) {
        if (mutiSwitchState) {
            await device.updateSwitch(mutiSwitchState);
        } else {
            const [id, outlet] = entity_id.split('_');
            await device.updateSwitch([
                {
                    outlet: +outlet - 1,
                    switch: state,
                },
            ]);
        }
    }

    if (device instanceof CloudRGBLightStripController) {
        if (state === 'off') {
            await device.updateLight({
                switch: state,
            });
            return;
        }
        const { hs_color, color_temp, brightness_pct = 0 } = res.service_data;
        const params = device.parseHaData2Ck({ hs_color, brightness_pct, state });
        await device.updateLight(params);
    }

    if (device instanceof CloudDoubleColorLightController) {
        if (state === 'off') {
            await device.updateLight({
                switch: state,
            });
            return;
        }
        const { color_temp, brightness_pct } = res.service_data;
        await device.updateLight({
            switch: state,
            ct: color_temp,
            br: brightness_pct,
        });
    }
    if (device instanceof CloudDualR3Controller) {
        if (mutiSwitchState) {
            await device.updateSwitch(mutiSwitchState);
        } else {
            const [id, outlet] = entity_id.split('_');
            await device.updateSwitch([
                {
                    outlet: +outlet - 1,
                    switch: state,
                },
            ]);
        }
    }
};

export default async (reconnect = false) => {
    try {
        const res = await HASocket.init(reconnect);
        if (res === 0) {
            HASocket.subscribeEvents('call_service');
            HASocket.handleEvent('call_service', async (res: TypeHaSocketCallServiceData) => {
                console.log('HA触发call_service事件', res);

                const {
                    service_data: { entity_id },
                    service,
                } = res;
                const state = service === 'turn_off' ? 'off' : 'on';

                if (Array.isArray(entity_id)) {
                    // 暂存多通道设备
                    const tmpMap = new Map<
                        string,
                        {
                            outlet: number;
                            switch: string;
                        }[]
                    >();

                    entity_id.forEach((item) => {
                        const [deviceid, outlet] = item.split('_');
                        const device = Controller.getDevice(deviceid);
                        // 一次性控制多通道设备多个通道
                        if (device instanceof LanMultiChannelSwitchController || device instanceof CloudMultiChannelSwitchController || device instanceof CloudDualR3Controller) {
                            if (tmpMap.has(deviceid)) {
                                tmpMap.get(deviceid)!.push({
                                    outlet: outlet - 1,
                                    switch: state,
                                });
                            } else {
                                tmpMap.set(deviceid, [
                                    {
                                        outlet: outlet - 1,
                                        switch: state,
                                    },
                                ]);
                            }
                        } else {
                            handleDeviceByEntityId(item, state, res);
                        }
                    });

                    for (let [id, mutiSwitchState] of tmpMap.entries()) {
                        await handleDeviceByEntityId(id, state, res, mutiSwitchState);
                    }
                }

                if (typeof entity_id === 'string') {
                    await handleDeviceByEntityId(entity_id, state, res);
                }
                eventBus.emit('sse');
            });
        }
    } catch (err) {
        console.log('Jia ~ file: initHaSocket.ts ~ line 28 ~ err', err);
    }
};
