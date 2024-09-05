import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Whot | Play Whot online!",
  description: "Play Whot online",
  openGraph: {
    title: "Whot | Play Whot online!",
    description: "Play Whot online aganist friends, family and other players online",
    type: "website",
    locale: 'en_US',
    siteName: 'Whot | Play Whot',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}
        <Toaster/>
      </body>
    </html>
  );
}
