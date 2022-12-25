import { NextApiRequest, NextApiResponse } from "next"
import { ResponseFuncs } from "../../../util/types"

async function wrapedSendMail(mailOptions:object){
    return new Promise((resolve,reject)=>{
        let nodemailer = require('nodemailer')
        const transporter = nodemailer.createTransport({
            port: 465,
            host: "smtp.gmail.com",
            auth: {
            user: process.env.EMAIL_USERNAME + "@gmail.com",
            pass: process.env.EMAIL_PASSWORD,
            },
            secure: true,
        });

        transporter.sendMail(mailOptions, function(error:any, info:any){
            if (error) {
                console.log("error is "+error);
                resolve(false); // or use rejcet(false) but then you will have to handle errors
            } 
        else {
            console.log('Email sent: ' + info.response);
            resolve(true);
            
            }
        });
    })
}


const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    //capture request method, we type it as a key of ResponseFunc to reduce typing later
    const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs
  
    //function for catch errors
    const catcher = (error: Error) => res.status(400).json({ error })
    const handleCase: ResponseFuncs = {
        /* handles post requests around user credential authentication. 
        credientals need a email and password and return a user if they have access and id */
        POST: async (req: NextApiRequest, res: NextApiResponse) => {
        
            const location = req.body.reqURL.href;
            //if form body is empty
            if(!req.body){
                res.statusCode = 404;
                res.end('Error');
                return;
            }
            
            let nodemailer = require('nodemailer')

            const href = `${process.env.NEXTAUTH_URL}login/resetPassword?key=someKey&email=${req.body.requestedEmail}`

            console.log(href);

            const mailData = {
                from: 'vision@noreply.com',
                to: req.body.requestedEmail,
                subject: `Message From `,
                text: req.body.requestMessage,
                html: `<h1>Hi ${req.body.requestedName},</h1><div>Follow this url to reset your password:${href}</div><button><a href=${href} class="button">Reset Password</a></button>`,
            }

            const response = wrapedSendMail(mailData)
            
            console.log(response);
            response.then(() => {
                res.json({ok: true })
            })
            

            return;          

        }
    }
  // Check if there is a response for the particular method, if so invoke it, if not response with an error
  const response = handleCase[method]
  if (response) response(req, res)
  else res.status(400).json({ error: "No Response for This Request" })
  return;
}

export default handler