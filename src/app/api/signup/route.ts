import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificatioEmail } from "@/helpers/sendVErificationEmail";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();
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
