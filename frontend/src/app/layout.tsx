import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import ToastProvider from "@/lib/react-toastify/ToastProvider";
import 'react-toastify/dist/ReactToastify.css';
import { Suspense } from "react";
import Loading from "./loading";
import { StoreProvider } from "./StoreProvider";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AudioPhile",
  description: "AudioPhile",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <StoreProvider>
      <html lang="en" >
        <body className={`${manrope.variable} antialiased`}>
          <Suspense fallback={<Loading />}>
            <ToastProvider>
              {children}
            </ToastProvider>
          </Suspense>
        </body>
      </html>
    </StoreProvider>
  );
}


