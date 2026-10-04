import { getTranslations, setRequestLocale } from "next-intl/server";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { Footer } from "@/components/ui/Footer";
import { routing } from "@/i18n/routing";
import { EXPERIENCE, PERSONAL, SITE_URL, SKILLS } from "@/lib/data";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "metadata" });

  const [city, country] = PERSONAL.location.split(", ");
  const currentJob = EXPERIENCE.find((e) => e.current);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        name: PERSONAL.name,
        url: SITE_URL,
        image: `${SITE_URL}/satvik-avatar.jpg`,
        email: `mailto:${PERSONAL.email}`,
        description: t("description"),
        ...(currentJob && {
          jobTitle: currentJob.role,
          worksFor: { "@type": "Organization", name: currentJob.company },
        }),
        address: {
          "@type": "PostalAddress",
          addressLocality: city,
          addressCountry: country,
        },
        sameAs: [PERSONAL.github, PERSONAL.linkedin],
        knowsAbout: SKILLS.map((s) => s.name),
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: PERSONAL.name,
        inLanguage: routing.locales,
        publisher: { "@id": `${SITE_URL}/#person` },
      },
      {
        "@type": "ProfilePage",
        "@id": `${SITE_URL}/${locale}#profile`,
        url: `${SITE_URL}/${locale}`,
        name: t("title"),
        inLanguage: locale,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        mainEntity: { "@id": `${SITE_URL}/#person` },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <ExperienceSection />
      <ContactSection />
      <Footer />
    </>
  );
}
