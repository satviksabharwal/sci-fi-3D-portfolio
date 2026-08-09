import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import Script from "next/script";
import { routing } from "@/i18n/routing";
import "@/app/globals.css";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { Navbar } from "@/components/ui/Navbar";
import { ParticleBackground } from "@/components/3d/ParticleBackground";
import { ChatWidget } from "@/components/chat/ChatWidget";
import type { Metadata } from "next";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "hero" });

  return {
    title: {
      default: "Satvik Sabharwal | Frontend-Focused Full-Stack Developer",
      template: "%s | Satvik Sabharwal",
    },
    description: t("bio"),
    alternates: {
      canonical: `https://satviksabharwal.com/${locale}`,
      languages: {
        en: "https://satviksabharwal.com/en",
        de: "https://satviksabharwal.com/de",
      },
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale} className="scroll-smooth">
      <body className="bg-bg-primary text-slate-200 font-body antialiased">
        <NextIntlClientProvider messages={messages}>
          <CustomCursor />
          <ParticleBackground />
          <Navbar />
          <main className="relative z-10">{children}</main>
          <ChatWidget />
        </NextIntlClientProvider>
        {/* Runway video twin — renders its own floating button (portal
            placement: bottom LEFT, auto-expand OFF). Chat stays bottom right. */}
        {process.env.NEXT_PUBLIC_RUNWAY_PUB_KEY && (
          <Script
            src="https://cdn.dev.runwayml.com/prod/widget.js"
            data-pub-key={process.env.NEXT_PUBLIC_RUNWAY_PUB_KEY}
            strategy="lazyOnload"
          />
        )}
      </body>
    </html>
  );
}
