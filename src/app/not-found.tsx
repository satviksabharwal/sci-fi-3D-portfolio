import "@/app/globals.css";
import { routing } from "@/i18n/routing";

// Reached only by requests the middleware skips (paths containing a dot),
// so there is no locale layout around it — it must render its own document.
export default function GlobalNotFound() {
  return (
    <html lang={routing.defaultLocale}>
      <body
        className="bg-bg-primary text-slate-200 font-body antialiased"
        style={{ cursor: "auto" }}
      >
        <main className="min-h-screen flex items-center justify-center px-6 grid-bg">
          <div className="text-center max-w-lg">
            <p className="text-accent-cyan text-xs tracking-[0.2em] uppercase font-mono mb-4">
              404
            </p>
            <h1 className="font-display font-black text-4xl md:text-5xl tracking-tight mb-4 gradient-text">
              Page not found
            </h1>
            <p className="text-white/40 text-lg mb-10">
              This page does not exist or has moved.
            </p>
            <a
              href={`/${routing.defaultLocale}`}
              className="inline-flex items-center gap-2 px-6 py-3 border border-accent-cyan/40 text-accent-cyan text-xs tracking-widest uppercase font-body hover:bg-accent-cyan hover:text-bg-primary transition-all duration-200 rounded-sm"
              style={{ cursor: "pointer" }}
            >
              Back to home
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
