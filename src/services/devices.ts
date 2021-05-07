import { Request, Response } from 'express';
import CkWs from 'coolkit-ws';
import Controller from '../controller/Controller';
import getThings from '../utils/getThings';
import sleep from '../utils/sleep';
import initMdns from '../utils/initMdns';
import { modifyDeviceStatus, changeDeviceUnit, setDeviceRate } from '../utils/modifyDeviceStatus';
import { getFormattedDeviceList, formatDevice } from '../utils/formatDevice';
import { removeStates } from '../apis/restApi';
import CloudTandHModificationController from '../controller/CloudTandHModificationController';
import CloudMultiChannelSwitchController from '../controller/CloudMultiChannelSwitchController';
import LanMultiChannelSwitchController from '../controller/LanMultiChannelSwitchController';
import { getOTAinfoAPI, updateChannelNameAPI, updateDeviceNameAPI } from '../apis/ckApi';
import { updateDiyPulseAPI, updateDiySledOnlineAPI, updateDiyStartupAPI, updateDiySwitchAPI } from '../apis/diyDeviceApi';
import DiyController from '../controller/DiyDeviceController';
import { appendData, getDataSync, saveData } from '../utils/dataUtil';
import _ from 'lodash';
import eventBus from '../utils/eventBus';
import LanDeviceController from '../controller/LanDeviceController';
import CloudDeviceController from '../controller/CloudDeviceController';
import CloudDualR3Controller from '../controller/CloudDualR3Controller';
import CloudPowerDetectionSwitchController from '../controller/CloudPowerDetectionSwitchController';
import mergeDeviceParams from '../utils/mergeDeviceParams';
import CloudSwitchController from '../controller/CloudSwitchController';
import syncDevice2Ha from '../utils/syncDevice2Ha';
import removeEntityByDevice from '../utils/removeEntityByDevice';

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
            syncDevice2Ha({
                syncLovelace: false,
                sleepTime: 2000,
            });
        }

        // const [cloud, lan, diy] = (+type!).toString(2).padStart(3, '0').split('');
        // const data: any[] = [];
        // for (let item of Controller.deviceMap.values()) {
        //     if (item.type === 1 && +diy) {
        //         data.push(formatDevice(item));
        //     }
        //     if (item.type === 2 && +lan) {
        //         data.push(formatDevice(item));
        //     }
        //     if (item.type === 4 && +cloud) {
        //         data.push(formatDevice(item));
        //     }
        // }
        // for (let item of Controller.unsupportDeviceMap.values()) {
        //     data.push(item);
        // }
        // const oldDiyDevices = getDataSync('diy.json', []) as { [key: string]: boolean };
        // for (let key in oldDiyDevices) {
        //     if (!Controller.getDevice(key)) {
        //         data.push({
        //             online: false,
        //             type: 1,
        //             deviceId: key,
        //         });
        //     }
        // }
        const data = getFormattedDeviceList();

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
            removeEntityByDevice(device);
        }
        if (!disabled) {
            syncDevice2Ha({
                syncLovelace: true,
                sleepTime: 2000,
            });
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
        if (device instanceof CloudDeviceController || device instanceof LanDeviceController) {
            const { error } = await updateDeviceNameAPI(id, newName);
            if (error === 0) {
                res.json({
                    error: 0,
                    data: null,
                });
                device.deviceName = newName;
                eventBus.emit('sse');
            } else {
                console.log('更新设备名称出错, id:', id, '\nerror:', error);
                res.json({
                    error,
                    data: null,
                });
            }
        } else {
            res.json({
                error: 402,
                msg: 'not such device',
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

const updateChannelName = async (req: Request, res: Response) => {
    try {
        const { tags, id } = req.body;
        let ck_channel_name = tags;
        const device = Controller.getDevice(id);
        if (device instanceof LanMultiChannelSwitchController || device instanceof CloudMultiChannelSwitchController || device instanceof CloudDualR3Controller) {
            ck_channel_name = {
                ...device.channelName,
                ...ck_channel_name,
            };
            const { error } = await updateChannelNameAPI(id, {
                ck_channel_name,
            });
            if (error === 0) {
                res.json({
                    error: 0,
                    data: null,
                });
                device.channelName = ck_channel_name;
                eventBus.emit('sse');
                return;
            } else {
                res.json({
                    error,
                    data: null,
                });
            }
        }
        res.json({
            error: 500,
            data: null,
        });
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
        console.log('Jia ~ file: devices.ts ~ line 259 ~ proxy2ws ~ params', params);
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
                data: result,
            });

            const device = Controller.getDevice(id);
            if (device instanceof CloudDeviceController || device instanceof LanDeviceController) {
                device.params = mergeDeviceParams(device.params, params);
                device.online = true;
            }
            if (device instanceof CloudSwitchController || device instanceof CloudTandHModificationController) {
                // 同步到HA
                device.updateState(device.params.switch);
            }
            if (device instanceof CloudPowerDetectionSwitchController) {
                // 同步到HA
                device.updateState({
                    status: device.params.switch,
                });
            }
            if (device instanceof CloudMultiChannelSwitchController || device instanceof CloudDualR3Controller) {
                // 同步到HA
                device.updateState(device.params.switches);
            }
            eventBus.emit('sse');
        } else {
            res.json({
                error,
                data: result,
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
    const { type, id, params } = req.body;

    try {
        const device = Controller.getDevice(id);
        if (device instanceof DiyController) {
            let result;
            const reqParams = {
                deviceid: id,
                ip: device.ip,
                port: device.port,
                ...params,
            };
            console.log('Jia ~ file: devices.ts ~ line 366 ~ updateDiyDevice ~ reqParams', reqParams);
            if (type === 'switch') {
                result = await updateDiySwitchAPI(reqParams);
            }
            if (type === 'startup') {
                result = await updateDiyStartupAPI(reqParams);
            }
            if (type === 'pulse') {
                result = await updateDiyPulseAPI(reqParams);
            }
            if (type === 'sledOnline') {
                result = await updateDiySledOnlineAPI(reqParams);
            }
            console.log('Jia ~ file: devices.ts ~ line 381 ~ updateDiyDevice ~ result', result);
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
        Controller.deviceMap.delete(id);
        eventBus.emit('sse');
    }
};

const removeDiyDevice = async (req: Request, res: Response) => {
    try {
        const { id } = req.body;
        const diyDevices = getDataSync('diy.json', []);
        const code = saveData('diy.json', JSON.stringify(_.omit(diyDevices, [id])));
        if (code) {
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
        res.json({
            error: 500,
            data: null,
        });
    }
};

// 更改恒温恒湿设备的温度单位
const changeUnit = async (req: Request, res: Response) => {
    try {
        const { id, unit } = req.body;
        const device = Controller.getDevice(id);
        if (device instanceof CloudTandHModificationController) {
            const code = await changeDeviceUnit(id, unit);
            if (code === 0) {
                res.json({
                    error: 0,
                    data: null,
                });
                device.unit = unit;
            } else {
                res.json({
                    error: 500,
                    data: null,
                });
            }
            eventBus.emit('sse');
        } else {
            res.json({
                error: 402,
                data: null,
                msg: 'not such device',
            });
        }
    } catch (err) {
        res.json({
            error: 500,
            data: null,
        });
    }
};

// 设置功率检查插座 & DualR3费率
const setRate = async (req: Request, res: Response) => {
    try {
        const { id, rate } = req.body;
        const device = Controller.getDevice(id);
        if (device instanceof CloudPowerDetectionSwitchController || device instanceof CloudDualR3Controller) {
            const code = await setDeviceRate(id, rate);
            if (code === 0) {
                res.json({
                    error: 0,
                    data: null,
                });
                device.rate = rate;
            } else {
                res.json({
                    error: 500,
                    data: null,
                });
            }
            eventBus.emit('sse');
        } else {
            res.json({
                error: 402,
                data: null,
                msg: 'not such device',
            });
        }
    } catch (err) {
        res.json({
            error: 500,
            data: null,
        });
    }
};

export {
    getDevices,
    getDeviceById,
    disableDevice,
    updateDeviceName,
    updateChannelName,
    proxy2ws,
    getOTAinfo,
    upgradeDevice,
    updateDiyDevice,
    removeDiyDevice,
    changeUnit,
    setRate,
};
