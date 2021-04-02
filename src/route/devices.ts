import express from 'express';
import { getDevices, disableDevice, updateDeviceName } from '../services/devices';
const router = express.Router();

router.get('/', getDevices);
router.get(
    '/refresh',
    (req, res, next) => {
        req.body.refresh = true;
        next();
    },
    getDevices
);

router.post('/disabled', disableDevice);
router.post('/updateName', updateDeviceName);

export default router;
