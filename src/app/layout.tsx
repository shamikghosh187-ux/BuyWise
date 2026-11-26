import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BuyWise — Make the smarter buy",
  description: "A calmer way to research, compare and choose your next phone or laptop."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
