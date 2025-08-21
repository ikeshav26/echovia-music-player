import mongoose from 'mongoose';


const playlistSChema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    songs:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Song'
    }]
}, { timestamps: true })



const Playlist=mongoose.model('Playlist', playlistSChema);
export default Playlist;