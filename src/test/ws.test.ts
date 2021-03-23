import coolKitWs from 'coolkit-ws';
import { appId, appSecret } from '../config/app';
import { getDataSync } from '../utils/dataUtil';
(async () => {
    const at = getDataSync('user.json', ['at']);
    const apikey = getDataSync('user.json', ['user', 'apikey']);

    const result = await coolKitWs.init({
        appid: appId,
        secret: appSecret,
        at,
        apikey,
    });
    
    console.log('连接的结果: ', result);
})();
