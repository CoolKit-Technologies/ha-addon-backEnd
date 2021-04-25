import express from 'express';
import sse from '../services/sse';
const router = express.Router();

router.get('/', sse);

export default router;
