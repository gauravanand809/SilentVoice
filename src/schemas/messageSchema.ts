import {z} from "zod"

export const messageSchema=z.object({
    content: z.string()
    .min(10,{message: " content must be of atleast 10 character"})
    .max(400,{message: "Message too long try to consolidate in 400 words"})
})