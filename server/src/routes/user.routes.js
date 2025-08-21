import express from 'express';
import { login, logout, me, signup } from '../controller/user.controller.js';
import { userAuth } from '../middlewares/user.auth.js';


const router=express.Router();


router.post('/signup',signup)
router.post('/login',login)
router.get('/logout',logout)
router.get('/me',userAuth,me)



export default router;