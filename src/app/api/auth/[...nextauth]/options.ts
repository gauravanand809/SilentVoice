import { NextAuthOptions } from "next-auth";
import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "../../../../lib/dbConnect";
import UserModel from "../../../../model/User";

export const AuthOption: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      id: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req): Promise<any> {
        await dbConnect();
        try {
          const user = await UserModel.findOne({
            $or: [
              {
                email: credentials.email,
              },
              {
                username: credentials.email,
              },
            ],
          });

          if (!user) {
            throw new Error("User not found");
          }
          if (!user.isVerified) {
            throw new Error("User is not verified");
          } else {
            const isValid = await bcrypt.compare(
              credentials.password,
              user.password
            );
            if (!isValid) {
              throw new Error("Invalid password");
            } else {
              return user;
            }
          }
        } catch (err: any) {
          throw new Error(err);
        }
      },
    }), 
  ],
  pages:{
    signIn:'/sign-in',
  },
  session:{
    strategy:"jwt"
  },
  secret:process.env.NEXT_AUTH,
  callbacks:{
    async jwt({
      token,
      user
    }){
      if(user){
        token._id=user._id?.toString();
        token.isVerified = user.isVerified;
        token.isAcceptingMessage = user.isAcceptingMessage;
        token.username = user.username
      }
      return token;
    },
    async session({session,token}){
      if(token){
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessage = token.isAcceptingMessage;
        session.user.username = token.username
      }
      return session;
    }
  }

};

function authenticateUser(email: string, password: string) {
  throw new Error("Function not implemented.");
}
