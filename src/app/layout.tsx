import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Cinzel } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Erdem Dizayn & Mekanik | Tasarımdan Uygulamaya Güvenilir Çözümler",
  description:
    "Mimari tasarım ile mühendisliği aynı çizgide buluşturuyor; fikrin ilk eskizinden uygulamanın son detayına kadar bütüncül çözümler üretiyoruz. Kurucu: Erdem Çeken.",
  keywords: [
    "Erdem Dizayn",
    "Erdem Mekanik",
    "Erdem Çeken",
    "Mimari Tasarım",
    "Mekanik Mühendislik",
    "İç Mimari",
    "HVAC",
    "VRV İklimlendirme",
    "Sıhhi Tesisat",
    "Yangın Sistemleri",
    "Uygulama ve Taahhüt",
    "3D Mimari Showroom"
  ],
  authors: [{ name: "Erdem Çeken" }],
  openGraph: {
    title: "Erdem Dizayn & Mekanik | Mimari & Mekanik Mühendislik",
    description: "Tasarımdan Uygulamaya Güvenilir Çözümler.",
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
      className={`${plusJakartaSans.variable} ${cinzel.variable} scroll-smooth h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#F6F2EA] text-[#171717] font-sans selection:bg-[#9A5C2F] selection:text-white">
        {children}
      </body>
    </html>
  );
}
