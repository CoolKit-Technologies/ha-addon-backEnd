import { TypeLtypeParams, TypeLtype } from '../type/TypeLtype';

interface ICloudDeviceParams {
    bindInfos: any;
    version: number;
    fwVersion: string;
    rssi: number;
    staMac: string;
}

interface ICloudSwitchParams extends ICloudDeviceParams {
    sledOnline: string;
    ssid: string;
    bssid: string;
    switch: string;
    startup: string;
    init: number;
    pulse: string;
    pulseWidth: number;
}
interface ICloudPowerDetectionSwitchParams extends ICloudSwitchParams {
    alarmType: string;
    alarmVValue: [number, number];
    alarmCValue: [number, number];
    alarmPValue: [number, number];
    power: string;
    voltage: string;
    current: string;
    oneKwh: string;
    uiActive: number;
    hundredDaysKwh: string;
}

interface ITemperatureAndHumidityModificationParams extends ICloudDeviceParams {
    sledOnline: string;
    ssid: string;
    bssid: string;
    init: number;
    startup: string;
    pulse: string;
    pulseWidth: number;
    switch: string;
    mainSwitch: string;
    deviceType: string;
    sensorType: string;
    currentHumidity: string;
    currentTemperature: string;
}

interface ICloudRGBLightParams extends ICloudDeviceParams {
    channel0: string;
    channel1: string;
    channel2: string;
    channel3: string;
    channel4: string;
    state: string;
    type: string;
    zyx_mode: number;
}

type IDoubleCloudLightParams = ICloudDeviceParams &
    TypeLtypeParams & {
        switch: string;
        ltype: TypeLtype;
    };

interface ICloudDimmingParams extends ICloudDeviceParams {
    switch: string;
    bright: number;
}

interface ICloudMultiChannelSwitchParams extends ICloudDeviceParams {
    lock: number;
    configure: {
        startup: string;
        outlet: number;
    }[];
    pulses: {
        pulse: string;
        width: number;
        outlet: number;
    }[];
    switches: {
        outlet: number;
        switch: string;
    }[];
}
interface ICloudRGBLightStripParams extends ICloudDeviceParams {
    sledOnline: string;
    ssid: string;
    bssid: string;
    switch: string;
    light_type: number; // 1->彩光（色盘） 2->白光（色温）
    colorR: number; // R值，红色通道范围0-255
    colorG: number; // G值，绿色通道范围0-255
    colorB: number; // B值，蓝色通道范围0-255
    bright: number; // 灯光亮度，范围1-100，值越大越亮
    mode: number; // 灯带可选的模式，总共12个模式：1 七彩（普通），2 七彩渐变，3 七彩跳变，4 DIY 渐变，5 DIY 流光，6 DIY 跳变，7 DIY 频闪，8 RGB 渐变，9 RGB 流光，10 RGB 跳变，11 RGB 频闪，12 音乐可视化
    speed: number; // 灯带在不同颜色之间的变化快慢速度，取值范围1-100，值越大速度越快
    sensitive: number; // 灯带在音乐可视化模式下灯光变化的灵敏度，取值范围1-10，值越大灵敏度越高
}

export {
    ICloudDeviceParams,
    ICloudSwitchParams,
    ITemperatureAndHumidityModificationParams,
    ICloudRGBLightParams,
    ICloudDimmingParams,
    ICloudPowerDetectionSwitchParams,
    ICloudMultiChannelSwitchParams,
    ICloudRGBLightStripParams,
    IDoubleCloudLightParams,
};
