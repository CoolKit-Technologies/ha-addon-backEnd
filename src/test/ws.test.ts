import coolKitWs from 'coolkit-ws';
import { appId, appSecret } from '../config/app';
import { getDataSync } from '../utils/dataUtil';
(async () => {
    const at = getDataSync('user.json', ['at']);
    const apikey = getDataSync('user.json', ['user', 'apikey']);
    const region = getDataSync('user.json', ['region']);

    const result = await coolKitWs.init({
        appid: appId,
        region,
        userAgent: 'app',
        at,
        apikey,
    });

    console.log('connect result: ', result);
})();
