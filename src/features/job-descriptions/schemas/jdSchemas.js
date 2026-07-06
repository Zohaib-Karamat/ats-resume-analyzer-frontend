import { z } from "zod";

export const jdSchema = z.object({
  title: z.string().min(2, "Job title must be at least 2 characters"),
  company: z.string().min(2, "Company name must be at least 2 characters"),
  content: z.string().min(50, "Job description content should be more detailed (min 50 characters)"),
});
