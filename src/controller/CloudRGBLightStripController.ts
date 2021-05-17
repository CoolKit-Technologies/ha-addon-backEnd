import CloudDeviceController from './CloudDeviceController';
import { ICloudRGBLightStripParams } from '../ts/interface/ICloudDeviceParams';
import ICloudDeviceConstrucotr from '../ts/interface/ICloudDeviceConstrucotr';
import { updateStates } from '../apis/restApi';
import coolKitWs from 'coolkit-ws';
import { parseHS2RGB, parseRGB2HS } from '../utils/colorUitl';
import { IRGBLightStripSocketParams } from '../ts/interface/ICkSocketParams';
import _ from 'lodash';
class CloudRGBLightStripController extends CloudDeviceController {
    online: boolean;
    disabled: boolean;
    entityId: string;
    uiid: number = 59;
    params: ICloudRGBLightStripParams;
    brightness: number;
    mode: number;
    speed: number;
    sensitive: number;
    hsColor: [number, number];
    updateLight!: (params: { switch: string; colorR?: number; colorG?: number; colorB?: number; bright?: number }) => Promise<void>;
    updateState!: (params: { status: string; mode?: number; speed?: number; sensitive?: number; brightness?: number; hs_color?: [number, number] }) => Promise<void>;

    parseRGB2HS!: (red: number, green: number, blue: number) => [number, number];
    parseHS2RGB!: (hs: [number, number]) => [number, number, number];
    parseCkData2Ha!: (params: {
        switch: string;
        colorR: number;
        colorB: number;
        colorG: number;
        bright: number;
        mode: number;
        speed: number;
        sensitive: number;
    }) => { mode: number; speed: number; hs_color?: [number, number]; sensitive: any; brightness?: number; status: string };
    parseHaData2Ck!: (params: {
        state: string;
        hs_color?: [number, number];
        brightness_pct?: number;
    }) => {
        switch: string;
        colorR?: number;
        colorG?: number;
        colorB?: number;
        bright?: number;
    };

    constructor(params: ICloudDeviceConstrucotr<ICloudRGBLightStripParams>) {
        super(params);
        this.entityId = `light.${params.deviceId}`;
        this.params = params.params;
        this.disabled = params.disabled!;
        this.online = params.online;
        this.brightness = this.params.bright * 2.55;
        this.mode = this.params.mode;
        this.speed = this.params.speed;
        this.sensitive = this.params.sensitive;
        this.hsColor = this.parseRGB2HS(this.params.colorR, this.params.colorG, this.params.colorB);
    }
}

CloudRGBLightStripController.prototype.parseRGB2HS = parseRGB2HS;
CloudRGBLightStripController.prototype.parseHS2RGB = parseHS2RGB;

CloudRGBLightStripController.prototype.parseHaData2Ck = function ({ hs_color, brightness_pct, state }) {
    let colorR,
        colorG,
        colorB,
        bright = this.brightness / 2.55;
    if (hs_color) {
        [colorR, colorG, colorB] = this.parseHS2RGB(hs_color);
    }
    if (brightness_pct) {
        bright = brightness_pct;
    }
    return {
        switch: state,
        colorR,
        colorG,
        colorB,
        bright,
    };
};

CloudRGBLightStripController.prototype.parseCkData2Ha = function ({ colorR, colorB, colorG, bright, mode, speed, sensitive, switch: status = 'on' }) {
    let hs_color, brightness;
    if (colorR !== undefined && colorG !== undefined && colorB !== undefined) {
        hs_color = this.parseRGB2HS(colorR, colorG, colorB);
    }
    if (bright !== undefined) {
        brightness = bright * 2.55;
    }
    return {
        mode,
        status,
        speed,
        hs_color,
        sensitive,
        brightness,
    };
};

CloudRGBLightStripController.prototype.updateLight = async function (params) {
    const res = await coolKitWs.updateThing({
        ownerApikey: this.apikey,
        deviceid: this.deviceId,
        params: {
            ...params,
            mode: 1,
            speed: this.speed,
            sensitive: this.sensitive,
        },
    });

    if (res.error === 0) {
        this.updateState({
            status: params.switch,
            mode: 1,
        });
    }
};

/**
 * @description 更新状态到HA
 */
CloudRGBLightStripController.prototype.updateState = async function ({ status, brightness, hs_color, mode, speed, sensitive }) {
    if (this.disabled) {
        return;
    }

    let state = status;
    if (!this.online) {
        state = 'unavailable';
    }

    updateStates(this.entityId, {
        entity_id: this.entityId,
        state,
        attributes: {
            restored: true,
            supported_features: 17,
            friendly_name: this.deviceName,
            state,
            brightness: brightness === undefined ? this.brightness : brightness,
            hs_color,
            mode: mode === undefined ? this.mode : mode,
            speed: speed === undefined ? this.speed : speed,
            sensitive: sensitive === undefined ? this.sensitive : sensitive,
        },
    });
    brightness !== undefined && (this.brightness = brightness);
    mode !== undefined && (this.mode = mode);
    speed !== undefined && (this.speed = speed);
    sensitive !== undefined && (this.sensitive = sensitive);
    hs_color && (this.hsColor = hs_color);
};

export default CloudRGBLightStripController;
