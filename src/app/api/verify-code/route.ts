import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signupSchema";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, code } = await request.json();

    const decodedUsername = decodeURIComponent(username);
    const user = await UserModel.findOne({
      username: decodedUsername,
    });
    if (!user) {
      return Response.json(
        {
          succes: false,
          message: "user not found",
        },
        { status: 500 }
      );
    }
    const iscodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (iscodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();
      return Response.json(
        {
          succes: true,
          message: "user verified in success",
        },
        { status: 200 }
      );
    } else if (!isCodeNotExpired){
      return Response.json(
        {
          succes: false,
          message: "verification code is expired please signup again for new code",
        },
        { status: 400 }
      );
    }else{
      return Response.json(
        {
          succes: false,
          message: "Incorrect verifing code",
        },
        { status: 400 }
      );
    }

  } catch (error) {
    return Response.json(
      {
        succes: false,
        message: "error in verify code",
      },
      { status: 500 }
    );
  }
}
