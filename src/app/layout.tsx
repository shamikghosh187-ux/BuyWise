import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BuyWise — Shop with clarity",
  description: "Discover, compare and evaluate products with shopping intelligence.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}