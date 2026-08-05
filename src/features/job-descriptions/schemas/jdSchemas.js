import { z } from "zod";

export const jdSchema = z.object({
  title: z.string().min(2, "Job title must be at least 2 characters"),
  company: z.string().min(2, "Company name must be at least 2 characters"),
  content: z
    .string()
    .trim()
    .min(
      250,
      "For accurate AI analysis, please paste a complete job description. Short descriptions usually produce poor AI results.",
    )
    .refine(
      (val) => /[a-zA-Z]/.test(val),
      "Description must contain readable text, not just symbols or numbers.",
    )
    .refine(
      (val) => !/\s{2,}/.test(val),
      "Please remove duplicate consecutive spaces.",
    ),
});
