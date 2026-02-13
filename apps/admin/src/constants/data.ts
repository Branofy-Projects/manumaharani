import type { NavItem } from "@/types";

export type Product = {
  category: string;
  created_at: string;
  description: string;
  id: number;
  name: string;
  photo_url: string;
  price: number;
  updated_at: string;
};

//Info: The following data is used for the sidebar navigation and Cmd K bar.
export const navItems: NavItem[] = [
  {
    icon: "dashboard",
    isActive: false,
    items: [],
    shortcut: ["d", "d"],
    title: "Dashboard",
    url: "/",
  },
  {
    icon: "settings",
    isActive: true,
    items: [
      {
        icon: "product",
        shortcut: ["r", "m"],
        title: "Rooms",
        url: "/rooms",
      },
    ],
    title: "Accommodations",
    url: "#",
  },
  {
    icon: "help",
    isActive: true,
    items: [
      {
        icon: "billing",
        shortcut: ["c", "q"],
        title: "Contact Queries",
        url: "/contact-queries",
      },
      {
        icon: "billing",
        shortcut: ["r", "b"],
        title: "Room Bookings",
        url: "/room-bookings",
      },
      {
        icon: "billing",
        shortcut: ["e", "b"],
        title: "Event Bookings",
        url: "/event-bookings",
      },
      {
        icon: "billing",
        shortcut: ["o", "b"],
        title: "Offer Bookings",
        url: "/offer-bookings",
      },
      {
        icon: "billing",
        shortcut: ["a", "b"],
        title: "Attraction Bookings",
        url: "/attraction-bookings",
      },
    ],
    title: "Queries",
    url: "#",
  },
  {
    icon: "post",
    isActive: true,
    items: [
      {
        icon: "post",
        shortcut: ["b", "l"],
        title: "Blogs",
        url: "/blogs",
      },
      {
        icon: "media",
        shortcut: ["g", "a"],
        title: "Gallery",
        url: "/gallery",
      },
      {
        icon: "help",
        shortcut: ["t", "s"],
        title: "Testimonials",
        url: "/testimonials",
      },
      {
        icon: "media",
        shortcut: ["n", "a"],
        title: "Nearby Attractions",
        url: "/nearby-attractions",
      },
    ],
    title: "Content",
    url: "#",
  },
  {
    icon: "kanban",
    isActive: true,
    items: [
      {
        icon: "tag",
        shortcut: ["o", "f"],
        title: "Offers",
        url: "/offers",
      },
      {
        icon: "calendar",
        shortcut: ["e", "v"],
        title: "Events",
        url: "/events",
      },
    ],
    title: "Marketing",
    url: "#",
  },
  {
    icon: "settings",
    isActive: true,
    items: [
      {
        icon: "media",
        shortcut: ["a", "m"],
        title: "Amenities",
        url: "/amenities",
      },
      {
        icon: "page",
        shortcut: ["p", "o"],
        title: "Policies",
        url: "/policies",
      },
      {
        icon: "help",
        shortcut: ["f", "a"],
        title: "FAQs",
        url: "/faqs",
      },
    ],
    title: "Master Data",
    url: "#",
  },
  {
    icon: "user",
    isActive: true,
    items: [
      {
        icon: "user",
        shortcut: ["u", "s"],
        title: "All Users",
        url: "/user",
      },
    ],
    title: "Users",
    url: "#",
  },
  {
    icon: "billing",
    isActive: true,
    items: [
      {
        icon: "userPen",
        shortcut: ["m", "m"],
        title: "Profile",
        url: "/profile",
      },
    ],
    title: "Account",
    url: "#",
  },
] as const;

export interface SaleUser {
  amount: string;
  email: string;
  id: number;
  image: string;
  initials: string;
  name: string;
}

