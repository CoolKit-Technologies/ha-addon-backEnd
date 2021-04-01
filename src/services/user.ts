import { Request, Response } from 'express';
import CkApi from 'coolkit-open-api';
import { saveData, clearData, getDataSync } from '../utils/dataUtil';
import getThings from '../utils/getThings';
import Controller from '../controller/Controller';
import coolKitWs from 'coolkit-ws';
import { appId, appSecret } from '../config/app';
import _ from 'lodash';

/**
 * @param {string} lang
 * @param {string} email
 * @param {string} password
 * @param {string} countryCode
 * @param {string} phoneNumber
 */
const login = async (req: Request, res: Response) => {
    try {
        const { countryCode, phoneNumber, lang, password, email } = req.body;
        const result = await CkApi.user.login({
            countryCode,
            phoneNumber,
            lang,
            password,
            email,
        });
        console.log('Jia ~ file: user.ts ~ line 26 ~ login ~ result', result);
        if (result.error === 0) {
            saveData('user.json', JSON.stringify({ ...result.data, login: { ...req.body } }));
            const at = _.get(result, ['data', 'at']);
            const apikey = _.get(result, ['data', 'user', 'apikey']);
            await coolKitWs.init({
                appid: appId,
                secret: appSecret,
                at,
                apikey,
            });
            await getThings();
        }
        res.json(result);
    } catch (err) {
        console.log(err);
    }
};

const logout = async (req: Request, res: Response) => {
    try {
        const result = await clearData('user.json');
        console.log('Jia ~ file: user.ts ~ line 37 ~ logout ~ result', result);
        clearData('disabled.json');
        Controller.deviceMap.clear();
        const ckRes = await CkApi.user.logout();
        console.log('Jia ~ file: user.ts ~ line 41 ~ logout ~ ckRes', ckRes);
        res.json({
            error: 0,
            data: null,
        });
    } catch (err) {
        console.log(err);
        res.json({
            error: 500,
            data: err,
        });
    }
};
export { login, logout };
