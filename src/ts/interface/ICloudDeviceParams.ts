interface ICloudDeviceParams {
    bindInfos: any;
    version: number;
    sledOnline: string;
    ssid: string;
    bssid: string;
    switch: string;
    fwVersion: string;
    rssi: number;
    staMac: string;
    startup: string;
    init: number;
    pulse: string;
    pulseWidth: number;
}

interface ICloudSwitchParams extends ICloudDeviceParams {}

interface ITemperatureAndHumidityModificationParams extends ICloudDeviceParams {
    mainSwitch: string;
    deviceType: string;
    sensorType: string;
    currentHumidity: string;
    currentTemperature: string;
}

export { ICloudDeviceParams, ICloudSwitchParams, ITemperatureAndHumidityModificationParams };
