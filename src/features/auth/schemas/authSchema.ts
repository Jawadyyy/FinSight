import { z } from "zod";

/**
 * Zod schemas for the auth forms. One source of truth for the shape and the
 * validation rules — react-hook-form uses these via zodResolver, and the
 * inferred types below become the form's field types.
 *
 * The rules mirror the backend DTOs: a valid email, and a password of at
 * least 8 characters.
 */
export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// z.infer turns a schema into a TypeScript type, so the forms stay typed
// without repeating the field list.
export type LoginFields = z.infer<typeof loginSchema>;
export type RegisterFields = z.infer<typeof registerSchema>;
