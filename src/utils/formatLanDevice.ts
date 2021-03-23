import TypeLanDevice from '../ts/type/TypeMdnsLanDevice';
import AuthUtils from './lanControlAuthenticationUtils';
import { getDataSync } from './dataUtil';
export default (device: TypeLanDevice) => {
    const { txt, a, srv } = device;
    try {
        const apikey = getDataSync('user.json', ['user', 'apikey']) || '';
        const encryptedData = `${txt.data1 || ''}${txt.data2 || ''}${txt.data3 || ''}${txt.data4 || ''}`;
        const data = JSON.parse(
            AuthUtils.decryptionData({
                iv: txt.iv,
                key: apikey,
                data: encryptedData,
            })
        );

        console.log(txt.id, '解密成功===========', data);
        return {
            id: txt.id,
            type: txt.type,
            data,
            ip: a,
            port: srv.port,
        };
    } catch (error) {
        return null;
    }
};
