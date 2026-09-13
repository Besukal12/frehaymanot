"use client";

import Link from "next/link";
import React from "react";

export interface FooterLinkGroup {
  title: string;
  links: { label: string; href: string }[];
}

export interface FooterSocialItem {
  label: string;
  link: string;
}

export interface FooterProps {
  logoUrl?: string;
  tagline?: string;
  groups?: FooterLinkGroup[];
  socialItems?: FooterSocialItem[];
  accentColor?: string;
  colors?: string[];
  className?: string;
}

const defaultGroups: FooterLinkGroup[] = [
  {
    title: "Sitemap",
    links: [
      { label: "Home", href: "/" },
      { label: "Work", href: "/work" },
      { label: "About", href: "/about" },
      { label: "Services", href: "/services" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Careers", href: "/careers" },
      { label: "Case Studies", href: "/case-studies" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Team", href: "/team" },
      { label: "Press", href: "/press" },
      { label: "Partners", href: "/partners" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Cookies", href: "/cookies" },
    ],
  },
];

const defaultSocials: FooterSocialItem[] = [
  { label: "Twitter", link: "https://twitter.com" },
  { label: "Instagram", link: "https://instagram.com" },
  { label: "LinkedIn", link: "https://linkedin.com" },
];

export const Footer: React.FC<FooterProps> = ({
  logoUrl = "/logo.jpg",
  tagline = "Let's build something worth staggering over.",
  groups = defaultGroups,
  socialItems = defaultSocials,
  accentColor = "#5227FF",
  colors = ["#B497CF", "#5227FF"],
  className,
}) => {
  const year = new Date().getFullYear();

  return (
    <footer
      className={`sf-scope relative w-full overflow-hidden bg-black text-white ${className ?? ""}`}
      style={
        accentColor
          ? ({ ["--sf-accent" as any]: accentColor } as React.CSSProperties)
          : undefined
      }
    >
      {/* Gradient wash, echoes the menu's prelayer colors */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background: `radial-gradient(120% 140% at 100% 0%, ${colors[1] ?? "#5227FF"}33 0%, transparent 55%), radial-gradient(120% 140% at 0% 100%, ${colors[0] ?? "#B497CF"}22 0%, transparent 55%)`,
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1400px] px-[2em] pt-[4em]">
        {/* Big line, same oversized/tight-tracking treatment as the menu items */}
        <div className="border-b border-white/10 pb-[2em]">
          <p className="max-w-[16ch] text-[3.2rem] font-semibold uppercase leading-[0.95] tracking-[-2px] sm:max-w-[24ch] sm:text-[4rem]">
            {tagline}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-10 py-[3em] sm:grid-cols-3 lg:grid-cols-[1.2fr_repeat(4,auto)]">
          <div className="col-span-2 flex items-start sm:col-span-3 lg:col-span-1">
            <img
              src={logoUrl}
              alt="Logo"
              draggable={false}
              className="h-8 w-auto object-contain"
            />
          </div>

          {groups.map((group, gi) => (
            <nav
              key={group.title + gi}
              aria-label={group.title}
              className="min-w-[9em]"
            >
              <h3 className="mb-4 text-sm font-medium text-white/50">
                {group.title}
              </h3>
              <ul className="flex flex-col gap-2" role="list">
                {group.links.map((l, li) => (
                  <li
                    key={l.label + li}
                    className="sf-item-wrap relative overflow-hidden leading-none"
                  >
                    <Link
                      href={l.href}
                      className="sf-item relative inline-block pr-[1.4em] text-lg font-semibold uppercase leading-none tracking-[-0.5px] text-white no-underline transition-colors duration-150 ease-linear"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {socialItems && socialItems.length > 0 && (
          <div className="flex flex-wrap items-center gap-4 border-t border-white/10 py-[1.5em]">
            <span className="text-sm text-white/50">Elsewhere</span>
            <ul
              className="flex flex-row flex-wrap items-center gap-4"
              role="list"
            >
              {socialItems.map((s, i) => (
                <li key={s.label + i}>
                  <a
                    href={s.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="sf-social relative inline-block py-[2px] text-sm font-medium text-white/80 no-underline transition-colors duration-200 ease-linear"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-col gap-2 border-t border-white/10 py-[1.5em] text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <span>© {year} All rights reserved.</span>
          <span>Built with care.</span>
        </div>
      </div>

      <style>{`
.sf-scope .sf-item::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0.15em;
  width: 100%;
  height: 1px;
  background: currentColor;
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.35s ease;
}
.sf-scope .sf-item:hover { color: var(--sf-accent, #5227FF); }
.sf-scope .sf-item:hover::after { transform: scaleX(1); transform-origin: left; }

.sf-scope .sf-social:hover { color: var(--sf-accent, #5227FF); }

@media (max-width: 640px) {
  .sf-scope p { font-size: 2.2rem; }
}
      `}</style>
    </footer>
  );
};

export default Footer;
