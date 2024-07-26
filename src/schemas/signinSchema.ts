import { z } from "zod";
import { passwordValidation } from "./signupSchema";

export const verifySchema = z.object({
  identifier: z.string(),
  password: passwordValidation,
});
