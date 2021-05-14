type TypeLanDevice = {
    ptr: string;
    txt: {
        txtvers: number;
        id: string;
        type: string;
        apivers: number;
        seq: number;
        encrypt: true;
        iv: string;
        data1?: string;
        data2?: string;
        data3?: string;
        data4?: string;
    };
    srv: {
        priority: number;
        weight: number;
        port: number;
        target: string;
    };
    a: string;
};
export default TypeLanDevice;
