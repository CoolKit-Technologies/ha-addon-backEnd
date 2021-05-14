import { removeStates } from '../apis/restApi';
import CloudDeviceController from '../controller/CloudDeviceController';
import CloudDualR3Controller from '../controller/CloudDualR3Controller';
import CloudMultiChannelSwitchController from '../controller/CloudMultiChannelSwitchController';
import CloudTandHModificationController from '../controller/CloudTandHModificationController';
import DiyController from '../controller/DiyDeviceController';
import LanDeviceController from '../controller/LanDeviceController';
import LanDualR3Controller from '../controller/LanDualR3Controller';
import LanMultiChannelSwitchController from '../controller/LanMultiChannelSwitchController';
import LanTandHModificationController from '../controller/LanTandHModificationController';

export default (device: LanDeviceController | DiyController | CloudDeviceController) => {
    if (device instanceof DiyController) {
        return;
    }
    if (device instanceof CloudTandHModificationController || device instanceof LanTandHModificationController) {
        removeStates(device.entityId);
        removeStates(`sensor.${device.deviceId}_h`);
        removeStates(`sensor.${device.deviceId}_t`);
    }
    if (device instanceof CloudMultiChannelSwitchController || device instanceof CloudDualR3Controller) {
        for (let i = 0; i < device.maxChannel; i++) {
            removeStates(`${device.entityId}_${i + 1}`);
        }
    }
    if (device instanceof LanMultiChannelSwitchController || device instanceof LanDualR3Controller) {
        if (device.maxChannel) {
            for (let i = 0; i < device.maxChannel; i++) {
                removeStates(`${device.entityId}_${i + 1}`);
            }
        }
    }

    removeStates(device.entityId);
};
