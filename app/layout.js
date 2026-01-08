import "./globals.css";

export const metadata = {
  title: "TheCurveF",
  description: "Ace your matric. Get into university.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
