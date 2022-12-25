import mongoose from "mongoose"

export const PlayerSchema = new mongoose.Schema({
    name: String,
    email: String,
    steamId : String,
    created : Number
})


