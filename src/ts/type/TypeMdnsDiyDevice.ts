type TypeDiyDevice = {
    ptr: string;
    txt: {
        txtvers: number;
        id: string;
        type: string;
        apivers: number;
        seq: number;
        data1?: {
            switch: string;
            startup: string;
            pulse: string;
            sledOnline: string;
            fwVersion: string;
            pulseWidth: number;
            rssi: number;
        };
    };
    srv: {
        priority: number;
        weight: number;
        port: number;
        target: string;
    };
    a: string;
};
export default TypeDiyDevice;
