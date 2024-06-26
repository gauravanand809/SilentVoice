import { getServerSession } from "next-auth";
import { AuthOption } from "./../auth/[...nextauth]/options";
import dbConnect from "../../../lib/dbConnect";
import { User } from "next-auth";
import UserModel from "../../../model/User";
import mongoose from "mongoose";

export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(AuthOption);
  const user: User = session?.user;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not authenticated",
      },
      {
        status: 500,
      }
    );
  }

  const userId = new mongoose.Types.ObjectId(user._id);
  try {
    const user = await UserModel.aggregate([
      {
        $match: { id: userId },
      },
      {
        $unwind: "messages",
      },
      {
        $sort: { "messages.createdAt": -1 },
      },
      {
        $group: { _id: "$_id", messages: { $push: "$messages" } },
      },
    ]);
    if (!user || user.length === 0) {
      return Response.json(
        {
          success: false,
          message: "user not found",
        },
        {
          status: 404,
        }
      );
    }

    return Response.json(
      {
        success: true,
        messages: user[0].messages,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return Response.json({
      success: false,
      message: "Internal Server Error",
    },
    {
      status: 500,
      });

  }
}
