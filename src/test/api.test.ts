import { getStates } from '../apis/restApi';

(async () => {
    const res = await getStates();
    console.log(res.data);
})();
