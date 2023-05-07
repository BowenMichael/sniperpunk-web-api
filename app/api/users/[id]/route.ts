import { NextResponse } from "next/server";
import {connectMatchData, connectUsers} from "../../../../connections";
import {NextApiRequest, NextApiResponse} from "next";
import { getServerSession } from "next-auth/next"
//import { authOptions } from "/app/api/auth/[...nextauth]/route";

export async function PUT(request: NextApiRequest, res: NextApiResponse){
/*    //Set up catcher function
    const catcher = (error: Error) => res.status(400).json({ error });

    //connect to database
    const { Users } = await connectUsers();

    //get data from request
    const body =  await request.body;
    
    //create entry in database
    const data = await Users.findByIdAndUpdate(body.id, body ).catch(catcher);
    
    //send response with data
    return NextResponse.json(data);*/
}