import { z } from "zod";

export const messageValidation = z
  .string()
  .min(10,"content should have atleast 10 characters ")
  .min(10,"content should not have more than 300 characters ")

export const verifySchema = z.object({
  content: messageValidation,
});
