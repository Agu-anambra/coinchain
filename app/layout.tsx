import type { Metadata } from "next";
import "./globals.css";
// import './assets/css/style.css'
import localFont from "next/font/local";
import { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner"
import InstallPWA from "@/components/InstallPWA"
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import 'sonner'; 


const ibmPlexSans = localFont({
  src: [
    { path: "/fonts/IBMPlexSans-Regular.ttf", weight: "400", style: "normal" },
    { path: "/fonts/IBMPlexSans-Medium.ttf", weight: "500", style: "normal" },
    { path: "/fonts/IBMPlexSans-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "/fonts/IBMPlexSans-Bold.ttf", weight: "700", style: "normal" },
  ],
});

const bebasNeue = localFont({
  src: [
    { path: "/fonts/BebasNeue-Regular.ttf", weight: "400", style: "normal" },
  ],
  variable: "--bebas-neue",
});

export const metadata: Metadata = {
  title: "Coinchain - Invest, Buy & Sell Digital Assets In The Coinchain",
  description: "Coinchain is the easiest, safest, and fastest way to buy & sell crypto asset exchange.",
  manifest: "/manifest.json",
  // themeColor: "#000000",
  icons: {
    apple: "/assets/images/COINCHAIN.png",
    icon: "/assets/images/COINCHAIN.png",
  },
};

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();
  return (
    <html lang="en">
      <SessionProvider session={session}>
      <body
        className={`${ibmPlexSans.className} ${bebasNeue.variable} antialiased`}
      >
        <InstallPWA />
        {children}

        <Toaster richColors />
        {/* Add any additional components or scripts here */}
      </body>
      </SessionProvider>
    </html>
  );
};

export default RootLayout;
