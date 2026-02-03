import { getEvents } from "@repo/actions/events.actions";
import { Calendar, Clock, MapPin } from "lucide-react";
import Image from "next/image";


export default async function EventsPage() {
  const { events } = await getEvents({ limit: 100 });

  return (
    <div className="grid grid-cols-1 max-w-screen-xl w-full mx-auto md:grid-cols-2 lg:grid-cols-4 gap-6 px-4 xl:px-0">
      {events.map((event) => {
        const startDate = new Date(event.startDate);
        const startDay = startDate.getDate();
        const startMonth = startDate.toLocaleString("default", { month: "short" });

        return (
          <div
            className="bg-white rounded-lg overflow-hidden flex flex-col group cursor-pointer shadow-sm hover:shadow-md transition-shadow"
            key={event.id}
          >
            <div className="relative w-full aspect-[4/3] overflow-hidden">
              <Image
                alt={event.image?.alt_text || event.name}
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                fill
                src={event.image?.original_url}
              />

              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-md flex flex-col items-center min-w-[60px] shadow-sm">
                <span className="text-2xl font-bold leading-none text-gray-900">
                  {startDay}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                  {startMonth}
                </span>
              </div>
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-xl font-serif mb-2 leading-tight text-black">
                {event.name}
              </h3>

              <div className="flex items-center gap-4 mb-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>
                    {event.startTime} - {event.endTime}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 mb-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                <Calendar className="w-3 h-3" />
                <span>
                  {event.endDate ? (
                    <>
                      {new Date(event.startDate).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}{" "}
                      -{" "}
                      {new Date(event.endDate).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </>
                  ) : (
                    new Date(event.startDate).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  )}
                </span>
              </div>
              <div className="flex items-center gap-1 mb-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                <MapPin className="w-3 h-3" />
                <span>{event.location}</span>
              </div>



              <div className="text-gray-600 text-sm mb-6 flex-grow line-clamp-3">
                {event.excerpt}
              </div>
              <button className="w-full border border-black text-black rounded-sm py-3 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors">
                View details
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
