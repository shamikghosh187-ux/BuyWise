import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ShopIntel — Buy Smarter. Not Harder.",
  description: "An AI-powered shopping decision assistant to discover products, compare offers and make confident buying decisions."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
