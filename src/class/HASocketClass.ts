import WebSocket from 'ws';
import { HaToken } from '../config/auth';
import { HaSocketURL } from '../config/url';
import TypeHaSocketMsg from '../ts/type/TypeHaSocketMsg';
import getThings from '../utils/getThings';
import AuthClass from './AuthClass';
import initHaSocket from '../utils/initHaSocket';
import syncDevice2Ha from '../utils/syncDevice2Ha';

class HaSocket {
    static instance: HaSocket;
    client!: WebSocket;
    private count: number = 1;
    constructor() {
        this.connect();
        this.heartBeat();
    }

    connect() {
        try {
            this.client = new WebSocket(HaSocketURL);
            this.client.on('error', () => {
                console.log('请检查HA是否正确运行');
            });
        } catch (error) {
            console.log('初始化HA-WS连接出错', error);
        }
    }

    static createInstance() {
        if (!HaSocket.instance) {
            HaSocket.instance = new HaSocket();
        }
        return HaSocket.instance;
    }

    async init(reconnect = false): Promise<-1 | 0> {
        let handler: any;
        if (reconnect) {
            this.connect();
        }

        return new Promise((resolve, reject) => {
            this.client.on('open', () => {
                if (this.client.readyState !== 1) {
                    resolve(-1);
                }
                this.client.send(
                    JSON.stringify({
                        type: 'auth',
                        access_token: HaToken,
                    })
                );
            });
            this.client.on(
                'message',
                (handler = (res: string) => {
                    try {
                        const data = JSON.parse(res);
                        console.log('Jia ~ file: HASocketClass.ts ~ line 37 ~ HaSocket ~ init ~ data', data);
                        if (data.type === 'auth_ok') {
                            resolve(0);

                            // 由于ha重启会丢失实体,所以需要重新同步一次实体
                            if (reconnect) {
                                syncDevice2Ha({
                                    syncLovelace: true,
                                    sleepTime: 2000,
                                });
                            }

                            this.client.removeEventListener('message', handler);
                        }
                    } catch (error) {
                        console.log('Jia ~ file: HaSocketClass.ts ~ line 42 ~ HaSocket ~ init ~ error', error);
                        resolve(-1);
                    }
                })
            );
        });
    }

    heartBeat() {
        setTimeout(async () => {
            const res = await this.query({
                type: 'ping',
            });
            console.log('HA-WS heartBeat:', res);
            if (res === -1) {
                // 重新建立连接，并绑定call_service事件
                initHaSocket(true);
            }
            this.heartBeat();
        }, 15000);
    }

    subscribeEvents(eventType: string) {
        this.client.send(
            JSON.stringify({
                id: this.count++,
                type: 'subscribe_events',
                event_type: eventType,
            })
        );
    }

    handleEvent(eventType: string, handler: (data: any) => void) {
        this.client.on('message', (res: string) => {
            try {
                const data = JSON.parse(res) as TypeHaSocketMsg;
                if (data.type === 'event' && data.event.event_type === eventType) {
                    handler(data.event.data);
                }
            } catch (err) {
                console.log('Jia ~ file: HaSocketClass.ts ~ line 65 ~ HaSocket ~ handleEvent ~ err', err);
            }
        });
    }

    async query(data: Object): Promise<any> {
        if (this.client.readyState !== 1) {
            console.log('与HA-WS连接未建立，建议重启Addon');
            return -1;
        }
        const cur = this.count++;
        let handler: any;

        return new Promise((resolve) => {
            this.client.send(
                JSON.stringify({
                    id: cur,
                    ...data,
                })
            );

            // 设置超时
            setTimeout(() => {
                resolve(-1);
            }, 5000);

            this.client.on(
                'message',
                (handler = (res: string) => {
                    try {
                        const data = JSON.parse(res);
                        if (data.id === cur) {
                            // 心跳信息
                            if (!data.result && data.type) {
                                resolve(data.type);
                            }
                            resolve(data.result);
                            this.client.removeEventListener('message', handler);
                        }
                    } catch (error) {
                        console.log('Jia ~ file: HASocketClass.ts ~ line 92 ~ HaSocket ~ query ~ error', error);
                        resolve(-1);
                        this.client.removeEventListener('message', handler);
                    }
                })
            );
        });
    }

    getStates() {
        this.client.send(
            JSON.stringify({
                id: this.count++,
                type: 'get_states',
            })
        );
    }

    getConfig() {
        this.client.send(
            JSON.stringify({
                id: this.count++,
                type: 'get_config',
            })
        );
    }

    async getLovelace() {
        const res = await this.query({
            type: 'lovelace/config',
        });
        console.log('Jia ~ file: HASocketClass.ts ~ line 125 ~ HaSocket ~ getLovelace ~ res', res);
        return res;
    }
}

const instance = HaSocket.createInstance();
export default instance;
