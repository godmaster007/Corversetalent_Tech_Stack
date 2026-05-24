import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Corversetalent | Operations Platform",
  description: "Custom GTM Recruiting & Operations Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
