import express from 'express';
import { allUsers, changeRole, deleteSong, updateSong} from '../controller/admin.controller.js';
import { userAuth } from '../middlewares/user.auth.js';


const router=express.Router();

router.post('/change-role',userAuth,changeRole)
router.post('/update-song/:id',userAuth,updateSong)
router.delete('/delete-song/:id',userAuth,deleteSong)
router.get('/all-users',userAuth,allUsers)

export default router;