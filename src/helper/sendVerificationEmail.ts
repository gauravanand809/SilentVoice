import {resend} from "../lib/resend"
import {EmailTemplate} from "../../emails/VerificationEmail"

import { ApiResponse } from "../types/ApiResponse"

export async function sendVerificationEmail(email:string,
    username: string,
    verifyCode: string,
): Promise <ApiResponse>{
    try{
         await resend.emails.send({
            from: 'YourName <yourname@feedback360.xyz>',
            to: [email],
            subject: 'Mystery Message || Verification code',
            react:EmailTemplate({username:username,otp:verifyCode}) ,
          });
               
        return {
            success: true,
            response:"email send sucessful"
        }       
    }
    catch(err){
        console.log("Error sending Validation email",err)
        return {
            success: false,
            response:"failed to send verification email"
        }
    }
}