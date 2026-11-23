import type { Metadata } from "next";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Display serif: wide, steady proportions with lining figures; the optical-size
// axis gives large headlines finer detail automatically.
const displaySerif = Newsreader({
  variable: "--font-display-serif",
  style: ["normal", "italic"],
  axes: ["opsz"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Blue Rings",
  description: "A personal prediction-market portfolio: track record, profit and investment logic.",
  // The site is private: keep it out of search engines.
  robots: { index: false, follow: false, nocache: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${displaySerif.variable} h-full antialiased`}
    >
      <head>
        {/* Lets CSS hide scroll-reveal content only when JavaScript can reveal it again. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
