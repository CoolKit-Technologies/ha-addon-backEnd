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
interface ICloudDualR3Params extends ICloudDeviceParams {
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
    workMode: 1 | 2 | 3;
    sledBright: 100;
    location: 50;
    currLocation: 50;
    calibration: 1;
    calibState: 1;
    swMode_00: 1;
    swMode_01: 1;
    current_00: number; // 通道1 的实时电流值
    voltage_00: number; // 通道1 的实时电压
    actPow_00: number; // 通道1 的实时有功功率
    reactPow_00: number; // 通道1 的实时无功功率
    apparentPow_00: number; // 通道1 的实时视在功率
    startTime_00: string; // 通道1 的单次电量统计的开始时间
    endTime_00: string; // 通道1 的单次电量统计的结束时间
    getKwh_00: number; // 通道1  获取用电量统计，1 获取单次统计用电量， 2 获取历史用电量
    oneKwhData_00: number; // 通道1 的本次用电量的信息，开通单次统计后，app下发refresh查询，设备返回的
    kwhHistories_00: string; // 通道1 的历史用电量（180天）

    current_01: number; // 通道2 的实时电流值
    voltage_01: number; // 通道2 的实时电压
    actPow_01: number; // 通道2 的实时有功功率
    reactPow_01: number; // 通道2 的实时无功功率
    apparentPow_01: number; // 通道2 的实时视在功率
    startTime_01: string; // 通道2 的单次电量统计的开始时间
    endTime_01: string; // 通道2 的单次电量统计的结束时间
    getKwh_01: number; // 通道2  获取用电量统计，1 获取单次统计用电量， 2 获取历史用电量
    oneKwhData_01: number; // 通道2 的本次用电量的信息，开通单次统计后，app下发refresh查询，设备返回的
    kwhHistories_01: string; // 通道2 的历史用电量（180天）
    zyx_clear_timers: boolean; // 清除服务端所有定时器，true 清除，false不清除
    uiActive: Object; // 激活UI
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
    ICloudDualR3Params,
};
