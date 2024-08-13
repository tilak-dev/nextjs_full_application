import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signupSchema";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = {
      //localhost:3000/api/checking-username-uniqueness?username=869669864
      username: searchParams.get("username"),
    };
    //validates with zod
    const result = UsernameQuerySchema.safeParse(queryParams);
    // console.log(result); //todo remove
  
    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(', ')
              : 'Invalid query parameters',
        },
        { status: 400 }
      );
    }
    const { username } = result.data;
    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUser) {
      return Response.json(
        {
          succes: false,
          message: "username already taken",
        },
        { status: 200 }
      );
    }
    return Response.json(
      {
        succes: true,
        message: "username has uniqueness",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("error in checking username uniqueness" + error);
    return Response.json(
      {
        succes: false,
        message: "error in cheching username uniqueness",
      },
      { status: 500 }
    );
  }
}
