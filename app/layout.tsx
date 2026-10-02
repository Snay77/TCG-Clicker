import type { Metadata } from "next";
import "./globals.css";
import "./polish.css";
import "./opening.css";
import "./progression.css";
import "./roster.css";
import "./economy.css";
import "./exploration.css";
export const metadata: Metadata = {
  title: "TCG Clicker · La Clairière",
  description:
    "Une machine, un monde à découvrir. Clicker et collection féerique.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
