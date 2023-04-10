import { NextResponse } from "next/server";
import {connectMatchData} from "../../../connections";
import {NextApiRequest, NextApiResponse} from "next";

export async function POST(request: Request, res: NextApiResponse){
    //Set up catcher function
    const catcher = (error: Error) => res.status(400).json({ error });
    
    //connect to database
    const { MatchData } = await connectMatchData();
    
    //get data from request
    const body =  await request.json();
    
    //create entry in database
    const data = await MatchData.create(body).catch(catcher);
    
    //send response with data
    return NextResponse.json(data);
}