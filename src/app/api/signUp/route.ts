import { sendVerificationEmail } from '../../../helper/sendVerificationEmail';
import dbConnect from "../../../lib/dbConnect";
import UserModel from "../../../model/User";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();

    // Check if the username is already taken
    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserVerifiedByUsername) {
      return new Response(JSON.stringify({
        response: "Username already taken",
        success: false,
      }), { status: 400 });
    }

    // Check if the email is already registered
    const existingUserVerifiedByEmail = await UserModel.findOne({ email });
    const otp = Math.floor(1000000 + Math.random() * 9000000).toString();

    if (existingUserVerifiedByEmail) {
      if (existingUserVerifiedByEmail.isVerified) {
        return new Response(JSON.stringify({
          response: "Email already registered",
          success: false,
        }), { status: 400 });
      } else {
        // Update the existing user's details
        const hashedPassword = await bcrypt.hash(password, 12);
        existingUserVerifiedByEmail.password = hashedPassword;
        existingUserVerifiedByEmail.verifyCode = otp;
        existingUserVerifiedByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await existingUserVerifiedByEmail.save();
      }
    } else {
      // Create a new user
      const hashedPassword = await bcrypt.hash(password, 12);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        isVerified: false,
        verifyCode: otp,
        verifyCodeExpiry: expiryDate,
        isAcceptingMessage: true,
        messages: [],
      });
      await newUser.save();
    }

    // Send the verification email
    const emailResponse = await sendVerificationEmail(email, username, otp);
    if (!emailResponse.success) {
      return new Response(JSON.stringify({
        response: emailResponse.message,
        success: false,
      }), { status: 500 });
    }

    return new Response(JSON.stringify({
      response: "User created successfully",
      success: true,
    }), { status: 201 });

  } catch (err) {
    console.error("Error registering user", err);
    return new Response(JSON.stringify({
      response: "Error registering user",
      success: false,
    }), { status: 500 });
  }
}
