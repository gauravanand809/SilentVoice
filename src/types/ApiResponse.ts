import { Message } from "postcss";
export interface ApiResponse{
    success: boolean;
    response: string;
    isAcceptingMessage?: boolean;
    message?:Array<Message>
}