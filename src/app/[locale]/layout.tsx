import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { redirect } from "next/navigation";
import { routing } from "@/i18n/routing";
import "@/app/globals.css";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { Navbar } from "@/components/ui/Navbar";
import { ParticleBackground } from "@/components/3d/ParticleBackground";
import type { Metadata } from "next";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = routing.locales.includes(
    localeParam as (typeof routing.locales)[number],
  )
    ? localeParam
    : "en";

  return {
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
  const { locale: localeParam } = await params;
  const locale = routing.locales.includes(
    localeParam as (typeof routing.locales)[number],
  )
    ? localeParam
    : "en";

  if (locale !== localeParam) {
    redirect("/en");
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className="scroll-smooth">
      <body className="bg-bg-primary text-slate-200 font-body antialiased">
        <NextIntlClientProvider messages={messages}>
          <CustomCursor />
          <ParticleBackground />
          <Navbar />
          <main className="relative z-10">{children}</main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
