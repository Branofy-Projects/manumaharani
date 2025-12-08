import TestimonialForm from "@/features/testimonials/components/testimonial-form";

export const metadata = {
  title: "Dashboard: Create Testimonial",
};

export default function NewTestimonialPage() {
  return <TestimonialForm initialData={null} pageTitle="Create New Testimonial" />;
}

