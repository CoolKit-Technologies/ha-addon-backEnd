import { Request, Response } from 'express';
import Controller from '../controller/Controller';
import { getDataSync } from '../utils/dataUtil';
import getThings from '../utils/getThings';
import sleep from '../utils/sleep';
import initMdns from '../utils/initMdns';
import modifyDeviceStatus from '../utils/modifyDeviceStatus';
import formatDevice from '../utils/formatDevice';

const mdns = initMdns();

const getDevices = async (req: Request, res: Response) => {
    try {
        const { type } = req.query;
        const { refresh } = req.body;
        if (type === undefined) {
            res.json({
                error: 401,
                data: null,
            });
        }

        if (refresh) {
            console.log('Jia ~ file: devices.ts ~ line 23 ~ getDevices ~ mdns', mdns);
            mdns.query({
                questions: [
                    {
                        name: '_ewelink._tcp.local',
                        type: 'PTR',
                    },
                ],
            });
            const lang = getDataSync('user.json', ['login', 'lang']);
            await getThings();
            await sleep(5000);
        }

        const [cloud, lan, diy] = (+type!).toString(2).padStart(3, '0').split('');
        const data: any[] = [];
        for (let item of Controller.deviceMap.values()) {
            if (item.type === 1 && +diy) {
                data.push(formatDevice(item));
            }
            if (item.type === 2 && +lan) {
                data.push(formatDevice(item));
            }
            if (item.type === 4 && +cloud) {
                data.push(formatDevice(item));
            }
        }
        res.json({
            error: 0,
            data,
        });
    } catch (err) {
        console.log('Jia ~ file: devices.ts ~ line 22 ~ getDevices ~ err', err);
        res.json({
            error: 500,
            data: null,
        });
    }
};

const disableDevice = async (req: Request, res: Response) => {
    try {
        const { disabled, id } = req.body;
        const device = Controller.getDevice(id);
        if (!device) {
            res.json({
                error: 402,
                msg: 'not such device',
            });
        }
        device!.disabled = disabled;
        const error = await modifyDeviceStatus(id, disabled);
        if (error === 0) {
            res.json({
                error: 0,
                data: null,
            });
        } else {
            res.json({
                error: 500,
                data: null,
            });
        }
    } catch (err) {
        console.log('Jia ~ file: devices.ts ~ line 71 ~ disableDevice ~ err', err);
        res.json({
            error: 500,
            data: null,
        });
    }
};

export { getDevices, disableDevice };
