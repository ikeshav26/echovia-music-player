import mongoose from "mongoose";

const albumSchema=new mongoose.Schema({
    thumbnailUrl:{
        type:"String",
        required:true
    },
    name:{
        type:"String",
        required:true
    },
    artist:{
        type:"String",
        required:true
    },
    songs:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Song'
        }]
},{timestamps:true})


const Album=mongoose.model('Album',albumSchema)
export default Album