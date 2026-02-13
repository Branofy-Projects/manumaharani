"use client";

import { useEffect, useState } from "react";

export default function SafariBookingForm({ zone }: { zone: string }) {
  const preSelectedZone = zone;

  const [formData, setFormData] = useState({
    adults: "1",
    children: "0",
    email: "",
    fullName: "",
    phone: "",
    preferredDate: "",
    safariTime: "",
    safariZone: preSelectedZone,
    specialRequests: "",
  });

  useEffect(() => {
    if (preSelectedZone) {
      setFormData((prev) => ({ ...prev, safariZone: preSelectedZone }));
    }
  }, [preSelectedZone]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Handle form submission logic here
  };

  const handleCancel = () => {
    setFormData({
      adults: "1",
      children: "0",
      email: "",
      fullName: "",
      phone: "",
      preferredDate: "",
      safariTime: "",
      safariZone: "",
      specialRequests: "",
    });
  };

  const safariZones = [
    "Bijrani Zone",
    "Jhirna Zone",
    "Dhikala Zone",
    "Durgadevi Zone",
    "Dhela Zone",
    "Garjiya Zone",
    "Sonanadi Zone",
    "Pakhro Zone",
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-3xl  uppercase tracking-[0.08em] md:text-5xl">
              Book Your Safari
            </h1>
            <p className="mx-auto max-w-2xl font-serif text-base text-gray-600 md:text-lg">
              Reserve your spot for an unforgettable wildlife experience in
              Corbett Tiger Reserve
            </p>
          </div>

          {/* Form Card */}
          <div className="rounded-lg bg-white p-8 shadow-lg md:p-12">
            <form onSubmit={handleSubmit}>
              {/* Contact Information */}
              <div className="mb-8">
                <h2 className="mb-6 text-xl font-semibold tracking-wide text-gray-900 md:text-2xl">
                  Contact Information
                </h2>

                {/* Full Name */}
                <div className="mb-6">
                  <label
                    className="mb-2 block text-base font-medium text-gray-900"
                    htmlFor="fullName"
                  >
                    Full Name<span className="text-red-600">*</span>
                  </label>
                  <input
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 transition-colors focus:border-gray-900 focus:outline-none"
                    id="fullName"
                    name="fullName"
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
                    type="text"
                    value={formData.fullName}
                  />
                </div>

                {/* Email and Phone */}
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label
                      className="mb-2 block text-base font-medium text-gray-900"
                      htmlFor="email"
                    >
                      Email<span className="text-red-600">*</span>
                    </label>
                    <input
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 transition-colors focus:border-gray-900 focus:outline-none"
                      id="email"
                      name="email"
                      onChange={handleInputChange}
                      placeholder="your.email@example.com"
                      required
                      type="email"
                      value={formData.email}
                    />
                  </div>
                  <div>
                    <label
                      className="mb-2 block text-base font-medium text-gray-900"
                      htmlFor="phone"
                    >
                      Phone Number<span className="text-red-600">*</span>
                    </label>
                    <input
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 transition-colors focus:border-gray-900 focus:outline-none"
                      id="phone"
                      name="phone"
                      onChange={handleInputChange}
                      placeholder="+91 1234567890"
                      required
                      type="tel"
                      value={formData.phone}
                    />
                  </div>
                </div>
              </div>

              {/* Booking Details */}
              <div className="mb-8">
                <h2 className="mb-6 text-xl font-semibold tracking-wide text-gray-900 md:text-2xl">
                  Booking Details
                </h2>

                {/* Safari Zone Selection */}
                <div className="mb-6">
                  <label
                    className="mb-2 block text-base font-medium text-gray-900"
                    htmlFor="safariZone"
                  >
                    Safari Zone<span className="text-red-600">*</span>
                  </label>
                  <select
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 transition-colors focus:border-gray-900 focus:outline-none"
                    id="safariZone"
                    name="safariZone"
                    onChange={handleInputChange}
                    required
                    value={formData.safariZone}
                  >
                    <option value="">Select a zone</option>
                    {safariZones.map((zone) => (
                      <option key={zone} value={zone}>
                        {zone}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Preferred Date and Time */}
                <div className="mb-6 grid gap-6 md:grid-cols-2">
                  <div>
                    <label
                      className="mb-2 block text-base font-medium text-gray-900"
                      htmlFor="preferredDate"
                    >
                      Preferred Date<span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <input
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 transition-colors focus:border-gray-900 focus:outline-none"
                        id="preferredDate"
                        name="preferredDate"
                        onChange={handleInputChange}
                        required
                        type="date"
                        value={formData.preferredDate}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      className="mb-2 block text-base font-medium text-gray-900"
                      htmlFor="safariTime"
                    >
                      Safari Time<span className="text-red-600">*</span>
                    </label>
                    <select
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 transition-colors focus:border-gray-900 focus:outline-none"
                      id="safariTime"
                      name="safariTime"
                      onChange={handleInputChange}
                      required
                      value={formData.safariTime}
                    >
                      <option value="">Select time slot</option>
                      <option value="morning">Morning (6:30 - 9:30)</option>
                      <option value="afternoon">Afternoon (1:30 - 5:00)</option>
                    </select>
                  </div>
                </div>

                {/* Number of Adults and Children */}
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label
                      className="mb-2 block text-base font-medium text-gray-900"
                      htmlFor="adults"
                    >
                      Number of Adults<span className="text-red-600">*</span>
                    </label>
                    <select
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 transition-colors focus:border-gray-900 focus:outline-none"
                      id="adults"
                      name="adults"
                      onChange={handleInputChange}
                      required
                      value={formData.adults}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? "Adult" : "Adults"}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      className="mb-2 block text-base font-medium text-gray-900"
                      htmlFor="children"
                    >
                      Number of Children
                    </label>
                    <select
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 transition-colors focus:border-gray-900 focus:outline-none"
                      id="children"
                      name="children"
                      onChange={handleInputChange}
                      value={formData.children}
                    >
                      {[0, 1, 2, 3, 4, 5, 6].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? "Child" : "Children"}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Special Requests */}
              <div className="mb-8">
                <label
                  className="mb-2 block text-base font-medium text-gray-900"
                  htmlFor="specialRequests"
                >
                  Special Requests (Optional)
                </label>
                <textarea
                  className="min-h-[120px] w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 transition-colors focus:border-gray-900 focus:outline-none"
                  id="specialRequests"
                  name="specialRequests"
                  onChange={handleInputChange}
                  placeholder="Any special requirements or requests..."
                  rows={4}
                  value={formData.specialRequests}
                />
              </div>

              {/* Action Buttons */}
              <div className="grid gap-4 md:grid-cols-2">
                <button
                  className="rounded-lg border-2 border-gray-900 bg-transparent px-6 py-3 text-base font-semibold uppercase tracking-wide text-gray-900 transition-all hover:bg-gray-100"
                  onClick={handleCancel}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className="rounded-lg border-2 border-[#8b7355] bg-[#8b7355] px-6 py-3 text-base font-semibold uppercase tracking-wide text-white transition-all hover:bg-[#7a6349]"
                  type="submit"
                >
                  Confirm Booking
                </button>
              </div>

              {/* Cancellation Policy Note */}
              <div className="mt-8 rounded-lg bg-[#f3eee7] p-4 text-center">
                <p className="text-sm text-gray-700">
                  Free cancellation up to 24 hours before the activity
                </p>
              </div>
            </form>
          </div>

          {/* Additional Information */}
          <div className="mt-12 rounded-lg bg-white p-6 shadow-md">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Important Information
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="mt-1 text-green-600">✓</span>
                <span>
                  Safari bookings are subject to availability and forest
                  department approval
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-green-600">✓</span>
                <span>
                  Entry gates open 30 minutes before the safari start time
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-green-600">✓</span>
                <span>
                  Please carry valid ID proof for all passengers during the
                  safari
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-green-600">✓</span>
                <span>
                  Children below 5 years are not recommended for safari tours
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-green-600">✓</span>
                <span>
                  We will contact you within 24 hours to confirm your booking
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
