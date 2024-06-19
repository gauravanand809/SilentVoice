import dbConnect from "../../../lib/dbConnect";
import UserModel from "../../../model/User";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, code } = await request.json();

    const decodedUsername = decodeURIComponent(username);
    const user = await UserModel.findOne({ username: decodedUsername });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "user not found",
        },
        {
          status: 500,
        }
      );
    }

    const iscodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (iscodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();
      return Response.json({
        success: true,
        message: "user verified successfully",
      });
    } else if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message: "code has expired",
        },
        {
          status: 500,
        }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "invalid code",
        },
        {
          status: 500,
        }
      );
    }
  } catch (error) {
    console.log("Error verifying user", error);
    return Response.json(
      {
        message: "Error verifying user",
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}
 