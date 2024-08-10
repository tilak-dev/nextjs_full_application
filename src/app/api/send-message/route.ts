import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";

export async function POST(request: Request) {
  await dbConnect();

  const { username, content } = await request.json();

  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
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
    //is user eccepting messages
    if (!user.isAcceptingMessage) {
      return Response.json(
        {
          success: false,
          message: "user is not eccepting messages",
        },
        {
          status: 403,
        }
      );
    }

    const newMessage = { content, createAt: new Date() };
    user.messages.push(newMessage as Message); //noticable point
    await user.save();
    return Response.json(
      {
        success: true,
        message: "message sent successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "error in send message",
      },
      {
        status: 500,
      }
    );
  }
}
