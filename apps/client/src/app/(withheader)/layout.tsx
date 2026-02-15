import "../globals.css";

import localFont from "next/font/local";
import { Suspense } from "react";

import Footer from "@/components/Footer";
import { Header } from "@/components/Header";
import { fontVariables } from "@/lib/fonts";

import type { Metadata, Viewport } from "next";



export const viewport: Viewport = {
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  width: "device-width",
};

export const metadata: Metadata = {
  appleWebApp: {
    title: "Manumaharani",
  },
  description: "Beautifully poised between the iconic Bijrani, Garjia and Dhikala gates, Manu Maharani Resort & Spa is your best gateway to the raw majesty of Jim Corbett National Park. Wake up to the rhythmic melody of the gurgling Kosi River and the gentle mountain breeze to lose yourself in nature's quiet luxury.",
  title: "Manu Maharani Resorts & Spa I Luxury Riverside Resort in Jim Corbett",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://ik.imagekit.io" rel="preconnect" />
        <link href="https://ik.imagekit.io" rel="dns-prefetch" />
        <link href="https://storage.googleapis.com" rel="preconnect" />
        <link href="https://storage.googleapis.com" rel="dns-prefetch" />
      </head>
      <meta content="Manumaharani" name="apple-mobile-web-app-title" />
      <body
        className={fontVariables}
      >
        <Suspense>
          <Header />
        </Suspense>
        {children}
        <Footer />
      </body>
    </html>
  );
}
