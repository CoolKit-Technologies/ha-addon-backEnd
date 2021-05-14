import express from 'express';
import { getLanguage } from '../services/language';
const router = express.Router();

router.get('/', getLanguage);

export default router;
