import { getDataSync } from '../utils/dataUtil';
import { debugMode, isSupervisor } from './config';
let auth: string | undefined;
if (debugMode) {
    auth =
        // Pi
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiI4YzEzZjkxNWZlZjE0Y2I2YmUzOWFlNGU1ZDdkNmM0OCIsImlhdCI6MTYxNzAxMzM1MywiZXhwIjoxOTMyMzczMzUzfQ.LIt9lJFjPz3klYqExdMGcMkFEqMXzJufAwjPwY3WjSU';
        // Docker
        // 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiI1ZmQ2MTcwZTQ5YmU0OWVlYjQ0YzMzMTQ0MzY2ODQ1MSIsImlhdCI6MTYyMDQ1ODE1NCwiZXhwIjoxOTM1ODE4MTU0fQ.U_L861eypPB4wlQM5tlavfjjTI_Dl9WF_jOydeqZwiw';
} else {
    if (isSupervisor) {
        auth = getDataSync('options.json', ['auth']);
    } else {
        auth = process.env.AUTH;
    }
}

if (!auth) {
    throw new Error('you have to input the "Auth"');
}

export { auth as HaToken };