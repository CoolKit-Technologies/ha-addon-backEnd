import CkApi from 'coolkit-open-api';
import { getDataSync, saveData } from './dataUtil';
import generateLovelace from './generateLovelace';
import getThings from './getThings';

export default async () => {
    const loginParams = getDataSync('user.json', ['login']);
    console.log('Jia ~ file: initCkApi.ts ~ line 9 ~ loginParams', loginParams);
    if (loginParams) {
        const result = await CkApi.user.login(loginParams);
        console.log('Jia ~ file: initCkApi.ts ~ line 10 ~ result', result);
        if (result.error === 0) {
            console.log('relogin success');
            await saveData('user.json', JSON.stringify({ ...result.data, login: loginParams }));
            await getThings();
        }
    }
};
