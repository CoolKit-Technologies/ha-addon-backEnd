import EE from 'eventemitter3';
import CloudDeviceController from '../controller/CloudDeviceController';
import Controller from '../controller/Controller';
import LanDeviceController from '../controller/LanDeviceController';
import TypeCkSocketMsg from '../ts/type/TypeCkSocketMsg';

const eventBus = new EE();

eventBus.on('update-controller', (data: TypeCkSocketMsg) => {
    console.log('Jia ~ file: eventBus.ts ~ line 10 ~ eventBus.on ~ update-controller');
    const device = Controller.getDevice(data.deviceid);
    if (device instanceof LanDeviceController || device instanceof CloudDeviceController) {
        device.params = {
            ...device.params,
            ...data.params,
        };
    }
});

export default eventBus;
