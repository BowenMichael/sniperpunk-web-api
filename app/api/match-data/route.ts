﻿import { NextResponse, NextRequest } from "next/server";
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

export async function GET(request : Request, res: NextApiResponse)
{
    //Set up catcher function
    const catcher = (error: Error) => res.status(400).json({ error });

    //connect to database
    const { MatchData } = await connectMatchData();
    
    //create entry in database
    const data = await MatchData.find({}).catch(catcher);

    //send response with data
    return NextResponse.json(data);
}
