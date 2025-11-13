import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Blockbuster Revival",
  description: "Step inside a 3D blockbuster movie rental experience recreated for the web."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
