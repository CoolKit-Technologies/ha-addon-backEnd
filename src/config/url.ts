import { getDataSync } from '../utils/dataUtil';
import { debugMode } from './config';
let port = 8123;
if (!debugMode) {
    port = getDataSync('options.json', ['home_assistant_port']);
}
// const HaSocketURL = `http://172.16.9.22:${port}/api/websocket`;
// const HaRestURL = `http://172.16.9.22:${port}`;

const HaSocketURL = `http://homeassistant:${port}/api/websocket`;
const HaRestURL = `http://homeassistant:${port}`;
export { HaSocketURL, HaRestURL };
