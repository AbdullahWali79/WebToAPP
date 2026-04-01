import type { Metadata } from "next";
import "@/app/globals.css";
import { ToastProvider } from "@/components/ToastProvider";

export const metadata: Metadata = {
  title: "WebToAPP | Website to Android APK",
  description:
    "SaaS starter for converting websites into Android wrapper APK workflows."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element {
  return (
    <html lang="en">
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
