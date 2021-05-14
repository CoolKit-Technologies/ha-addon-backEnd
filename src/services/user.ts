import { Request, Response } from 'express';
import CkApi from 'coolkit-open-api';
import { saveData, clearData, getDataSync } from '../utils/dataUtil';
import getThings from '../utils/getThings';
import Controller from '../controller/Controller';
import coolKitWs from 'coolkit-ws';
import { appId, appSecret } from '../config/app';
import _ from 'lodash';
import eventBus from '../utils/eventBus';
import LanDeviceController from '../controller/LanDeviceController';
import CloudDeviceController from '../controller/CloudDeviceController';
import { getAuth } from '../apis/restApi';
import AuthClass from '../class/AuthClass';
import generateLovelace from '../utils/generateLovelace';
import removeEntityByDevice from '../utils/removeEntityByDevice';

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
            const region = _.get(result, ['data', 'region']);
            await coolKitWs.init({
                appid: appId,
                at,
                apikey,
                region,
                userAgent: 'app',
            });
            await getThings();
            eventBus.emit('sse');
            generateLovelace();
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
        for (let [id, device] of Controller.deviceMap.entries()) {
            removeEntityByDevice(device);
            if (device instanceof LanDeviceController) {
                device.selfApikey = undefined;
                device.devicekey = undefined;
                device.deviceName = undefined;
                device.extra = undefined;
                device.params = undefined;
            }
            if (device instanceof CloudDeviceController) {
                Controller.deviceMap.delete(id);
            }
        }
        Controller.unsupportDeviceMap.clear();
        const ckRes = await CkApi.user.logout();
        console.log('Jia ~ file: user.ts ~ line 41 ~ logout ~ ckRes', ckRes);
        res.json({
            error: 0,
            data: null,
        });
        eventBus.emit('sse');
    } catch (err) {
        console.log(err);
        res.json({
            error: 500,
            data: err,
        });
    }
};

const isLogin = async (req: Request, res: Response) => {
    try {
        const result = await getDataSync('user.json');
        if (result && result.at) {
            res.json({
                error: 0,
                data: { isLogin: true },
            });
            return;
        }
        res.json({
            error: 0,
            data: { isLogin: false },
        });
    } catch (err) {
        console.log(err);
        res.json({
            error: 500,
            data: err,
        });
    }
};
const auth = async (req: Request, res: Response) => {
    try {
        console.log('Jia ~ file: user.ts ~ line 110 ~ auth ~ req.body', req.body);
        if (AuthClass.isValid(req.ip)) {
            res.json({
                error: 0,
                data: null,
            });
            return;
        }
        const { code, clientId } = req.body;
        const result = await getAuth(clientId, code);
        if (result && result.status === 200) {
            // todo
            AuthClass.setAuth(req.ip, clientId, result.data);
            eventBus.emit('init-ha-socket');
            console.log('Jia ~ file: redirectToAuth.ts ~ line 44 ~ result.data', result.data);
            res.json({
                error: 0,
                data: null,
            });
        } else {
            res.json({
                error: result.status,
                data: null,
            });
        }
    } catch (err) {
        console.log(err);
        res.json({
            error: 500,
            data: err,
        });
    }
};

export { login, logout, isLogin, auth };
