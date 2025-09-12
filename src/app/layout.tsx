import { EmailStoreProvider } from "@/providers/email-store-provider";
import { GlobalProvider } from "@/providers/global-provider";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import "./styles/globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Cleanse Gmail",
  description: "Cleanse your Gmail inbox",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`${geistSans.className} ${geistMono.variable} antialiased w-full`}
      >
        <NuqsAdapter>
          <GlobalProvider>
            <EmailStoreProvider>{children}</EmailStoreProvider>
          </GlobalProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
