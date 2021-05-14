import TypeLanDevice from '../ts/type/TypeMdnsLanDevice';
import AuthUtils from './lanControlAuthenticationUtils';
import { getDataSync } from './dataUtil';
export default (device: TypeLanDevice) => {
    const { txt, a, srv } = device;
    const { data1 = '', data2 = '', data3 = '', data4 = '' } = txt;

    try {
        return {
            deviceId: txt.id,
            type: txt.type,
            encryptedData: `${data1}${data2}${data3}${data4}`,
            ip: a,
            port: srv.port,
            target: srv.target,
            iv: AuthUtils.decryptionBase64(txt.iv),
        };
    } catch (error) {
        return null;
    }
};
