import TypeDiyDevice from '../ts/type/TypeMdnsDiyDevice';

export default (device: TypeDiyDevice) => {
    const { txt, a, srv } = device;
    return {
        id: txt.id,
        type: txt.type,
        data: txt.data1,
        ip: a,
        port: srv?.port || 8081,
    };
};
