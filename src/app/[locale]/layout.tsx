import { NextIntlClientProvider, hasLocale } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { DM_Sans, JetBrains_Mono, Manrope } from "next/font/google";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "@/app/globals.css";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { Navbar } from "@/components/ui/Navbar";
import { ParticleBackground } from "@/components/3d/ParticleBackground";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { MissionHud } from "@/components/ui/MissionHud";
import { PERSONAL, SITE_URL } from "@/lib/data";
import type { Metadata } from "next";

const display = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-dm-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const OG_LOCALES: Record<string, string> = { en: "en_US", de: "de_DE" };

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const title = t("title");
  const description = t("description");

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: title,
      template: `%s | ${PERSONAL.name}`,
    },
    description,
    authors: [{ name: PERSONAL.name, url: SITE_URL }],
    creator: PERSONAL.name,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        ...Object.fromEntries(routing.locales.map((l) => [l, `/${l}`])),
        // Matches the Link header next-intl's middleware sends: the bare
        // root negotiates the locale, which is what x-default is for.
        "x-default": "/",
      },
    },
    openGraph: {
      type: "profile",
      url: `/${locale}`,
      siteName: PERSONAL.name,
      title,
      description,
      locale: OG_LOCALES[locale],
      alternateLocale: routing.locales
        .filter((l) => l !== locale)
        .map((l) => OG_LOCALES[l]),
      firstName: "Satvik",
      lastName: "Sabharwal",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { "max-image-preview": "large", "max-snippet": -1 },
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  // Opts the locale branch into static rendering.
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`scroll-smooth ${display.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
    >
      <body className="bg-bg-primary text-slate-200 font-body antialiased">
        <NextIntlClientProvider messages={messages}>
          <CustomCursor />
          <ParticleBackground />
          <Navbar />
          <MissionHud />
          <main className="relative z-10">{children}</main>
          <ChatWidget />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
