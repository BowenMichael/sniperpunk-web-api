import {NextRequest, NextResponse} from "next/server";
import {connectMatchData} from "../../../connections";
import {NextApiRequest, NextApiResponse} from "next";
import { getServerSession } from "next-auth/next"
import {getSession} from "next-auth/react";
//import { authOptions } from "/app/api/auth/[...nextauth]/route";

export async function POST(request: NextRequest, res: NextApiResponse){
    //Set up catcher function
    const catcher = (error: Error) => res.status(400).json({ error });
    
    //connect to database
    const { MatchData } = await connectMatchData();
    
    //get data from request
    const body =  await request.json();
    
    //set date information
    const date = new Date();
    body.date = date.getTime();
    
    //create entry in database
    const data = await MatchData.create(body).catch(catcher);
    
    //send response with data
    return NextResponse.json(data);
}

export async function GET(request : NextRequest, res: NextApiResponse){
/*    const session = await getSession({ request })

    if(!session ) {
        res.json({ error: "Not Authenticated" })
        return;
    }

    if(session?.user?.role != 1){
        res.json({ error: "Not Authorized"})
        return;
    }*/


    //Set up catcher function
    const catcher = (error: Error) => res.status(400).json({ error });
    
    //connect to database
    const { MatchData } = await connectMatchData();
    
    //get data from request
    const body =  await request.json();
    
    //get data from database
    const data = await MatchData.find({}).catch(catcher);
    
    //send response with data
    return NextResponse.json(data);
}