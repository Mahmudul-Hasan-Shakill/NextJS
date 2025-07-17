import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import AuthProvider from "@/components/auth-provider";
import CommonLoader from "@/components/loader/commonLoader";

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
    <html lang="en" suppressHydrationWarning className={Inter.className}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>

      <body suppressHydrationWarning={true} className="overflow-x-hidden">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CommonLoader>
            <AuthProvider>
              {children}
              <Toaster position="top-right" richColors />
            </AuthProvider>
          </CommonLoader>
        </ThemeProvider>
      </body>
    </html>
  );
}
