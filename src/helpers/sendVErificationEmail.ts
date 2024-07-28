import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/ApiRespone";
import { url } from "inspector";
import VerificationEmail from "../../emails/VerificationEmail";

export async function sendVerificatioEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "one@gmail.com",//change krna h ise
      to: email,
      subject: "verify user account",
      react: VerificationEmail({ username, otp: verifyCode }),
    });
    return { success: true, message: "successfully send verification code" };
  } catch (emailError: any) {
    console.error("error in sending verification code", emailError);
    return { success: false, message: "failed to send verification code" };
  }
}
