import { Request, Response } from 'express';
import CkWs from 'coolkit-ws';
import Controller from '../controller/Controller';
import getThings from '../utils/getThings';
import sleep from '../utils/sleep';
import initMdns from '../utils/initMdns';
import modifyDeviceStatus from '../utils/modifyDeviceStatus';
import formatDevice from '../utils/formatDevice';
import { removeStates } from '../apis/restApi';
import CloudTandHModificationController from '../controller/CloudTandHModificationController';
import CloudMultiChannelSwitchController from '../controller/CloudMultiChannelSwitchController';
import LanMultiChannelSwitchController from '../controller/LanMultiChannelSwitchController';
import { getOTAinfoAPI, updateChannelNameAPI, updateDeviceNameAPI } from '../apis/ckApi';
import { updateDiyPulseAPI, updateDiySledOnlineAPI, updateDiyStartupAPI, updateDiySwitchAPI } from '../apis/diyDeviceApi';
import DiyController from '../controller/DiyDeviceController';

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
            mdns.query({
                questions: [
                    {
                        name: '_ewelink._tcp.local',
                        type: 'PTR',
                    },
                ],
            });
            await getThings();
            await sleep(1000);
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

const getDeviceById = async (req: Request, res: Response) => {
    try {
        const { id } = req.query;
        const device = Controller.getDevice(id as string);
        if (!device) {
            res.json({
                error: 402,
                msg: 'device not found',
            });
        }
        res.json({
            error: 0,
            data: formatDevice(device!),
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
        if (device && disabled) {
            if (device instanceof CloudTandHModificationController) {
                removeStates(device.entityId);
                removeStates(`sensor.${device.deviceId}_h`);
                removeStates(`sensor.${device.deviceId}_t`);
            }
            if (device instanceof CloudMultiChannelSwitchController) {
                for (let i = 0; i < device.maxChannel; i++) {
                    removeStates(`${device.entityId}_${i + 1}`);
                }
            }
            if (device instanceof LanMultiChannelSwitchController) {
                if (device.maxChannel) {
                    for (let i = 0; i < device.maxChannel; i++) {
                        removeStates(`${device.entityId}_${i + 1}`);
                    }
                }
            }
            removeStates(device.entityId);
        }

        if (!disabled) {
            mdns.query({
                questions: [
                    {
                        name: '_ewelink._tcp.local',
                        type: 'PTR',
                    },
                ],
            });
            await getThings();
            // todo
            await sleep(2000);
        }
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

const updateDeviceName = async (req: Request, res: Response) => {
    try {
        const { newName, id } = req.body;
        const device = Controller.getDevice(id);
        if (!device) {
            res.json({
                error: 402,
                msg: 'not such device',
            });
        }
        const { error } = await updateDeviceNameAPI(id, newName);
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
        await getThings();
    } catch (err) {
        console.log('Jia ~ file: devices.ts ~ line 71 ~ disableDevice ~ err', err);
        res.json({
            error: 500,
            data: null,
        });
    }
};

const updateChannelName = async (req: Request, res: Response) => {
    try {
        const { tags, id } = req.body;
        const { error } = await updateChannelNameAPI(id, {
            ck_channel_name: tags,
        });
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

const proxy2ws = async (req: Request, res: Response) => {
    try {
        const { apikey, id, params } = req.body;
        const result = await CkWs.updateThing({
            deviceApikey: apikey,
            deviceid: id,
            params,
        });
        console.log('Jia ~ file: devices.ts ~ line 222 ~ proxy2ws ~ result', result);
        const { error } = result;
        if (error === 0) {
            res.json({
                error: 0,
                data: null,
            });
        } else {
            res.json({
                error,
                data: null,
            });
        }
    } catch (err) {
        res.json({
            error: 500,
            data: null,
        });
    }
};

const getOTAinfo = async (req: Request, res: Response) => {
    try {
        const { list } = req.body;
        console.log('Jia ~ file: devices.ts ~ line 246 ~ getOTAinfo ~ list', list);
        const { error, data } = await getOTAinfoAPI(list);
        if (error === 0) {
            res.json({
                error: 0,
                data,
            });
        } else {
            res.json({
                error: 500,
                data: null,
            });
        }
    } catch (err) {
        res.json({
            error: 500,
            data: null,
        });
    }
};

const upgradeDevice = async (req: Request, res: Response) => {
    try {
        const { apikey, id, params } = req.body;
        const result = await CkWs.upgradeThing({
            deviceApikey: apikey,
            deviceid: id,
            params,
        });
        console.log('Jia ~ file: devices.ts ~ line 275 ~ upgradeDevice ~ result', result);
        const { error } = result;
        if (error === 0) {
            res.json({
                error: 0,
                data: null,
            });
        } else {
            res.json({
                error,
                data: null,
            });
        }
    } catch (err) {
        res.json({
            error: 500,
            data: null,
        });
    }
};

const updateDiyDevice = async (req: Request, res: Response) => {
    try {
        const { type, id, params } = req.body;
        const device = Controller.getDevice(id);
        if (device instanceof DiyController) {
            let result;
            if (type === 'switch') {
                result = await updateDiySwitchAPI({
                    deviceid: id,
                    ip: device.ip,
                    port: device.port,
                    ...params,
                });
            }
            if (type === 'startup') {
                result = await updateDiyStartupAPI({
                    deviceid: id,
                    ip: device.ip,
                    port: device.port,
                    ...params,
                });
            }
            if (type === 'pulse') {
                result = await updateDiyPulseAPI({
                    deviceid: id,
                    ip: device.ip,
                    port: device.port,
                    ...params,
                });
            }
            if (type === 'sledOnline') {
                result = await updateDiySledOnlineAPI({
                    deviceid: id,
                    ip: device.ip,
                    port: device.port,
                    ...params,
                });
            }
            console.log('Jia ~ file: devices.ts ~ line 320 ~ updateDiyDevice ~ result', result);
            if (result && result.error === 0) {
                res.json({
                    error: 0,
                    data: null,
                });
            } else {
                res.json({
                    error: result.error,
                    data: null,
                });
            }
        }
    } catch (err) {
        res.json({
            error: 500,
            data: null,
        });
    }
};

export { getDevices, getDeviceById, disableDevice, updateDeviceName, updateChannelName, proxy2ws, getOTAinfo, upgradeDevice, updateDiyDevice };
