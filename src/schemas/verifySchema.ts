import { z } from "zod";

export const verifyValidation = z
  .string()
  .length(6, { message: "verification code should be of 6 DIGITS" });

export const verifySchema = z.object({
  code: verifyValidation,
});
