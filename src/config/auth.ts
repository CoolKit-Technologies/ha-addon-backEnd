import { getDataSync } from '../utils/dataUtil';
import { debugMode, isSupervisor } from './config';
let auth: string | undefined;
if (debugMode) {
    auth =
        // Pi
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiI4YzEzZjkxNWZlZjE0Y2I2YmUzOWFlNGU1ZDdkNmM0OCIsImlhdCI6MTYxNzAxMzM1MywiZXhwIjoxOTMyMzczMzUzfQ.LIt9lJFjPz3klYqExdMGcMkFEqMXzJufAwjPwY3WjSU';
        // Docker
        // 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJmNzg3MmU3YWQyMDc0NTYwOTNiNWRmZThkYTQzMjBiMyIsImlhdCI6MTYxODgwMzc5MiwiZXhwIjoxOTM0MTYzNzkyfQ.DWxtVwZSmkGAduClF41VqNu1XIyK8gdGRXRXQqfdjHw';
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