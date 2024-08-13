import { z } from "zod";
import { passwordValidation } from "./signupSchema";

export const signInSchema = z.object({
  identifier: z.string(),
  password: passwordValidation,
});
