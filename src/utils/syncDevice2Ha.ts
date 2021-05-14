import getThings from './getThings';
import initMdns from '../utils/initMdns';
import generateLovelace from './generateLovelace';
import sleep from './sleep';

const mdns = initMdns();

type TypeParams = {
    syncLovelace: boolean;
    sleepTime?: number;
};

export default async ({ syncLovelace, sleepTime }: TypeParams) => {
    mdns.query({
        questions: [
            {
                name: '_ewelink._tcp.local',
                type: 'PTR',
            },
        ],
    });
    await getThings();
    if (sleepTime !== undefined) {
        await sleep(sleepTime);
    }
    if (syncLovelace) {
        generateLovelace();
    }
};
