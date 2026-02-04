export const dynamic = "force-dynamic";
export const revalidate = 0;

import "./globals.css";

/* Viewport config (NEW place for themeColor) */
export const viewport = {
  themeColor: "#0F4C5C",
};

/* Metadata */
export const metadata = {
  title: {
    default: "TheCurveF",
    template: "%s | TheCurveF",
  },
  description: "Ace your matric. Get into university.",
  applicationName: "TheCurveF",

  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },

  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased bg-white text-gray-900">
        {children}
      </body>
    </html>
  );
}
