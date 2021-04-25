import { Request, Response } from 'express';
import _ from 'lodash';
import HASocket from '../class/HASocketClass';
import Controller from '../controller/Controller';
import eventBus from '../utils/eventBus';
import formatDevice from '../utils/formatDevice';

const sse = async (req: Request, res: Response) => {
    res.header({
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'Access-Control-Allow-Origin': '*',
    });

    res.write('retry: 10000\n');

    eventBus.on('ckMsg', () => {
        console.log('Jia ~ file: sse.ts ~ line 19 ~ eventBus.on ~ ckMsg');
        const result: any[] = [];
        for (let item of Controller.deviceMap.values()) {
            result.push(formatDevice(item));
        }
        res.write('data: ' + JSON.stringify(result) + '\n\n');
    });

    // let count = 1;
    // setInterval(() => {
    //     res.write('id: ' + count + '\n');
    //     res.write('data: ' + JSON.stringify({ a: 1, b: 2, count: count++ }) + '\n\n');
    //     console.log('发送消息');
    // }, 3000);
};

export default sse;
