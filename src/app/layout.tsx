import { GeneralLayout } from "@/providers";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KIPL - Store Management System",
  description: "Store Management System developed by www.devverse.io",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GeneralLayout>{children}</GeneralLayout>
      </body>
    </html>
  );
}
