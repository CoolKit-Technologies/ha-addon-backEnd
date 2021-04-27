import express from 'express';
import { isLogin, login, logout } from '../services/user';
const router = express.Router();

router.post('/login', login);
router.post('/logout', logout);
router.post('/isLogin', isLogin);

export default router;
