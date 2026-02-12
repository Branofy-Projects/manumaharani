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
        shortcut: ["r", "t"],
        title: "Room Types",
        url: "/room-types",
      },
      {
        icon: "product",
        shortcut: ["r", "m"],
        title: "Rooms",
        url: "/rooms",
      },
      {
        icon: "billing",
        shortcut: ["b", "k"],
        title: "Bookings",
        url: "/bookings",
      },
    ],
    title: "Accommodations",
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
    icon: "billing",
    isActive: true,
    items: [
      {
        icon: "billing",
        shortcut: ["o", "b"],
        title: "Offer Bookings",
        url: "/offer-bookings",
      },
      {
        icon: "calendar",
        shortcut: ["e", "b"],
        title: "Event Bookings",
        url: "/event-bookings",
      },
      {
        icon: "help",
        shortcut: ["c", "q"],
        title: "Contact Queries",
        url: "/contact-queries",
      },
    ],
    title: "Queries & Bookings",
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

export const recentSalesData: SaleUser[] = [
  {
    amount: "+$1,999.00",
    email: "olivia.martin@email.com",
    id: 1,
    image: "https://api.slingacademy.com/public/sample-users/1.png",
    initials: "OM",
    name: "Olivia Martin",
  },
  {
    amount: "+$39.00",
    email: "jackson.lee@email.com",
    id: 2,
    image: "https://api.slingacademy.com/public/sample-users/2.png",
    initials: "JL",
    name: "Jackson Lee",
  },
  {
    amount: "+$299.00",
    email: "isabella.nguyen@email.com",
    id: 3,
    image: "https://api.slingacademy.com/public/sample-users/3.png",
    initials: "IN",
    name: "Isabella Nguyen",
  },
  {
    amount: "+$99.00",
    email: "will@email.com",
    id: 4,
    image: "https://api.slingacademy.com/public/sample-users/4.png",
    initials: "WK",
    name: "William Kim",
  },
  {
    amount: "+$39.00",
    email: "sofia.davis@email.com",
    id: 5,
    image: "https://api.slingacademy.com/public/sample-users/5.png",
    initials: "SD",
    name: "Sofia Davis",
  },
];
