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

export {
    ICloudDeviceParams,
    ICloudSwitchParams,
    ITemperatureAndHumidityModificationParams,
    ICloudRGBLightParams,
    ICloudDimmingParams,
    ICloudPowerDetectionSwitchParams,
    ICloudMultiChannelSwitchParams,
};
