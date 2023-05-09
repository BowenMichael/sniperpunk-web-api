import { NextApiRequest, NextApiResponse } from "next"
import { connectPlayer } from "../../../connections"
import { ResponseFuncs, PlayerRecord } from "../../../types"
import {getSession} from "next-auth/react";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  //capture request method, we type it as a key of ResponseFunc to reduce typing later
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs

  //function for catch errors
  const catcher = (error: Error) => res.status(400).json({ error })

  // GRAB ID FROM req.query (where next stores params)
  const id: string = req.query.id as string

  const session = await getSession({ req })

  if(!session ) {
    res.json({ error: "Not Authenticated" })
    return;
  }

  if(session?.user?.role != 1){
    res.json({ error: "Not Authorized"})
    return;
  }

  // Potential Responses for /todos/:id
  const handleCase: ResponseFuncs = {
    // RESPONSE FOR GET REQUESTS
    GET: async (req: NextApiRequest, res: NextApiResponse) => {
      const { Player } = await connectPlayer() // connect to database
      res.json(await Player.findById(id).catch(catcher))
      return
    },
    // RESPONSE PUT REQUESTS
    PUT: async (req: NextApiRequest, res: NextApiResponse) => {
      const { Player } = await connectPlayer() // connect to database
      res.json(
        await Player.findByIdAndUpdate(id, req.body, { new: true }).catch(catcher)
      )
      return
    },
    // RESPONSE FOR DELETE REQUESTS
    DELETE: async (req: NextApiRequest, res: NextApiResponse) => {
      const { Player } = await connectPlayer() // connect to database
      res.json(await Player.findByIdAndRemove(id).catch(catcher))
      return
    },

  }

  // Check if there is a response for the particular method, if so invoke it, if not response with an error
  const response = handleCase[method]
  if (response) response(req, res)
  else res.status(400).json({ error: "No Response for This Request" })
  return;
}

export default handler