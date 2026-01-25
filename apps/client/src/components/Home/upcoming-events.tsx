import { getEvents } from "@repo/actions/events.actions";
import { MapPinIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default async function UpcomingEvents() {
  const { events } = await getEvents({ limit: 3, upcomingOnly: true });

  return (
    <div className="w-full lg:w-1/2 flex flex-col">
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <h2
          className="text-2xl md:text-3xl font-thin tracking-widest uppercase"
          style={{ color: "#000000" }}
        >
          Upcoming Events
        </h2>
        <Link
          className="text-xs md:text-sm font-semibold uppercase tracking-widest border-b border-gray-900 pb-1 hover:text-gray-600 hover:border-gray-600 transition-all"
          href="/events"
        >
          View all
        </Link>
      </div>

      <div className="flex flex-col gap-6">
        {events.map((event, idx) => {
          const date = new Date(event.startDate);
          const day = date.getDate();
          const month = date.toLocaleString("default", { month: "short" });

          return (
            <div className="flex gap-4 group cursor-pointer" key={idx}>
              {/* Date */}
              <div className="flex flex-col items-center justify-start pt-2 min-w-[60px]">
                <span className="text-3xl md:text-4xl font-light leading-none text-gray-900">
                  {day}
                </span>
                <span className="text-xs md:text-sm font-semibold uppercase text-gray-500 mt-1">
                  {month}
                </span>
                <div className="mt-2 text-xs text-gray-400 group-hover:text-gray-900 transition-colors">
                  + More
                </div>
              </div>

              {/* Image */}
              <div className="relative w-24 h-24 md:w-32 md:h-32 shrink-0 overflow-hidden rounded-md">
                <Image
                  alt={event.name}
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  fill
                  src={event.image.original_url}
                />
              </div>

              {/* Content */}
              <div className="flex flex-col justify-center py-2">
                <h3 className="text-lg md:text-xl font-medium text-gray-900 leading-tight mb-2 group-hover:text-gray-700 transition-colors">
                  {event.name}
                </h3>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <MapPinIcon className="w-4 h-4" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <span className="text-xs">
                    {event.startTime} - {event.endTime}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
