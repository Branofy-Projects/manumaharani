"use client";
import { redirect, RedirectType } from "next/navigation";
import { type MouseEventHandler, useState } from "react";

import { Input } from "@/components/ui/input";

export const redirectToBooking = async (formData: {
  checkin: Date;
  checkout: Date;
  guests: number;
}) => {
  const checkin = formData.checkin.toISOString().split("T")[0];
  const checkout = formData.checkout.toISOString().split("T")[0];

  const url = `http://localhost:5000?checkin=${checkin}&checkout=${checkout}&guests=${formData.guests}`;
  redirect(url, RedirectType.push);
};

export function HomeHeroBookingBar() {
  const [checkin, setCheckin] = useState<Date | undefined>(undefined);
  const [checkout, setCheckout] = useState<Date | undefined>(undefined);
  const [guests, setGuests] = useState<number>(1);

  const onSubmit: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    if (!checkin || !checkout) return;
    redirectToBooking({ checkin, checkout, guests });
  };
  return (
    <>
      <div className="absolute left-0 right-0" style={{ bottom: "80px" }}>
        <div className="border-b border-b-white/20 w-full z-20 relative" />
      </div>
      <div
        className="absolute left-0 right-0 z-20 flex justify-center backdrop-blur-sm bg-black/40 shadow-lg"
        style={{ bottom: "0px", height: "80px" }}
      >
        <div className="grid grid-cols-4 items-center rounded-lg w-full max-w-7xl h-full">
          {/* 2nd box: Check In */}
          <div className="flex-1 flex flex-col justify-center hover:bg-white/10 transition-all duration-300 h-full px-4 border-l border-white/20">
            <label
              className="block text-xs uppercase text-white/80"
              htmlFor="checkin"
            >
              Check In
            </label>
            <Input
              className="w-full border-none bg-transparent p-0 text-white focus:ring-0 focus-visible:ring-0 focus-visible:outline-none"
              defaultValue={checkin?.toISOString().split("T")[0]}
              id="checkin"
              max={checkout?.toISOString().split("T")[0]}
              min={new Date().toISOString().split("T")[0]}
              name="checkin"
              onChange={(e) => setCheckin(new Date(e.target.value))}
              type="date"
            />
          </div>

          {/* 3rd box: Check Out */}
          <div className="flex-1 flex flex-col justify-center hover:bg-white/10 transition-all duration-300 h-full px-4 border-l border-white/20">
            <label
              className="block text-xs uppercase text-white/80"
              htmlFor="checkout"
            >
              Check Out
            </label>
            <Input
              className="w-full border-none dark:text-white bg-transparent p-0  text-white focus:ring-0 focus-visible:ring-0 focus-visible:outline-none"
              defaultValue={checkout?.toISOString().split("T")[0]}
              id="checkout"
              min={
                checkin?.toISOString().split("T")[0] ||
                new Date().toISOString().split("T")[0]
              }
              name="checkout"
              onChange={(e) => setCheckout(new Date(e.target.value))}
              placeholder="Check Out*"
              type="date"
            />
          </div>

          {/* 4th box: Guests */}
          <div className="flex-1 flex flex-col justify-center hover:bg-white/10 transition-all duration-300 h-full px-4 border-l border-white/20">
            <label
              className="block text-xs uppercase text-white/80"
              htmlFor="guests"
            >
              Guests
            </label>
            <select
              className="w-full border-none bg-transparent p-0 h-9 text-white focus:ring-0 focus-visible:ring-0 focus-visible:outline-none cursor-pointer appearance-none"
              id="guests"
              name="guests"
              onChange={(e) => setGuests(Number(e.target.value))}
              value={guests}
            >
              {Array.from({ length: 40 }, (_, i) => i + 1).map((num) => (
                <option className="text-black" key={num} value={num}>
                  {num} Guests
                </option>
              ))}
            </select>
          </div>

          {/* 5th box: Book Now */}
          <div className="flex items-center justify-center h-full border-l border-r border-white/20">
            <button
              className="flex-1 flex h-full justify-center items-center text-white hover:bg-white/10 transition-all duration-300"
              disabled={!checkin || !checkout}
              onClick={onSubmit}
              type="submit"
            >
              Book Your Riverside Escape
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
