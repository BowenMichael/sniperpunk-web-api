//IMPORT MONGOOSE
import mongoose from "mongoose"

//Import Schema
import { PlayerSchema} from "./schema"

// CONNECTING TO MONGOOSE (Get Database Url from .env.local)
require('dotenv').config()

export const connectPlayer = async () => {
    const conn = await connect();

    // OUR USER MODEL
    const Player = mongoose.models.Player || mongoose.model("Player", PlayerSchema)

    return { conn, Player }
}

const connect = async () => {
    const conn = await mongoose
        .connect(process.env.DATABASE_URL!)
        .catch(err => console.log(err))
    console.log("Mongoose Connection Established")
    return {conn}
}