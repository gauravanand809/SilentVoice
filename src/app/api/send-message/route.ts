import dbConnect from "../../../lib/dbConnect";
import UserModel from "../../../model/User";
import { Message } from "../../../model/User";

export async function POST(request: Request){
    await dbConnect();
    const {username,content} = await request.json();
    try{
        const user = await UserModel.findOne({username});
        if(!user){
            return Response.json({
                message:"User not found",
                success:false
            }
        ,{
            status:404
        })
        }

        //isuser accepting the message

        if(!user.isAcceptingMessage){
            return Response.json({
                message:"User is not accepting messages",
                success:false
                },{
                    status:403
                    })
        }

        const newMessage = {content, createdAt:new Date()}
        user.message.push(newMessage as Message)
        await user.save()
        return Response.json({
            message:"Message sent successfully",
            success:true
            },
        {
            status:201
        }
        )
            
    }
    catch(error){
        console.error("An unaccepted error",error)
        return Response.json({
            message:"Error sending message",
            success:false
            },
            {
                status:500
                }
                )
    }
}
