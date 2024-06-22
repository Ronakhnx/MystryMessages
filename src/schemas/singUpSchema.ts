import { z } from "zod";

export const usernameValidation = z.string().min(2);
