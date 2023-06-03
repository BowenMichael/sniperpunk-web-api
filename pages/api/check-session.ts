import { getServerSession } from "next-auth/next"
import { authOptions } from "../../app/api/auth/[...nextauth]/route"
import type {NextApiRequest, NextApiResponse} from "next";
import {getSession} from "next-auth/react";

export default async (req : NextApiRequest , res : NextApiResponse ) => {
    const session = await getServerSession()
    console.log({session})
    if (session) {
        // Signed in
        console.log("Session", JSON.stringify(session, null, 2))
    } else {
        // Not Signed in
        res.status(401)
    }
    res.end()
}