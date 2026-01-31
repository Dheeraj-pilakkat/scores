import type { Metadata } from "next";
import "./globals.css";

import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: "Malabar cet union 2K25-26 Scoreboard",
  description: "Dynamic scoreboard for Arts, Sports, and Games",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
