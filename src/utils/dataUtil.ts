import fs from 'fs';
import path from 'path';
import _ from 'lodash';
const getDataSync = (fileName: string, namePath: string[] = []) => {
    try {
        const data = fs.readFileSync(path.join('./src/data', `/${fileName}`), { encoding: 'utf-8' });
        return namePath.reduce((cur, path: string) => cur[path], JSON.parse(data));
    } catch (err) {
        console.log('no data');
        return null;
    }
};

const saveData = async (fileName: string, data: string): Promise<-1 | 0> => {
    try {
        return new Promise((resolve, reject) => {
            fs.writeFile(path.join('./src/data', `/${fileName}`), data, (err) => {
                if (err) {
                    console.log('Jia ~ file: dataUtil.ts ~ line 23 ~ fs.writeFile ~ err', err);
                    resolve(-1);
                }
                resolve(0);
            });
        });
    } catch (err) {
        console.log('no data');
        return -1;
    }
};

const appendData = async (fileName: string, namePath: string[], data: string | number | boolean) => {
    const fileData = getDataSync(fileName) || {};
    _.set(fileData, namePath, data);
    return saveData(fileName, JSON.stringify(fileData));
};

const clearData = async (fileName: string) => {
    return saveData(fileName, '{}');
};

export { getDataSync, saveData, appendData, clearData };
