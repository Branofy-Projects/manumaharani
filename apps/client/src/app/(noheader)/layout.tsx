import "../globals.css";

import { Head } from "next/document";

import { fontVariables } from "@/lib/fonts";

import type { Metadata } from "next";


export const metadata: Metadata = {
  appleWebApp: {
    title: "Manumaharani",
  },
  description: "Beautifully poised between the iconic Bijrani, Garjia and Dhikala gates, Manu Maharani Resort & Spa is your best gateway to the raw majesty of Jim Corbett National Park. Wake up to the rhythmic melody of the gurgling Kosi River and the gentle mountain breeze to lose yourself in nature's quiet luxury.",
  title: "Manu Maharani Resorts & Spa I Luxury Riverside Resort in Jim Corbett"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={fontVariables}
      >
        {children}
      </body>
    </html>
  );
}
