import { Message } from "@/model/User";

export interface ApiResponse {
  success: boolean;
  message: string;
  isAcceptingMessge?:boolean;
  messages?:Array<Message>;
}
