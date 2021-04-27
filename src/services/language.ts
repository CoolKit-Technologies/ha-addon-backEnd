import { Request, Response } from 'express';
import _ from 'lodash';
import HASocket from '../class/HASocketClass';

const getLanguage = async (req: Request, res: Response) => {
    try {
        const data = await HASocket.query({
            key: 'language',
            type: 'frontend/get_user_data',
        });
        res.json({
            error: 0,
            data: _.get(data, 'value.language', 'en'),
        });
    } catch (err) {
        res.json({
            error: 500,
            data: null,
        });
    }
};

export { getLanguage };
