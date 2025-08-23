import express from 'express';
import { addSongToAlbum, createAlbum, deleteAlbum, deleteSongFromAlbum, fetchAllAlbums, fetchSongsInAlbum } from '../controller/album.controller.js';
import {userAuth} from '../middlewares/user.auth.js'


const router=express.Router();



router.post('/create-album',userAuth,createAlbum)
router.post('/add-song-to-album',userAuth,addSongToAlbum)
router.delete('/:albumId/delete/:songid',userAuth,deleteSongFromAlbum)
router.delete('/delete/:albumId',userAuth,deleteAlbum)
router.get('/all-albums',userAuth,fetchAllAlbums)
router.get('/:albumId/songs',userAuth,fetchSongsInAlbum)

export default router