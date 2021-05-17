// import { getDataSync, saveData, appendData, clearData } from '../utils/dataUtil';
import fs from 'fs';
import path from 'path';
// (async () => {
//     // const data = await saveData('test.json', JSON.stringify({ test: 1 }));
//     // console.log(data);
//     // const res = getDataSync('test.json', ['test']);
//     // console.log(res);
//     // appendData('test.json', ['abc'], 2322312333);
//     clearData('test.json');
// })();
const basePath = path.join(__dirname, '../data');

if (!fs.existsSync(basePath)) {
    fs.mkdirSync(basePath);
}