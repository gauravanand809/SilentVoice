import {z} from "zod"

export const accemptMessageSchema=z.object({
    acceptMessages: z.boolean(),
})