import express from 'express';
import { auth, isLogin, login, logout, isAuth } from '../services/user';
const router = express.Router();

router.post('/login', login);
router.post('/logout', logout);
router.post('/isLogin', isLogin);
router.post('/auth', auth);

router.get('/isAuth', isAuth);

export default router;
