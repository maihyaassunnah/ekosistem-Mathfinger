import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme";
import { AppStoreProvider } from "@/lib/store";
import AuthProvider from "@/components/providers/AuthProvider";
import AppSplashLoader from "@/components/ui/AppSplashLoader";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Easy Learning House - Les Mathfingers Jaritmatika",
  description:
    "Bimbingan belajar hitung cepat Jaritmatika Math Fingers & Easy Learning House untuk anak usia 4-12 tahun. Membuka potensi juara anak dengan formasi 10 jari tanpa kalkulator & sempoa.",
  icons: {
    icon: [
      { url: "/logo.png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/logo.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Easy Learning House",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${plusJakarta.variable} h-full antialiased font-sans`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-[#f0f6ff] text-[#0a192f] dark:bg-[#070d1e] dark:text-[#f8fafc] font-sans transition-colors duration-200">
        <AppSplashLoader />
        <AuthProvider>
          <ThemeProvider>
            <AppStoreProvider>{children}</AppStoreProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
