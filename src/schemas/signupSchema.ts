import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(2, "Username should have atleast 2 characters")
  .max(20, "Username should not have more than 20 characters")
  .regex(
    /^[a-zA-Z0-9_]+$/,
    "username must not constain any speacial character axcept '_'"
  );
export const emailValidation = z
  .string()
  .email({ message: "invalid email address" });
export const passwordValidation = z
  .string()
  .min(6, "password should have atleast 6 characters")
  .max(20, "password should not have more than 20 characters");

export const signupSchema = z.object({
  username: usernameValidation,
  email: emailValidation,
  password: passwordValidation,
});
