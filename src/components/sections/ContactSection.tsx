"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { PERSONAL } from "@/lib/data";
import emailjs from "@emailjs/browser";

type FormState = "idle" | "sending" | "success" | "error";

export function ContactSection() {
  const [state, setState] = useState<FormState>("idle");
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("sending");

    emailjs
      .send(
        process.env.NEXT_PUBLIC_EMAIL_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAIL_SERVICE_TEMPLATE_ID!,
        {
          from_name: form.name,
          to_name: "Satvik",
          from_email: form.email,
          to_email: "satviksabharwal7@gmail.com",
          message: form.message,
        },
        process.env.NEXT_PUBLIC_EMAIL_SERVICE_PUBLIC_KEY!,
      )
      .then(
        () => {
          setState("success");

          setForm({
            name: "",
            email: "",
            message: "",
          });
        },
        (error) => {
          setState("error");
        },
      );
  };

  const SOCIAL_LINKS = [
    {
      label: "GitHub",
      href: PERSONAL.github,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
      ),
    },
    {
      label: "LinkedIn",
      href: PERSONAL.linkedin,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
    {
      label: "Email",
      href: `mailto:${PERSONAL.email}`,
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
  ];

  return (
    <SectionWrapper
      id="contact"
      label="05 / Contact"
      title="Let's Work Together"
      subtitle="Open to senior roles, contracts, and interesting conversations."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* LEFT */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="space-y-8"
        >
          <p className="text-white/40 text-lg leading-relaxed">
            I'm actively looking for my next challenge — whether that's joining
            a great team building ambitious products, or collaborating on
            something new. If you're building something I'd care about, let's
            talk.
          </p>

          <div className="space-y-3">
            <p className="text-xs font-mono tracking-widest text-white/20 uppercase">
              Reach me at
            </p>
            <a
              href={`mailto:${PERSONAL.email}`}
              className="text-accent-cyan font-display font-bold text-xl hover:brightness-125 transition-all"
            >
              {PERSONAL.email}
            </a>
          </div>

          <div className="flex gap-4">
            {SOCIAL_LINKS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 card-sci-fi rounded-xl flex items-center justify-center text-white/30 hover:text-white hover:border-white/20 transition-all duration-200"
                title={s.label}
              >
                {s.icon}
              </a>
            ))}
          </div>

          {/* Availability card */}
          <div className="card-sci-fi rounded-xl p-5 border-accent-cyan/10">
            <div className="flex items-center gap-3 mb-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-cyan opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-cyan" />
              </span>
              <span className="text-accent-cyan text-sm font-mono">
                Available for work
              </span>
            </div>
            <p className="text-white/30 text-xs leading-relaxed">
              Looking for senior/staff frontend roles, ideally remote or hybrid.
              Open to both full-time and freelance engagements. Response time:
              &lt; 24h.
            </p>
          </div>
        </motion.div>

        {/* RIGHT — Form */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
            {[
              {
                id: "name",
                label: "Name",
                type: "text",
                placeholder: "Your name",
              },
              {
                id: "email",
                label: "Email",
                type: "email",
                placeholder: "your@email.com",
              },
            ].map((field) => (
              <div key={field.id}>
                <label
                  htmlFor={field.id}
                  className="block text-xs font-mono text-white/30 uppercase tracking-widest mb-2"
                >
                  {field.label}
                </label>
                <input
                  id={field.id}
                  type={field.type}
                  placeholder={field.placeholder}
                  required
                  value={form[field.id as keyof typeof form]}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, [field.id]: e.target.value }))
                  }
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-white placeholder-white/20 font-body focus:outline-none focus:border-accent-cyan/40 focus:bg-white/[0.06] transition-all duration-200"
                />
              </div>
            ))}

            <div>
              <label
                htmlFor="message"
                className="block text-xs font-mono text-white/30 uppercase tracking-widest mb-2"
              >
                Message
              </label>
              <textarea
                id="message"
                rows={5}
                placeholder="Tell me about your project or opportunity..."
                required
                value={form.message}
                onChange={(e) =>
                  setForm((f) => ({ ...f, message: e.target.value }))
                }
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-white placeholder-white/20 font-body focus:outline-none focus:border-accent-cyan/40 focus:bg-white/[0.06] transition-all duration-200 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={state === "sending" || state === "success"}
              className={`w-full py-3.5 rounded-lg text-sm font-body font-medium tracking-wide transition-all duration-200 relative overflow-hidden ${
                state === "success"
                  ? "bg-green-500/20 border border-green-500/30 text-green-400"
                  : "bg-accent-cyan text-bg-primary hover:brightness-110 disabled:opacity-60"
              }`}
            >
              {state === "idle" && "Send Message"}
              {state === "sending" && (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeDasharray="31.4"
                      strokeDashoffset="10"
                      strokeLinecap="round"
                    />
                  </svg>
                  Sending...
                </span>
              )}
              {state === "success" && "✓ Message Sent!"}
              {state === "error" && "Failed — try again"}
            </button>
          </form>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
