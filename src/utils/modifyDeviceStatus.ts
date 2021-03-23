import { appendData } from './dataUtil';

const modifyDeviceStatus = (id: string, status: boolean) => {
    return appendData('disabled.json', [id], status);
};

export default modifyDeviceStatus;
