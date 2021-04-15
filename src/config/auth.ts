import { getDataSync } from '../utils/dataUtil';
import { debugMode } from './config';
let auth: string;
if (debugMode) {
    auth =
        // Pi
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiI4YzEzZjkxNWZlZjE0Y2I2YmUzOWFlNGU1ZDdkNmM0OCIsImlhdCI6MTYxNzAxMzM1MywiZXhwIjoxOTMyMzczMzUzfQ.LIt9lJFjPz3klYqExdMGcMkFEqMXzJufAwjPwY3WjSU';
} else {
    auth = getDataSync('options.json', ['auth']);
}

if (!auth) {
    throw new Error('you have to input the "Auth"');
}

export { auth as HaToken };
