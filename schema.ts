import mongoose, {Schema} from "mongoose"


export const PlayerSchema = new mongoose.Schema({
    name: String,
    email: String,
    steamId : String,
    created : Number
})

export const PostSchema = new mongoose.Schema({
    name:String,
    href:String,
    postImage: {},
})


export const LogSchema = new mongoose.Schema({
    _id : Number,
    date : Number,
    tag : String,
    data : {}
})


