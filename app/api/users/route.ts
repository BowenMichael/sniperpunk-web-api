import { NextResponse } from "next/server";
import {connectMatchData, connectUsers} from "../../../connections";
import {NextApiRequest, NextApiResponse} from "next";
import { getServerSession } from "next-auth/next"
//import { authOptions } from "/app/api/auth/[...nextauth]/route";


export async function GET(request: NextApiRequest, res: NextApiResponse){
    //Set up catcher function
    const catcher = (error: Error) => res.status(400).json({ error });

    //connect to database
    const { Users } = await connectUsers();

    //get data from request
    const body =  await request.body.json();

    //get data from database
    const data = await Users.find({}).catch(catcher);

    //send response with data
    return NextResponse.json(data);
}