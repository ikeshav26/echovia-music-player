import express from 'express';  
import { addSongToPlaylist, createPlaylist, deletePlaylist, deleteSong, fetchGenreSongs, fetchSongsInPlaylist, fetchUsersPlaylists } from '../controller/playlist.controller.js';
import {userAuth} from '../middlewares/user.auth.js'
import { addSong } from '../controller/song.controller.js';


const router=express.Router();



router.post('/create',userAuth,createPlaylist)
router.post('/add-song',userAuth,addSongToPlaylist)
router.get('/fetch',userAuth,fetchUsersPlaylists)
router.get('/:playlistId/songs',userAuth,fetchSongsInPlaylist)
router.delete('/delete/:playlistId',userAuth,deletePlaylist)
router.delete('/remove-song/:playlistId/:songId',userAuth,deleteSong)
router.get('/genre/:id',userAuth,fetchGenreSongs)


export default router;