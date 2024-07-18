import { emit } from "process";
import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(2, "Username must have atleast 2 characters")
  .max(20, "Username must have no more than 20 characters")
  .regex(/^[a-zA-z0-9_]+$/, "Username must not contain special character");

export const signUpSchema = z.object({
  usernameValidation,
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "password must have atleast 6 characters" }),
});
