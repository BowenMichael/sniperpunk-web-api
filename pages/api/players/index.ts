import { NextApiRequest, NextApiResponse } from "next"
import { connectPlayer } from "../../../connections"
import { ResponseFuncs, PlayerRecord } from "../../../types"


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  //capture request method, we type it as a key of ResponseFunc to reduce typing later
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs

  //function for catch errors
  const catcher = (error: Error) => res.status(400).json({ error })

  // Potential Responses
  const handleCase: ResponseFuncs = {
    // RESPONSE FOR GET REQUESTS
    GET: async (req: NextApiRequest, res: NextApiResponse) => {
      const { Player } = await connectPlayer() // connect to database
      res.json(await Player.find({}).catch(catcher))
      return
    },
    // RESPONSE POST REQUESTS
    POST: async (req: NextApiRequest, res: NextApiResponse) => {
      const { Player } = await connectPlayer() // connect to database
      const players : any[] | void = await Player.find({}).catch(catcher) //Get All Players
      
      /**
       * Check if player is in the database
       */
      if(players && players.filter(u => u.id === req.body.id).length < 1)
      {
        //Create Player
        res.json(await Player.create(req.body).catch(catcher))
        return
      }
    
      //return null
      res.json({undefined})
      return
      
      
    }
  }

  // Check if there is a response for the particular method, if so invoke it, if not response with an error
  const response = handleCase[method]
  if (response) response(req, res)
  else res.status(400).json({ error: "No Response for This Request" })
  return;
}

export default handler