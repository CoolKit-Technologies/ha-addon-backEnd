interface ITandHModificationSocketParams {
    currentTemperature?: string;
    currentHumidity?: string;
    switch?: string;
}

interface IPowerDetectionSwitchSocketParams {
    current?: string;
    voltage?: string;
    power?: string;
    switch: string;
}
interface IRGBLightStripSocketParams {
    light_type?: number;
    colorR?: number;
    colorG?: number;
    colorB?: number;
    bright?: number;
    mode?: number;
    speed?: number;
    sensitive?: number;
    switch?: string;
}

export { ITandHModificationSocketParams, IPowerDetectionSwitchSocketParams, IRGBLightStripSocketParams };
