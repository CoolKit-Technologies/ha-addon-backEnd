import CkApi from 'coolkit-open-api';
import { getDataSync, saveData } from './dataUtil';
import getThings from './getThings';
export default async () => {
    CkApi.init({
        appId: 'KOBxGJna5qkk3JLXw3LHLX3wSNiPjAVi',
        appSecret: '4v0sv6X5IM2ASIBiNDj6kGmSfxo40w7n',
    });
    const loginParams = getDataSync('user.json', ['login']);
    if (loginParams) {
        const result = await CkApi.user.login(loginParams);
        if (result.error === 0) {
            saveData('user.json', JSON.stringify({ ...result.data, login: loginParams }));
            await getThings();
        }
    }
};
