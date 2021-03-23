// @ts-ignore
import multicastDns from 'multicast-dns';
import _ from 'lodash';
import TypeDevice from '../ts/type/TypeMdnsDevice';
import TypeDiyDevice from '../ts/type/TypeMdnsDiyDevice';
import TypeLanDevice from '../ts/type/TypeMdnsLanDevice';
import Controller from '../controller/Controller';
import DiyDeviceController from '../controller/DiyDeviceController';
type TypeQueryParams = {
    questions: {
        name: string;
        type: 'A' | 'SRV' | 'PTR';
    }[];
};

type TypeConstructorParams = { onResponseCb?: Function; queryParams: TypeQueryParams; queryCb?: Function };

export default class Mdns {
    static instance: Mdns;
    mdns: any;
    constructor(params: TypeConstructorParams) {
        const { onResponseCb, queryParams, queryCb } = params;
        this.mdns = new multicastDns();
        this.onResponse(onResponseCb);
        this.query(queryParams, queryCb);
    }

    static createInstance(params: TypeConstructorParams) {
        if (!Mdns.instance) {
            Mdns.instance = new Mdns(params);
        }
        return Mdns.instance;
    }

    /**
     *
     *
     * @param {*} params
     * @param {Function} [callback] 发起查询后的回调
     * @memberof Mdns
     */
    query(params: any, callback?: Function) {
        if (!this.mdns) {
            this.mdns = new multicastDns();
        }
        this.mdns.query(params, callback);
    }

    /**
     *
     *
     * @param {Function} [callback] 查询到eWelink设备后的回调
     * @memberof Mdns
     */
    onResponse(callback?: Function) {
        this.mdns.on('response', (packet: any) => {
            const { answers } = packet;
            if (Array.isArray(answers)) {
                const tmp = {} as TypeDevice;
                let key = '';
                for (let i = 0; i < answers.length; i++) {
                    let data = answers[i].data;
                    switch (answers[i].type) {
                        case 'PTR':
                            if (`${data}`.indexOf('ewelink') === -1) {
                                return;
                            }
                            tmp.ptr = data;
                            break;
                        case 'A':
                            tmp.a = data;
                            break;
                        case 'SRV':
                            tmp.srv = data;
                            break;
                        case 'TXT':
                            const arr = data.toString().split(/(?<!\{.*),(?!\}.*)/);
                            const txtData: any = {};
                            arr.map((str: string) => {
                                const [key, value] = str.split('=');
                                try {
                                    txtData[key] = JSON.parse(value);
                                } catch {
                                    txtData[key] = value;
                                }
                            });
                            tmp.txt = txtData;
                            key = txtData.id;
                            break;
                        default:
                            break;
                    }
                }
                if (key && tmp.txt?.type === 'diy_plug') {
                    console.log('Jia ~ file: MdnsClass.ts ~ line 95 ~ Mdns ~ this.mdns.on ~ tmp.txt', tmp.txt);
                    const diyDevice = Controller.setDevice({
                        id: key,
                        data: tmp as TypeDiyDevice,
                        type: 1,
                    });
                    callback && callback('diy', diyDevice);
                } else {
                    if (Controller.getDevice(key)?.type !== 4) {
                        Controller.setDevice({
                            id: key,
                            data: tmp as TypeLanDevice,
                            type: 2,
                        });
                        callback && callback('lan', tmp);
                    }
                }
            }
        });
    }

    destroy() {
        this.mdns.destroy();
        this.mdns = null;
    }
}
