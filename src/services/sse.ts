import { Request, Response } from 'express';
import _ from 'lodash';
import HASocket from '../class/HASocketClass';
import Controller from '../controller/Controller';
import eventBus from '../utils/eventBus';
import { getFormattedDeviceList } from '../utils/formatDevice';

const sse = async (req: Request, res: Response) => {
    res.header({
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'Access-Control-Allow-Origin': '*',
    });

    res.write('retry: 10000\n');

    const handler = () => {
        const result = getFormattedDeviceList();
        res.write('data: ' + JSON.stringify(result) + '\n\n');
    };

    eventBus.addListener('sse', handler);

    res.on('close', () => {
        eventBus.removeListener('sse', handler);
        res.end();
        console.log('clooooooooooooooooooooooooooooooooooooose');
    });
};

export default sse;
