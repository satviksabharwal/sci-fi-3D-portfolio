import type { Metadata } from "next";

import "./globals.css";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { Navbar } from "@/components/ui/Navbar";
import { ParticleBackground } from "@/components/3d/ParticleBackground";

export const metadata: Metadata = {
  title: "Your Name — Frontend Engineer",
  description:
    "Frontend Engineer with 5+ years building exceptional web experiences. BSc CS · MSc Web Engineering.",
  keywords: ["frontend", "react", "nextjs", "typescript", "portfolio"],
  openGraph: {
    title: "Your Name — Frontend Engineer",
    description:
      "Frontend Engineer crafting extraordinary digital experiences.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-bg-primary text-slate-200 font-body antialiased">
        <CustomCursor />
        <ParticleBackground />
        <Navbar />
        <main className="relative z-10">{children}</main>
      </body>
    </html>
  );
}
