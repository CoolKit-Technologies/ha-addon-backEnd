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

interface ICloudRGBLightParams {
    channel0: string;
    channel1: string;
    channel2: string;
    channel3: string;
    channel4: string;
    state: string;
    type: string;
    zyx_mode: number;
}

export { ICloudDeviceParams, ICloudSwitchParams, ITemperatureAndHumidityModificationParams, ICloudRGBLightParams };
