import { NextApiRequest, NextApiResponse } from "next"
import { connectPosts } from "../../../connections"
import { ResponseFuncs, IPostRecord } from "../../../types"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  //capture request method, we type it as a key of ResponseFunc to reduce typing later
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs

  //function for catch errors
  const catcher = (error: Error) => res.status(400).json({ error })

  // GRAB ID FROM req.query (where next stores params)
  const id: string = req.query.id as string

  // Potential Responses for /todos/:id
  const handleCase: ResponseFuncs = {
    // RESPONSE FOR GET REQUESTS
    GET: async (req: NextApiRequest, res: NextApiResponse) => {
      const { Posts } = await connectPosts() // connect to database
      res.json(await Posts.findById(id).catch(catcher))
      return
    },
    // RESPONSE PUT REQUESTS
    PUT: async (req: NextApiRequest, res: NextApiResponse) => {
      const { Posts } = await connectPosts() // connect to database
      res.json(
        await Posts.findByIdAndUpdate(id, req.body, { new: true }).catch(catcher)
      )
      return
    },
    // RESPONSE FOR DELETE REQUESTS
    DELETE: async (req: NextApiRequest, res: NextApiResponse) => {
      const { Posts } = await connectPosts() // connect to database
      res.json(await Posts.findByIdAndRemove(id).catch(catcher))
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