import { z } from "zod";

export const profileUpdateSchema = z
  .object({
    name: z.string().trim().optional(),
    email: z.string().trim().optional(),
  })
  .superRefine((data, ctx) => {
    const hasName = Boolean(data.name);
    const hasEmail = Boolean(data.email);

    if (!hasName && !hasEmail) {
      ctx.addIssue({
        code: "custom",
        path: ["name"],
        message: "Enter a name or email address to update",
      });
      return;
    }

    if (hasName && data.name.length < 2) {
      ctx.addIssue({
        code: "custom",
        path: ["name"],
        message: "Name must be at least 2 characters",
      });
    }

    if (hasEmail && !z.email().safeParse(data.email).success) {
      ctx.addIssue({
        code: "custom",
        path: ["email"],
        message: "Invalid email address",
      });
    }
  });

export const passwordUpdateSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
