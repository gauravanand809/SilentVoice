import { getServerSession } from "next-auth";
import { AuthOption } from "../auth/[...nextauth]/options";
import dbConnect from "../../../lib/dbConnect";
import UserModel from "../../../model/User";
import { User } from "next-auth";

export async function POST(request:Request){
    await dbConnect();
    const session = await getServerSession(AuthOption);
    const user: User = session?.user
    if(!session || !session.user){
        return Response.json({
            success:false,
            message:"Not authenticated"
        },{status:400})
    }

    const userId = user._id
    const {acceptMessage} = await request.json()

    try{
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {isAcceptingMessage : acceptMessage},
            {new: true}
        )

        if(!updatedUser){
            return Response.json({
                success:false,
                message:"Failed to update user"
                },{status:400})
        }

        else{
            return Response.json({
                success:true,
                message:"User updated successfully",
                updatedUser
                },
            {status:200})

        }
    }
    catch(error){
        console.log("failed to update user status to accept message")
        return Response.json({
            success:false,
            message:"Failed to update user status to accept message"
        },
    {
        status:500
    })
    }
}

export async function GET(request:Request){
try{    await dbConnect();
    const session = await getServerSession(AuthOption);
    const user: User = session?.user
    if(!session || !session.user){
        return Response.json({
            success:false,
            message:"Not authenticated"
        },{status:400})
    }    

    const userId = user._id;
    const isUser = await UserModel.findById(userId)
    if(!isUser){
        return Response.json({
            success:false,
            message:"User not found"
            },{status:404})
    }

    return Response.json({
        success:true,
        user:isUser
        },{status:200})
    }
    catch(error){
        console.log("failed to update user status to accept message")
        return Response.json({
            success:false,
            message:"Failed to get user"
            },{status:500})       
    }
}