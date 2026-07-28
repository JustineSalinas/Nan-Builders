import { z } from "zod";

export const serviceOptions = [
  "Design & Build",
  "Design Consultation",
  "Maintenance & Repairs",
  "Interior Design",
  "Sign & Seal",
  "Building Permit",
  "Construction Supply",
  "Hollowblocks (CHB)",
  "Hauling",
  "Printing Services",
  "Other",
] as const;

export const contactSchema = z.object({
  type: z.literal("contact"),
  name: z.string().min(2, "Please enter your name.").max(80),
  email: z.string().email("Enter a valid email address."),
  phone: z
    .string()
    .min(7, "Enter a valid phone number.")
    .max(20)
    .regex(/^[0-9+\-()\s]+$/, "Enter a valid phone number."),
  service: z.string().optional(),
  message: z.string().min(10, "Tell us a bit more (10+ characters).").max(2000),
  // Honeypot — must stay empty.
  company: z.string().max(0).optional(),
});

export const careersSchema = z.object({
  type: z.literal("careers"),
  name: z.string().min(2, "Please enter your name.").max(80),
  email: z.string().email("Enter a valid email address."),
  phone: z
    .string()
    .min(7, "Enter a valid phone number.")
    .max(20)
    .regex(/^[0-9+\-()\s]+$/, "Enter a valid phone number."),
  role: z.string().min(2, "Which role are you applying for?").max(120),
  portfolio: z.string().url("Enter a valid link.").optional().or(z.literal("")),
  message: z.string().min(10, "Tell us about yourself (10+ characters).").max(2000),
  company: z.string().max(0).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type CareersInput = z.infer<typeof careersSchema>;

export const submissionSchema = z.discriminatedUnion("type", [
  contactSchema,
  careersSchema,
]);
