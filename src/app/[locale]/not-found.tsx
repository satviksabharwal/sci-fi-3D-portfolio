import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <section className="min-h-screen flex items-center justify-center px-6 grid-bg">
      <div className="text-center max-w-lg">
        <p className="text-accent-cyan text-xs tracking-[0.2em] uppercase font-mono mb-4">
          {t("label")}
        </p>
        <h1 className="font-display font-black text-4xl md:text-5xl tracking-tight mb-4 gradient-text">
          {t("title")}
        </h1>
        <p className="text-white/40 text-lg mb-10">{t("description")}</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 border border-accent-cyan/40 text-accent-cyan text-xs tracking-widest uppercase font-body hover:bg-accent-cyan hover:text-bg-primary transition-all duration-200 rounded-sm"
        >
          {t("backHome")}
        </Link>
      </div>
    </section>
  );
}
