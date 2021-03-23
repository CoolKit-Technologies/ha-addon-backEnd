import express from 'express';
import { getDevices, disableDevice } from '../services/devices';
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

export default router;
