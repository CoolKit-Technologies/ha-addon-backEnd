import axios from 'axios';

type TypeParams = {
    ip: string;
    port: number;
    state: string;
    deviceid: string;
};

const updateDiySwitchAPI = async (params: TypeParams) => {
    const { ip, port, state, deviceid } = params;
    console.log('Jia ~ file: diyDeviceApi.ts ~ line 11 ~ updateDiySwitchAPI ~ params', params);
    const { data } = await axios.post(`http://${ip}:${port}/zeroconf/switch`, {
        deviceid,
        data: {
            switch: state,
        },
    });
    return data;
};

const updateDiyStartupAPI = async (params: TypeParams) => {
    const { ip, port, state, deviceid } = params;
    console.log('Jia ~ file: diyDeviceApi.ts ~ line 20 ~ updateDiyStartupAPI ~ params', params);
    const { data } = await axios.post(`http://${ip}:${port}/zeroconf/startup`, {
        deviceid,
        data: {
            startup: state,
        },
    });
    return data;
};

const updateDiyPulseAPI = async (params: TypeParams & { width: number }) => {
    const { ip, port, state, deviceid, width } = params;
    console.log('Jia ~ file: diyDeviceApi.ts ~ line 29 ~ updateDiyPulseAPI ~ params', params);
    const { data } = await axios.post(`http://${ip}:${port}/zeroconf/pulse`, {
        deviceid,
        data: {
            pulse: state,
            pulseWidth: width,
        },
    });
    return data;
};
const updateDiySledOnlineAPI = async (params: TypeParams) => {
    const { ip, port, state, deviceid } = params;
    const { data } = await axios.post(`http://${ip}:${port}/zeroconf/sledonline`, {
        deviceid,
        data: {
            sledOnline: state,
        },
    });
    return data;
};

export { updateDiyPulseAPI, updateDiySwitchAPI, updateDiyStartupAPI, updateDiySledOnlineAPI };
