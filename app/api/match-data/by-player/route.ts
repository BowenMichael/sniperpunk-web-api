import {NextApiResponse} from "next";
import {connectMatchData} from "../../../../connections";
import {NextResponse} from "next/server";

export async function POST(request: Request, res: NextApiResponse){
    //Set up catcher function
    const catcher = (error: Error) => res.status(400).json({ error });

    //connect to database
    const { MatchData } = await connectMatchData();

    //get data from request
    const body =  await request.json();

    // get filter from body
    const filter = body.filter

    //create entry in database
    const data = await MatchData.find(filter).catch(catcher);

    //send response with data
    return NextResponse.json(data);
}