//IMPORT MONGOOSE
import mongoose from "mongoose"

//Import Schema
import {LogSchema, PlayerMatchSchema, PlayerSchema, PostSchema} from "./schema"

// CONNECTING TO MONGOOSE (Get Database Url from .env.local)
require('dotenv').config()

export const connectPlayer = async () => {
    const conn = await connect();

    // OUR USER MODEL
    const Player = mongoose.models.Player || mongoose.model("Player", PlayerSchema)

    return { conn, Player }
}

export const connectPosts = async () => {
    const conn = await connect();

    // OUR USER MODEL
    const Posts = mongoose.models.Posts || mongoose.model("Posts", PostSchema)

    return { conn, Posts }
}

export const connectLog = async () => {
    const conn = await connect();

    // OUR USER MODEL
    const Logs = mongoose.models.Logs || mongoose.model("Logs", LogSchema)

    return { conn, Logs }
}

export const connectMatchData = async () => {
    const conn = await connect();

    // OUR USER MODEL
    const MatchData = mongoose.models.MatchData || mongoose.model("MatchData", PlayerMatchSchema)

    return { conn, MatchData }
}

const connect = async () => {
    const conn = await mongoose
        .connect(process.env.DATABASE_URL!)
        .catch(err => console.log(err))
    console.log("Mongoose Connection Established")
    return {conn}
}