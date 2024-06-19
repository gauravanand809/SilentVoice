import dbConnect from "../../../lib/dbConnect";
import UserModel from "../../../model/User";
import z from 'zod'
import { usernameValidation } from "../../../schemas/signUpSchema";


const UsernameQuerySchema = z.object({
    username: usernameValidation,
})

export async function GET(request:Request){
    await dbConnect();
    
    try{
        const {searchParams}=new URL(request.url)
        const queryParam = {
            username: searchParams.get('username')
        }

        //validate with zod
        const result = UsernameQuerySchema.safeParse(queryParam)
        if(!result.success){
            const usernameError = result.error.format().username?._errors || []
            return Response.json({
                success: false,
                message: usernameError.join(",")
                },
                {status:500}
            )
        }

        const {username} = result.data

        const existing_user = await UserModel.findOne({username,isVerified:true})
        if(existing_user){
            return Response.json({
                success: false,
                message: "Username is unavailablel"
                },
                {status:400}
            )
    }
    else{
        return Response.json({
            success: true,
            message: "Username is available"
            },
            {status:200}
            )
    }

        }
    catch(err){
            console.error("error checking username",err)
            return Response.json({
                success:false,
                message:"Error checking username"
            },
        {
            status:500,
        }
        )
    }
}   