import { NextApiRequest, NextApiResponse } from "next"
import { connectUser } from "../../../util/connections"
import { ResponseFuncs } from "../../../util/types"

const KEY = 'aksjdhfkmalksjdhnciun234in2idn293h98nc32oi'
const PASS_KEY = 'alkjsdhflkjnaelcnilaieu134npi23n1p2u3np13hp98ndfp9'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

  //capture request method, we type it as a key of ResponseFunc to reduce typing later
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs

  //function for catch errors
  const catcher = (error: Error) => res.status(400).json({ error })

  // Potential Responses
  const handleCase: ResponseFuncs = {
    /* handles post requests around user credential authentication. 
    credientals need a email and password and return a user if they have access and id */
    POST: async (req: NextApiRequest, res: NextApiResponse) => {

        //if form body is empty
        if(!req.body){
            res.statusCode = 404;
            res.end('Error');
            return;
        }

        //else get data from body
        const {
            username,
            email,
            password,
          } = JSON.parse(req.body);

        //find user in database
        const { User } = await connectUser() // connect to database
        

        let account = await User.findOne({email: (email as String)}).catch(catcher);
        console.log("Request login info",account, email, )

        if(account === null){ //check if user was found
            res.statusCode = 404;
            res.end('Error');
            return;
        }

        res.json({
          username: username ,
          access: password == account.password,
          id: account._id,
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