import express from 'express';
import { auth, isLogin, login, logout } from '../services/user';
const router = express.Router();

router.post('/login', login);
router.post('/logout', logout);
router.post('/isLogin', isLogin);
router.post('/auth', auth);

export default router;
