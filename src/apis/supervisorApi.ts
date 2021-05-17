import axios from 'axios';
const { SUPERVISOR_TOKEN } = process.env;
console.log('Jia ~ file: supervisor.ts ~ line 3 ~ SUPERVISOR_TOKEN', SUPERVISOR_TOKEN);
const supervisorRequest = axios.create({
    baseURL: 'http://supervisor',
    headers: {
        'Content-Type': 'application/json',
        'X-Supervisor-Token': `Bearer ${SUPERVISOR_TOKEN}`,
    },
});

const getAuth = async () => {
    return supervisorRequest({
        method: 'GET',
        url: '/auth',
    }).catch((e) => {
        console.log(e);
        return null;
    });
};

export { getAuth };
