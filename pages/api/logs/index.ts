import { NextApiRequest, NextApiResponse } from "next"
import { connectLog } from "../../../connections"
import { ResponseFuncs, PlayerRecord } from "../../../types"
import {getServerSession} from "next-auth/next";
import {getSession} from "next-auth/react";


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  //capture request method, we type it as a key of ResponseFunc to reduce typing later
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs

  //function for catch errors
  const catcher = (error: Error) => res.status(400).json({ error })

  const session = await getSession({ req })

  if(!session ) {
    res.json({ error: "Not Authenticated" })
    return;
  }

  // Potential Responses
  const handleCase: ResponseFuncs = {
    // RESPONSE FOR GET REQUESTS
    GET: async (req: NextApiRequest, res: NextApiResponse) => {
      if(session?.user?.role != 1){
        res.json({ error: "Not Authorized"})
        return;
      }
 
      const { Logs } = await connectLog() // connect to database
      res.json(await Logs.find({}).catch(catcher))
      return
    },
    // RESPONSE POST REQUESTS
    POST: async (req: NextApiRequest, res: NextApiResponse) => {
      
      const { Logs } = await connectLog() // connect to database
      res.json(await Logs.create(req.body).catch(catcher))
    }
  }

  // Check if there is a response for the particular method, if so invoke it, if not response with an error
  const response = handleCase[method]
  if (response) response(req, res)
  else res.status(400).json({ error: "No Response for This Request" })
  return;
}

export default handler