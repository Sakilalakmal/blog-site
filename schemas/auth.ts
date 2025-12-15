import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string().min(3).max(100),
  email: z.email(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(100),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(100),
});
