import type { Metadata } from "next";
import { Barlow, Barlow_Condensed, IBM_Plex_Sans_Arabic } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const plexArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-plex-arabic",
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Almoayyed Computers · Internship Management System",
  description: "FirstTrack Internship Management System",
};

// Set theme + language before paint to avoid a flash (ported from acme-ims-login.html)
const bootScript = `
(function(){
  try{
    var t = localStorage.getItem('acme-theme') || 'dark';
    var l = localStorage.getItem('acme-lang')  || 'en';
    var r = document.documentElement;
    r.setAttribute('data-theme', t);
    r.setAttribute('lang', l);
    r.setAttribute('dir', l === 'ar' ? 'rtl' : 'ltr');
  }catch(e){}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body className={`${barlow.variable} ${barlowCondensed.variable} ${plexArabic.variable} antialiased`} suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
