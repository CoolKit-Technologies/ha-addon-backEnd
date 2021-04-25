import express from 'express';
import * as path from 'path';
import CkApi from 'coolkit-open-api';
import { Request, Response } from 'express';
import cors from 'cors';
import userRouter from './route/user';
import devicesRouter from './route/devices';
import languageRouter from './route/language';
import streamRouter from './route/stream';
import initMdns from './utils/initMdns';
import initCkWs from './utils/initCkWs';
import initHaSocket from './utils/initHaSocket';
import initCkApi from './utils/initCkApi';
import { appId, appSecret } from './config/app';
import { debugMode } from './config/config';
import sleep from './utils/sleep';

import serviceRegistered from './utils/serviceRegistered';
import generateLovelace from './utils/generateLovelace';

CkApi.init({
    appId,
    appSecret,
});

(async () => {
    initMdns(); // 扫描局域网设备
    initHaSocket(); // 跟HA建立socket连接
    await initCkApi(); // 初始化v2接口并保持登录
    // serviceRegistered(); // 注册HA相关服务
    // await sleep(3000);
    await initCkWs(); // 跟易微联Socket建立连接
})();

const app = express();
const port = 3000;
const apiPrefix = '/api';
app.use('/', express.static(path.join(__dirname, '/pages')));

if (debugMode) {
    app.use(cors());
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(`${apiPrefix}/user`, userRouter);
app.use(`${apiPrefix}/devices`, devicesRouter);
app.use(`${apiPrefix}/language`, languageRouter);
app.use(`${apiPrefix}/stream`, streamRouter);

app.use('/', (req: Request, res: Response) => {
    res.type('.html');
    res.sendFile(path.join(__dirname, '/pages/index.html'));
});

app.listen(port, () => {
    console.log(`server is running at ${port}`);
});
