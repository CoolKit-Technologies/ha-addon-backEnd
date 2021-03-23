import { Request, Response } from 'express';
import CkApi from 'coolkit-open-api';
import { saveData, clearData } from '../utils/dataUtil';
import getThings from '../utils/getThings';

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
        if (result.error === 0) {
            saveData('user.json', JSON.stringify({ ...result.data, login: { ...req.body } }));
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
        if (result === 0) {
            res.json({
                error: 0,
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
export { login, logout };
