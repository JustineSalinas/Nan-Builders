"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Send, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { careersSchema, type CareersInput } from "@/lib/validation";

const fieldError = "mt-1 text-xs font-medium text-destructive";

export function CareersForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CareersInput>({
    resolver: zodResolver(careersSchema),
    defaultValues: { type: "careers", portfolio: "" },
  });

  async function onSubmit(values: CareersInput) {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        toast.error(data.error || "Something went wrong. Please try again.");
        return;
      }
      toast.success(
        data.message || "Application received! Thanks for your interest — we'll review and reach out."
      );
      reset({ type: "careers", portfolio: "" });
    } catch {
      toast.error("Network error. Please try again or email us directly.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <input type="text" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" {...register("company")} />

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="c-name">Full name</Label>
          <Input id="c-name" placeholder="Juan dela Cruz" className="mt-1.5" {...register("name")} />
          {errors.name && <p className={fieldError}>{errors.name.message}</p>}
        </div>
        <div>
          <Label htmlFor="c-role">Role you&apos;re applying for</Label>
          <Input id="c-role" placeholder="e.g. Mason, Foreman, Draftsman" className="mt-1.5" {...register("role")} />
          {errors.role && <p className={fieldError}>{errors.role.message}</p>}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="c-email">Email</Label>
          <Input id="c-email" type="email" placeholder="you@email.com" className="mt-1.5" {...register("email")} />
          {errors.email && <p className={fieldError}>{errors.email.message}</p>}
        </div>
        <div>
          <Label htmlFor="c-phone">Phone</Label>
          <Input id="c-phone" placeholder="0917 000 0000" className="mt-1.5" {...register("phone")} />
          {errors.phone && <p className={fieldError}>{errors.phone.message}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="c-portfolio">Resume or portfolio link <span className="text-slate-400">(optional)</span></Label>
        <Input id="c-portfolio" placeholder="https://drive.google.com/…" className="mt-1.5" {...register("portfolio")} />
        {errors.portfolio && <p className={fieldError}>{errors.portfolio.message}</p>}
      </div>

      <div>
        <Label htmlFor="c-message">Tell us about yourself</Label>
        <Textarea
          id="c-message"
          rows={5}
          placeholder="Your experience, skills, and why you'd like to join Nan Builders…"
          className="mt-1.5"
          {...register("message")}
        />
        {errors.message && <p className={fieldError}>{errors.message.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-brand-blue px-6 font-heading text-base font-semibold uppercase tracking-wide text-white transition-colors hover:bg-brand-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 disabled:opacity-60 sm:w-auto"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Submitting…
          </>
        ) : (
          <>
            <Send className="h-4 w-4" /> Submit application
          </>
        )}
      </button>
    </form>
  );
}
