import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: "Format email tidak valid. Gunakan @." }),
  password: z.string().min(6, { message: "Kata sandi sangat lemah. Minimal 6 karakter." }),
});

export type LoginFormInputs = z.infer<typeof loginSchema>;