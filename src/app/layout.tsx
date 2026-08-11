import type { Metadata } from "next";
import { Cinzel, Josefin_Sans } from "next/font/google";
import { ExperienceProviders } from "@/components/providers/ExperienceProviders";
import "./globals.css";

const josefinSans = Josefin_Sans({
  variable: "--font-josefin",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://erdemdizaynmekanik.com"),
  title: {
    default: "Erdem Dizayn & Mekanik | İç Mimarlık, Mekanik ve Anahtar Teslim",
    template: "%s | Erdem Dizayn & Mekanik",
  },
  description:
    "İç mimari tasarım, mekanik çözümler, tadilat ve anahtar teslim uygulama süreçlerini keşiften teslime tek elden yöneten Erdem Dizayn & Mekanik.",
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
    title: "Erdem Dizayn & Mekanik | İç Mimarlık ve Anahtar Teslim Uygulama",
    description:
      "Konut, ofis ve ticari alanlarda iç mimari, mekanik koordinasyon ve uygulamayı tek merkezden yöneten profesyonel ekip.",
    url: "https://erdemdizaynmekanik.com",
    siteName: "Erdem Dizayn & Mekanik",
    locale: "tr_TR",
    type: "website",
    images: [
      {
        url: "/images/project-1.jpg",
        alt: "Erdem Dizayn iç mimari proje atmosferi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Erdem Dizayn & Mekanik | İç Mimarlık ve Anahtar Teslim Uygulama",
    description:
      "Keşiften teslime iç mimari, mekanik koordinasyon ve uygulama süreçleri.",
    images: ["/images/project-1.jpg"],
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
      className={`${josefinSans.variable} ${cinzel.variable} h-full scroll-smooth antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[#151310] font-sans text-[#171717] selection:bg-[#a0613a] selection:text-white">
        <ExperienceProviders>{children}</ExperienceProviders>
      </body>
    </html>
  );
}
