import { appendData } from './dataUtil';

const modifyDeviceStatus = (id: string, status: boolean) => {
    return appendData('disabled.json', [id], status);
};

const changeDeviceUnit = (id: string, unit: string) => {
    return appendData('unit.json', [id], unit);
};

export { modifyDeviceStatus, changeDeviceUnit };
