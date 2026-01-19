import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactUsPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-gray-900 to-gray-700 py-20 text-white md:py-32">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="mb-4 text-4xl font-thin tracking-wide md:text-5xl lg:text-6xl">
            Contact Us
          </h1>
          <p className="text-md md:text-xl">
            We&apos;d love to hear from you! Reach out to us for any inquiries
            or assistance.
          </p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-center text-3xl font-thin tracking-wide text-gray-900">
          Send us a Message
        </h2>
        <form className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Input placeholder="Your Name" type="text" />
            <Input placeholder="Your Email" type="email" />
          </div>
          <Input placeholder="Subject" type="text" />
          <Textarea placeholder="Your Message" rows={6} />
          <div className="text-center">
            <Button
              className="bg-gray-900 hover:bg-gray-800"
              size="lg"
              type="submit"
            >
              Send Message
            </Button>
          </div>
        </form>
      </section>

      {/* Contact Information Section */}
      <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-8 text-3xl font-thin tracking-wide text-gray-900">
            Our Information
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                Address
              </h3>
              <p className="text-gray-600">
                123 Resort Road, Jim Corbett, India
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                Phone
              </h3>
              <p className="text-gray-600">+91 98765 43210</p>
            </div>
            <div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                Email
              </h3>
              <p className="text-gray-600">info@manumaharani.com</p>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section (Placeholder) */}
      <section className="mx-auto max-w-full px-4 py-16 sm:px-6 lg:px-8">
        <div className="aspect-video h-96 w-full rounded-lg bg-gray-200 flex items-center justify-center text-gray-600">
          <p>Map Placeholder</p>
        </div>
      </section>
    </main>
  );
}
