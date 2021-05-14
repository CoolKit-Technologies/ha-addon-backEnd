import Controller from '../controller/Controller';
import DiyController from '../controller/DiyDeviceController';
import { appendData } from './dataUtil';
import eventBus from './eventBus';

export default async (id: string, params: { deviceName: string }) => {
    const error = await appendData('diy.json', [id, 'deviceName'], params.deviceName);
    if (error === 0) {
        const device = Controller.getDevice(id);
        if (device instanceof DiyController) {
            device.deviceName = params.deviceName;
            // 修改DIY名字没有触发MDNS，主动触发sse
            eventBus.emit('sse');
        }
    }
    return {
        error,
    };
};
