import type { Metadata } from "next";
import { Cinzel, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Erdem Dizayn & Mekanik | Tasarımdan Uygulamaya Güvenilir Çözümler",
  description:
    "İç mimari tasarım, mekanik çözümler, tadilat ve anahtar teslim uygulama süreçlerini tek elden yöneten premium tasarım ve uygulama hizmeti.",
  keywords: [
    "Erdem Dizayn",
    "Erdem Mekanik",
    "Erdem Çeken",
    "İç Mimari",
    "Mekanik Çözümler",
    "Tadilat",
    "Yenileme",
    "Anahtar Teslim",
    "Uygulama",
    "Mekân Tasarımı",
  ],
  authors: [{ name: "Erdem Çeken" }],
  openGraph: {
    title: "Erdem Dizayn & Mekanik | Tasarım · Mekanik · Uygulama",
    description: "Tasarımdan uygulamaya güvenilir çözümler.",
    url: "https://erdemdizaynmekanik.com",
    siteName: "Erdem Dizayn & Mekanik",
    locale: "tr_TR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${plusJakartaSans.variable} ${cinzel.variable} h-full scroll-smooth antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[#F6F2EA] font-sans text-[#171717] selection:bg-[#9A5C2F] selection:text-white">
        {children}
      </body>
    </html>
  );
}
