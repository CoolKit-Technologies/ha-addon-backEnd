import express from 'express';
import * as path from 'path';
import CkApi from 'coolkit-open-api';
import { Request, Response } from 'express';
import cors from 'cors';
import userRouter from './route/user';
import devicesRouter from './route/devices';
import initMdns from './utils/initMdns';
import initCkWs from './utils/initCkWs';
import initHaSocket from './utils/initHaSocket';
import initCkApi from './utils/initCkApi';
import { appId, appSecret } from './config/app';
import sleep from './utils/sleep';

CkApi.init({
    appId,
    appSecret,
});

(async () => {
    initMdns();
    initHaSocket();
    initCkWs();
    await sleep(3000);
    initCkApi();
})();

const app = express();
const port = 3000;
const apiPrefix = '/api';
const debugMode = false;
if (debugMode) {
    app.use(cors());
    app.use('/', express.static('src/pages'));
} else {
    app.use('/', express.static('pages'));
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(`${apiPrefix}/user`, userRouter);
app.use(`${apiPrefix}/devices`, devicesRouter);

app.use('/', (req: Request, res: Response) => {
    res.type('.html');
    res.sendFile(path.join(__dirname, '/pages/index.html'));
});

app.use((req: Request, res: Response) => {
    res.status(404).send("Sorry can't find that!");
});

app.listen(port, () => {
    console.log(`server is running at ${port}`);
});
