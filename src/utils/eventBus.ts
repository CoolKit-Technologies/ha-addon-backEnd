import EE from 'eventemitter3';
import CloudDeviceController from '../controller/CloudDeviceController';
import Controller from '../controller/Controller';
import LanDeviceController from '../controller/LanDeviceController';
import TypeCkSocketMsg from '../ts/type/TypeCkSocketMsg';

const eventBus = new EE();

eventBus.on('update-controller', (str: string) => {
    const data = JSON.parse(str) as TypeCkSocketMsg;
    console.log('Jia ~ file: eventBus.ts ~ line 11 ~ eventBus.on ~ data', data);
    const device = Controller.getDevice(data.deviceid);
    if (device instanceof LanDeviceController || device instanceof CloudDeviceController) {
        device.params = {
            ...device.params,
            ...data.params,
        };
        device.online = true;
    }
});

eventBus.on('device-offline', (id) => {
    const device = Controller.getDevice(id);
    if (device instanceof LanDeviceController || device instanceof CloudDeviceController) {
        device.online = false;
    }
});

export default eventBus;
