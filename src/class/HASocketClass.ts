import { message } from 'coolkit-open-api/dist/api';
import WebSocket from 'ws';
import TypeHaSocketMsg from '../ts/type/TypeHaSocketMsg';

class HaSocket {
    static instance: HaSocket;
    client: WebSocket;
    private count: number = 1;
    constructor() {
        this.client = new WebSocket('http://homeassistant:8123/api/websocket');
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
                        access_token:
                            'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiIxZmZkNmVlNmQ2ZWI0YjE4ODIzZDk5MTM4NTM3OGY4ZCIsImlhdCI6MTYxNTE4OTY1NCwiZXhwIjoxOTMwNTQ5NjU0fQ.f24cfdrwefx2_g1wbq1azzH9EbEA9NR2_huRkCkw8Uw',
                    })
                );
            });
            this.client.on(
                'message',
                (handler = (res: string) => {
                    try {
                        const data = JSON.parse(res);
                        if (data.type === 'auth_ok') {
                            resolve(0);
                            this.client.removeEventListener('message', handler);
                        }
                    } catch (error) {
                        console.log('Jia ~ file: HaSocketClass.ts ~ line 42 ~ HaSocket ~ returnnewPromise ~ error', error);
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
                console.log('Jia ~ file: HaSocketClass.ts ~ line 65 ~ HaSocket ~ this.client.on ~ err', err);
            }
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
}

const instance = HaSocket.createInstance();
export default instance;
