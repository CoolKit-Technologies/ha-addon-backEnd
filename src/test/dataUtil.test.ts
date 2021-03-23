import { getDataSync, saveData, appendData, clearData } from '../utils/dataUtil';

(async () => {
    // const data = await saveData('test.json', JSON.stringify({ test: 1 }));
    // console.log(data);
    // const res = getDataSync('test.json', ['test']);
    // console.log(res);
    // appendData('test.json', ['abc'], 2322312333);
    clearData('test.json');
})();
