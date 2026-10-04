import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./polish.css";
import "./opening.css";
import "./progression.css";
import "./roster.css";
import "./economy.css";
import "./exploration.css";
import "./ux.css";
import "./alpha.css";
import "./mobile.css";
import "./boosters.css";
export const metadata: Metadata = {
  applicationName: 'TCG Clicker',
  appleWebApp: { capable: true, title: 'TCG Clicker', statusBarStyle: 'black-translucent' },
  icons: { apple: '/icons/apple-touch-icon.png' },
  title: "TCG Clicker — Faerie",
  description:
    "Une machine, un monde à découvrir. Clicker et collection féerique.",
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#192c36' };
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
