import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function POST(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!session || !session.user) {
    return Response.json(
      { success: false, message: "Not Authenticated" },
      {
        status: 401,
      }
    );
  }

  const userId = user?._id;
  const { acceptMessages } = await request.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: acceptMessages },
      { new: true }
    );
    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "failed to update users message accepted sections ",
        },
        { status: 401 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "update users message accepted sections successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("erroe in accept messages ");
    return Response.json(
      {
        success: false,
        message: "erroe in accept messages ",
        error: error,
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!session || !session.user) {
    return Response.json(
      { success: false, message: "Not Authenticated" },
      {
        status: 401,
      }
    );
  }

  const userId = user?._id;
  try {
    const foundUser = await UserModel.findById(userId);
    if (!foundUser) {
      return Response.json(
        { success: false, message: "failed to found user " },
        {
          status: 404,
        }
      );
    }
    return Response.json(
      { success: true, isAcceptingMessages: foundUser.isAcceptingMessage },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("error in messages"+error)
    return Response.json(
      { success: false, message: "error in messages" },
      {
        status: 500,
      }
    );
  }
}
