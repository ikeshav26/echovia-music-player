import express from 'express';  
import { addSong, fetchSongbyId, getAllSongs } from '../controller/song.controller.js';
import {userAuth} from '../middlewares/user.auth.js'


const router=express.Router();


router.post('/add',userAuth,addSong)
router.get('/all-songs',userAuth,getAllSongs)
router.get('/:id',userAuth,fetchSongbyId)

export default router;