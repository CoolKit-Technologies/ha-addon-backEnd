import WebSocket from 'ws';
import { HaToken } from '../config/auth';
import { HaSocketURL } from '../config/url';
import TypeHaSocketMsg from '../ts/type/TypeHaSocketMsg';

class HaSocket {
    static instance: HaSocket;
    client: WebSocket;
    private count: number = 1;
    constructor() {
        this.client = new WebSocket(HaSocketURL);
    }

    static createInstance() {
        if (!HaSocket.instance) {
            HaSocket.instance = new HaSocket();
        }
        return HaSocket.instance;
    }

    async init(): Promise<-1 | 0> {
        let handler: any;
        return new Promise((resolve, reject) => {
            this.client.on('open', () => {
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
        const cur = this.count++;
        let handler: any;

        return new Promise((resolve) => {
            this.client.send(
                JSON.stringify({
                    id: cur,
                    ...data,
                })
            );
            this.client.on(
                'message',
                (handler = (res: string) => {
                    try {
                        const data = JSON.parse(res);
                        if (data.id === cur) {
                            resolve(data.result);
                            this.client.removeEventListener('message', handler);
                        }
                    } catch (error) {
                        console.log('Jia ~ file: HASocketClass.ts ~ line 92 ~ HaSocket ~ query ~ error', error);
                        resolve(-1);
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
