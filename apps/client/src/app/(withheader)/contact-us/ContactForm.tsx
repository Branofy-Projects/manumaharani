"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { createContactQuery } from "@repo/actions";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const contactSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  subject: z.string().min(2, "Subject is required"),
});

type ContactFormData = z.infer<typeof contactSchema>;
type FormStatus = "error" | "idle" | "submitting" | "success";

export default function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<ContactFormData>({
    defaultValues: {
      email: "",
      message: "",
      name: "",
      phone: "",
      subject: "",
    },
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setStatus("submitting");

    try {
      await createContactQuery(data);
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="flex h-full items-center justify-center rounded-xl border border-gray-100 bg-white p-8 shadow-sm">
        <div className="flex w-full flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
            </svg>
          </div>
          <h3 className="mb-2 font-serif text-2xl font-light text-[#2b2b2b]">Thank You!</h3>
          <p className="mb-6 text-gray-600">
            Your message has been sent successfully. We&apos;ll get back to you shortly.
          </p>
          <Button
            className="bg-[#2b2b2b] text-sm font-bold uppercase tracking-[0.2em] text-white hover:bg-[#a88b4d]"
            onClick={() => setStatus("idle")}
          >
            Send Another Message
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-8 shadow-sm">
      <h3 className="mb-6 font-serif text-2xl font-light text-[#2b2b2b]">Send us a Message</h3>
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700" htmlFor="name">Name</label>
            <Input
              className="rounded-lg border-gray-200 bg-[#faf6f1]/30 focus:border-[#a88b4d] focus:ring-[#a88b4d]"
              id="name"
              placeholder="Your Name"
              {...register("name")}
            />
            {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700" htmlFor="phone">Phone</label>
            <Input
              className="rounded-lg border-gray-200 bg-[#faf6f1]/30 focus:border-[#a88b4d] focus:ring-[#a88b4d]"
              id="phone"
              placeholder="Your Phone Number"
              type="tel"
              {...register("phone")}
            />
            {errors.phone && <p className="text-xs text-red-600">{errors.phone.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700" htmlFor="email">Email</label>
          <Input
            className="rounded-lg border-gray-200 bg-[#faf6f1]/30 focus:border-[#a88b4d] focus:ring-[#a88b4d]"
            id="email"
            placeholder="Your Email"
            type="email"
            {...register("email")}
          />
          {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700" htmlFor="subject">Subject</label>
          <Input
            className="rounded-lg border-gray-200 bg-[#faf6f1]/30 focus:border-[#a88b4d] focus:ring-[#a88b4d]"
            id="subject"
            placeholder="Subject"
            {...register("subject")}
          />
          {errors.subject && <p className="text-xs text-red-600">{errors.subject.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700" htmlFor="message">Message</label>
          <Textarea
            className="rounded-lg border-gray-200 bg-[#faf6f1]/30 focus:border-[#a88b4d] focus:ring-[#a88b4d]"
            id="message"
            placeholder="Your Message"
            rows={6}
            {...register("message")}
          />
          {errors.message && <p className="text-xs text-red-600">{errors.message.message}</p>}
        </div>

        {status === "error" && (
          <p className="text-sm text-red-600">
            Something went wrong. Please try again later.
          </p>
        )}

        <Button
          className="w-full bg-[#2b2b2b] py-6 text-sm font-bold uppercase tracking-[0.2em] text-white hover:bg-[#a88b4d]"
          disabled={status === "submitting"}
          size="lg"
          type="submit"
        >
          {status === "submitting" ? "Sending..." : "Send Message"}
        </Button>
      </form>
    </div>
  );
}
