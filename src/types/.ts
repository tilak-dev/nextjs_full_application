import { Message } from "@/model/User";

export interface ApiResponse {
  success: boolean;
  message: string;
  isAcceptingMeaage?:boolean;
  messages?:Array<Message>;
}
