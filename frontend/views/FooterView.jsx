/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Frontend View: FooterView (V in MVC)
 */
import { ArrowUp, FileDown, Github, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { EliyasLogo } from "../components/EliyasLogo";

const FooterView = ({ onSelectTab, onOpenCV }) => {
  const navSections = [
    { id: "projects", label: "Projects" },
    { id: "skills", label: "Skills" },
    { id: "experience", label: "Experience" },
    { id: "certificates", label: "Certificates" },
    { id: "about", label: "About" },
    { id: "contact", label: "Contact" }
  ];

  return (
    <footer className="relative mt-20 overflow-hidden border-t border-white/10 bg-[#083785] text-white">
      <div className="pointer-events-none absolute inset-0 bg-radial-[at_top_right] from-blue-700/20 via-transparent to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
        <div className="grid gap-10 border-b border-white/15 pb-10 md:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_1fr] lg:gap-12">
          <section aria-label="About Eliyas">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl">
                <EliyasLogo className="h-full w-full" />
              </div>
              <div>
                <h2 className="font-display text-lg font-bold tracking-tight text-white">
                  Eliyas Wakjira
                </h2>
                <p className="text-sm text-blue-200">Full-Stack Developer</p>
              </div>
            </div>

            <p className="mt-4 max-w-sm text-sm leading-6 text-blue-100/90">
              Building thoughtful web experiences with reliable, modern technology.
            </p>

            <div className="mt-5 flex items-center gap-3">
              <a
                href="https://github.com/Eliyas-wakjira"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white transition-colors hover:bg-white hover:text-[#083785]"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/eliyas-wakjira-b13650137"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white transition-colors hover:bg-white hover:text-[#083785]"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="mailto:info@eliyastech.com"
                aria-label="Email Eliyas"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white transition-colors hover:bg-white hover:text-[#083785]"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </section>

          <nav aria-label="Footer navigation">
            <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-[#ECC257]">
              Explore
            </h3>
            <ul className="mt-4 grid grid-cols-2 gap-x-5 gap-y-3 text-sm text-blue-100">
              {navSections.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => onSelectTab(item.id)}
                    className="cursor-pointer text-left transition-colors hover:text-white"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <section aria-label="Contact information">
            <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-[#ECC257]">
              Get in touch
            </h3>
            <a
              href="mailto:info@eliyastech.com"
              className="mt-4 flex w-fit items-center gap-2 text-sm text-blue-100 transition-colors hover:text-white"
            >
              <Mail className="h-4 w-4 shrink-0 text-[#ECC257]" />
              info@eliyastech.com
            </a>
            <a
              href="tel:+251919501238"
              className="mt-3 flex w-fit items-center gap-2 text-sm text-blue-100 transition-colors hover:text-white"
            >
              <Phone className="h-4 w-4 shrink-0 text-[#ECC257]" />
              +251 919 501 238
            </a>
            <p className="mt-3 flex items-center gap-2 text-sm text-blue-100">
              <MapPin className="h-4 w-4 shrink-0 text-[#ECC257]" />
              Addis Ababa, Ethiopia
            </p>
            <button
              onClick={onOpenCV}
              className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#C33E1F] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#a83219]"
            >
              <FileDown className="h-4 w-4" />
              Download CV
            </button>
          </section>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 pt-6 text-sm text-blue-200 sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} Eliyas Wakjira. All rights reserved.
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex cursor-pointer items-center gap-2 transition-colors hover:text-white"
          >
            Back to top
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export { FooterView };
