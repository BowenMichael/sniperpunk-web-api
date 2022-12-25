import { NextApiRequest, NextApiResponse } from "next"
import { connectUser } from "../../../util/connections"
import { ResponseFuncs } from "../../../util/types"
import jwt from 'jsonwebtoken'
import { debug } from "console"

const KEY = 'aksjdhfkmalksjdhnciun234in2idn293h98nc32oi'
const PASS_KEY = 'alkjsdhflkjnaelcnilaieu134npi23n1p2u3np13hp98ndfp9'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

  //capture request method, we type it as a key of ResponseFunc to reduce typing later
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs

  //function for catch errors
  const catcher = (error: Error) => res.status(400).json({ error })

  // Potential Responses
  const handleCase: ResponseFuncs = {
    // RESPONSE FOR GET REQUESTS
    POST: async (req: NextApiRequest, res: NextApiResponse) => {
        //if form body is empty
        if(!req.body){
            res.statusCode = 404;
            res.end('Error');
            return;
        }

        //else get data from body
        const {requestedEmail,encryptedPassword} = req.body;
        const requestedEmailLower = requestedEmail.toLowerCase()

        //find user in database
        const { User } = await connectUser() // connect to database
        let account = await User.findOne({email: requestedEmailLower}).catch(catcher);
    
        if(account == null){ //check if user was found
            res.statusCode = 404;
            res.end('Error');
            return;
        }

        res.json({
            token: jwt.sign({
                requestedEmail: requestedEmailLower,
                access: encryptedPassword == account.password,
                id: account._id,
            }, KEY)

        })
    },
  }

  // Check if there is a response for the particular method, if so invoke it, if not response with an error
  const response = handleCase[method]
  if (response) response(req, res)
  else res.status(400).json({ error: "No Response for This Request" })
  return;
}

export default handler;