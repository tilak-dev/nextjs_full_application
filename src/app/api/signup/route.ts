import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificatioEmail } from "@/helpers/sendVErificationEmail";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();
    const existingVerifiedUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingVerifiedUsername) {
      return Response.json(
        {
          success: false,
          message: "user already exists",
        },
        {
          status: 400,
        }
      );
    }

    const existingVerifiedEmail = await UserModel.findOne({
      email,
    });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingVerifiedEmail) {
      if (existingVerifiedEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "user already exists",
          },
          {
            status: 400,
          }
        );
      } else {
        const hashPassword = await bcrypt.hash(password, 10);
        existingVerifiedEmail.password = hashPassword;
        existingVerifiedEmail.verifyCode = verifyCode;
        existingVerifiedEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode: verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        message: [],
      });

      await newUser.save();
    }

    //send verification code
    await sendVerificatioEmail(email, username, verifyCode);
    const emailResponse = await sendVerificatioEmail(
      email,
      username,
      verifyCode
    );
    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "user registered successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.log("error in registering user", error);
    return Response.json(
      {
        succese: false,
        message: "error in registering user",
      },
      {
        status: 500,
      }
    );
  }
}
