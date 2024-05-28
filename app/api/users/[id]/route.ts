import {NextRequest, NextResponse } from "next/server";
import {connectMatchData, connectUsers} from "../../../../connections";
import {NextApiRequest, NextApiResponse} from "next";
import { getServerSession } from "next-auth/next"
import {getSession} from "next-auth/react";
//import { authOptions } from "/app/api/auth/[...nextauth]/route";

export async function PUT(request: NextRequest, res: NextApiResponse){
    
    //Set up catcher function
    const catcher = (error: Error) => res.status(400).json({ error });

    //connect to database
    const { Users } = await connectUsers();

    //get data from request
    const body =  await request.json();
    
    //create entry in database
    const data = (await Users.findByIdAndUpdate(body._id, body )).catch(catcher);
    //console.log({data, body});

    //console.log(data, body, request.url)


    //send response with data
    return NextResponse.json(data);
}

export async function GET(request: NextRequest, res: NextApiResponse) {
    //Set up catcher function
    const catcher = (error: Error) => res.status(400).json({ error });

    //connect to database
    const { Users } = await connectUsers();

    //get data from request
    if(!request.url) {
        console.error('Failed to find URL when trying to get user on server')
        return undefined;
    }
    /*const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');*/
    const id = request.nextUrl.href.substring(request.nextUrl.href.lastIndexOf('/') + 1)
    
    //create entry in database
    const data = await Users.findById(id).catch(catcher);

    //console.log(data, id, request.url)
    
    //send response with data
    return NextResponse.json(data);
}