import { getDataSync } from '../utils/dataUtil';
import { debugMode, isSupervisor } from './config';
let url = 'http://homeassistant:8123';
// let url = 'http://192.168.1.111:8123';


if (!debugMode && isSupervisor) {
    url = getDataSync('options.json', ['home_assistant_url']);
}

if (!debugMode && !isSupervisor) {
    url = process.env.HA_URL!;
}

if (!url) {
    throw new Error('You have to set the HA_URL');
}

// let HaSocketURL = `http://192.168.1.133:8123/api/websocket`;
// let HaRestURL = `http://192.168.1.133:8123`;

url = url.replace(/\/$/, '');
let HaSocketURL = `${url}/api/websocket`;
let HaRestURL = url;

export { HaSocketURL, HaRestURL };
