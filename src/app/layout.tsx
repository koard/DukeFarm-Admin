import type { Metadata } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import "./globals.css";
import Sidebar from "../components/layout/Sidebar";
import { Toaster } from "react-hot-toast";

const notoSansThai = Noto_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-noto-sans-thai",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Duke Farm Admin",
  description: "Management System for Duke Farm",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className={notoSansThai.className}>
        <Toaster position="top-center" />
        
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 ml-0 lg:ml-64 transition-all duration-300 p-0 bg-[#F9FAFB] w-full min-w-0">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}