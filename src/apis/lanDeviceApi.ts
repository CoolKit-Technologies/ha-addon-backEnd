import axios from 'axios';
import AuthUtil from '../utils/lanControlAuthenticationUtils';

const setSwitch = async (params: { ip: string; port: number; deviceid: string; devicekey: string; data: string; selfApikey: string }) => {
    const { ip, port, deviceid, devicekey, data, selfApikey } = params;
    const iv = `abcdef${Date.now()}abcdef`.slice(0, 16);
    const reqData = {
        iv: AuthUtil.encryptionBase64(`abcdef${Date.now()}abcdef`.slice(0, 16)),
        deviceid,
        selfApikey,
        encrypt: true,
        sequence: `${Date.now()}`,
        data: AuthUtil.encryptionData({
            iv,
            data,
            key: devicekey,
        }),
    };
    const res = await axios.post(`http://${ip}:${port}/zeroconf/switch`, reqData);
    return res;
};

export { setSwitch };
