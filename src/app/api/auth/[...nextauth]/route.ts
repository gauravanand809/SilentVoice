import NextAuth from "next-auth/next"

import { AuthOption } from "./options"

const handler = NextAuth(AuthOption)
export {handler as GET,handler as POST}