import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap"
});

export const metadata: Metadata = {
  title: {
    default: "Eagle Courier — Parcel & Cargo Delivery across Rwanda",
    template: "%s · Eagle Courier"
  },
  description:
    "Send parcels and cargo between Kigali, Huye, Musanze and beyond. Register at any branch, track every move in real time, and collect with ID verification.",
  icons: { icon: "/logo-mark.svg" },
  openGraph: {
    title: "Eagle Courier — Parcel & Cargo Delivery across Rwanda",
    description:
      "Register a parcel at any branch, track it with a code or QR, and collect it with ID verification.",
    type: "website",
    locale: "en_RW"
  }
};

/* Applies the saved theme before paint to avoid a white flash */
const themeInit = `(function(){try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark"){t=window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.setAttribute("data-theme",t)}catch(e){}})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className={`${inter.variable} ${jakarta.variable}`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
