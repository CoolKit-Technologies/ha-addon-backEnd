import CloudDeviceController from './CloudDeviceController';
import { ICloudRGBLightParams } from '../ts/interface/ICloudDeviceParams';
import ICloudDeviceConstrucotr from '../ts/interface/ICloudDeviceConstrucotr';
import { updateStates } from '../apis/restApi';
import coolKitWs from 'coolkit-ws';
import { parseHS2RGB, parseRGB2HS } from '../utils/colorUitl';
import _ from 'lodash';
class CloudRGBLightController extends CloudDeviceController {
    online: boolean;
    disabled: boolean;
    entityId: string;
    uiid: number = 22;
    params: ICloudRGBLightParams;
    colorTemp: number;
    brightness: number;
    hsColor: [number, number];
    updateLight!: (params: {
        state: string;
        type?: string;
        zyx_mode?: number;
        channel0?: string;
        channel1?: string;
        channel2?: string;
        channel3?: string;
        channel4?: string;
    }) => Promise<void>;
    updateState!: (params: { status: string; brightness?: number; colorTemp?: number; hsColor?: [number, number] }) => Promise<void>;
    parseRGB2HS!: (red: number, green: number, blue: number) => [number, number];
    parseHS2RGB!: (hs: [number, number]) => [number, number, number];
    parseHaData2Ck!: ({
        hs_color,
        color_temp,
        brightness_pct,
        state,
    }: {
        state: string;
        hs_color?: [number, number];
        color_temp?: number;
        brightness_pct?: number;
    }) => { channel0?: string; channel1?: string; channel2?: string; channel3?: string; channel4?: string; type?: string; state: string };
    parseCkData2Ha!: (params: ICloudRGBLightParams) => { status: string; colorTemp?: number; hsColor?: [number, number]; brightness?: number };

    constructor(params: ICloudDeviceConstrucotr<ICloudRGBLightParams>) {
        super(params);
        const { channel0, channel1, channel2, channel3, channel4, zyx_mode, type } = params.params;
        this.entityId = `light.${params.deviceId}`;
        this.params = params.params;
        this.disabled = params.disabled!;
        this.online = params.online;
        switch (type) {
            case 'cold':
                this.colorTemp = 1;
                break;
            case 'middle':
                this.colorTemp = 2;
                break;
            case 'warm':
                this.colorTemp = 3;
                break;
            default:
                this.colorTemp = 2;
                break;
        }
        this.brightness = Math.max(+channel0, +channel1);
        if (zyx_mode === 2) {
            this.hsColor = [0, 0];
        } else {
            this.hsColor = this.parseRGB2HS(+channel2, +channel3, +channel4);
        }
    }
}

CloudRGBLightController.prototype.parseRGB2HS = parseRGB2HS;
CloudRGBLightController.prototype.parseHS2RGB = parseHS2RGB;

CloudRGBLightController.prototype.parseHaData2Ck = function ({
    hs_color,
    color_temp,
    brightness_pct = 0,
    state,
}: {
    state: string;
    hs_color?: [number, number];
    color_temp?: number;
    brightness_pct?: number;
}) {
    const brightness = brightness_pct * 2.55;
    let channel0 = 0,
        channel1 = 0,
        channel2 = 0,
        channel3 = 0,
        channel4 = 0,
        type;
    if (hs_color) {
        [channel2, channel3, channel4] = this.parseHS2RGB(hs_color);
    }
    if (color_temp) {
        if (color_temp === 1) {
            type = 'cold';
            channel0 = this.brightness || 128;
        } else if (color_temp === 3) {
            type = 'warm';
            channel1 = this.brightness || 128;
        } else {
            type = 'middle';
            channel0 = this.brightness || 128;
            channel1 = this.brightness || 128;
        }
    }
    if (brightness) {
        channel0 = brightness;
        channel1 = brightness;
    }
    if (state === 'on' && !hs_color && !color_temp && !brightness) {
        channel0 = this.brightness;
        channel1 = this.brightness;
        [channel2, channel3, channel4] = this.parseHS2RGB(this.hsColor);
    }
    return {
        type,
        state,
        channel0: `${channel0}`,
        channel1: `${channel1}`,
        channel2: `${channel2}`,
        channel3: `${channel3}`,
        channel4: `${channel4}`,
    };
};
CloudRGBLightController.prototype.parseCkData2Ha = function (params: ICloudRGBLightParams) {
    let hs, temp, brightness;
    const { channel0, channel1, channel2, channel3, channel4, type, state } = params;
    if (channel2 && channel3 && channel4) {
        hs = this.parseRGB2HS(+channel2, +channel3, +channel4);
        brightness = 128;
    }
    if (channel0 || channel1) {
        brightness = Math.max(+channel1, +channel0);
    }
    switch (type) {
        case 'cold':
            temp = 1;
            break;
        case 'middle':
            temp = 2;
            break;
        case 'warm':
            temp = 3;
            break;
    }
    return {
        status: state || 'on',
        colorTemp: temp,
        hsColor: hs,
        brightness,
    };
};

CloudRGBLightController.prototype.updateLight = async function (params) {
    if (this.disabled) {
        return;
    }
    const res = await coolKitWs.updateThing({
        ownerApikey: this.apikey,
        deviceid: this.deviceId,
        params,
    });
    const { channel0, channel1, channel2, channel3, channel4, type } = params;
    if (channel0 && channel1) {
        this.brightness = Math.max(+channel0, +channel1);
    }
    if (channel2 && channel3 && channel4) {
        this.hsColor = this.parseRGB2HS(+channel2, +channel3, +channel4);
    }
    switch (type) {
        case 'cold':
            this.colorTemp = 1;
            break;
        case 'middle':
            this.colorTemp = 2;
            break;
        case 'warm':
            this.colorTemp = 3;
            break;
        default:
            this.colorTemp = 2;
            break;
    }
    if (res.error === 0) {
        this.updateState({
            status: params.state!,
        });
    }
};

/**
 * @description 更新状态到HA
 */
CloudRGBLightController.prototype.updateState = async function ({ status, brightness, colorTemp, hsColor }) {
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
            supported_features: 19,
            friendly_name: this.deviceName,
            state,
            min_mireds: 1,
            max_mireds: 3,
            brightness: brightness !== undefined ? brightness : this.brightness,
            color_temp: colorTemp !== undefined ? colorTemp : this.colorTemp,
            hs_color: hsColor || this.hsColor,
        },
    });
    if (status === 'on') {
        brightness !== undefined && (this.brightness = brightness);
        colorTemp !== undefined && (this.colorTemp = colorTemp);
        hsColor && (this.hsColor = hsColor);
    }
};

export default CloudRGBLightController;
