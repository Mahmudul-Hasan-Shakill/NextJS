import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import AuthProvider from "@/components/auth-provider";

export const metadata: Metadata = {
  title: {
    default: "IMS | BBL",
    template: "%s | BBL",
  },
  description: "Developed by Core Systems",
};

const Inter = localFont({
  src: [
    {
      path: "../../public/fonts/Inter/Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/Inter/Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Inter/Medium.ttf",
      weight: "500",
      style: "normal",
    },
  ],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html lang="en" suppressHydrationWarning className={Inter.className}>
        <head />
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AuthProvider>
              {children}
              <Toaster position="top-right" richColors />
            </AuthProvider>
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
