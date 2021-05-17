import express from 'express';
import {
    getDevices,
    disableDevice,
    updateDeviceName,
    proxy2ws,
    updateChannelName,
    getOTAinfo,
    getDeviceById,
    upgradeDevice,
    updateDiyDevice,
    removeDiyDevice,
    changeUnit,
    setRate,
    updateLanDevice,
} from '../services/devices';
const router = express.Router();

// 获取设备列表
router.get('/', getDevices);

// 刷新设备列表
router.get(
    '/refresh',
    (req, res, next) => {
        req.body.refresh = true;
        next();
    },
    getDevices
);

// 获取单个设备信息
router.get('/device', getDeviceById);

// 升级固件
router.post('/device/upgrade', upgradeDevice);

// 禁用实体
router.post('/disabled', disableDevice);

// 更改设备名称
router.post('/updateName', updateDeviceName);

// 更新通道名称
router.post('/updateChannelName', updateChannelName);

// 代理到CK-WS
router.post('/proxy2ws', proxy2ws);

// 获取OTA信息
router.post('/getOTAinfo', getOTAinfo);

// 修改diy设备状态 --> 设备名称 开关 点动 通电状态
router.post('/diy', updateDiyDevice);

// 删除DIY设备
router.delete('/diy', removeDiyDevice);

// 修改恒温恒湿设备温度单位
router.post('/device/unit', changeUnit);

// 修改电量统计设备的费率
router.post('/device/rate', setRate);

// 操控lan设备
router.post('/lan', updateLanDevice);

export default router;
