/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Component: TechLogo
 * Renders authentic, pixel-perfect official brand vector logos for all technologies in the stack:
 * Next.js, React, JavaScript, TypeScript, Tailwind CSS, Node.js, Express.js,
 * MySQL, Docker, AWS, Ubuntu/Linux, Git/GitHub, Python, PostgreSQL, MongoDB, Redis, GraphQL, NGINX.
 */
import { useState } from "react";
import { Cpu } from "lucide-react";

// Canonical mapping of technology IDs / aliases to real vector SVG assets
export const TECH_LOGO_MAP = {
  nextjs: "/assets/tech-logos/nextjs.svg",
  react: "/assets/tech-logos/react.svg",
  javascript: "/assets/tech-logos/javascript.svg",
  typescript: "/assets/tech-logos/typescript.svg",
  tailwindcss: "/assets/tech-logos/tailwindcss.svg",
  tailwind: "/assets/tech-logos/tailwindcss.svg",
  nodejs: "/assets/tech-logos/nodejs.svg",
  node: "/assets/tech-logos/nodejs.svg",
  express: "/assets/tech-logos/express.svg",
  expressjs: "/assets/tech-logos/express.svg",
  mysql: "/assets/tech-logos/mysql.svg",
  docker: "/assets/tech-logos/docker.svg",
  aws: "/assets/tech-logos/aws.svg",
  amazon: "/assets/tech-logos/aws.svg",
  ubuntu: "/assets/tech-logos/ubuntu.svg",
  linux: "/assets/tech-logos/linux.svg",
  git: "/assets/tech-logos/git.svg",
  github: "/assets/tech-logos/github.svg",
  python: "/assets/tech-logos/python.svg",
  postgresql: "/assets/tech-logos/postgresql.svg",
  postgres: "/assets/tech-logos/postgresql.svg",
  mongodb: "/assets/tech-logos/mongodb.svg",
  redis: "/assets/tech-logos/redis.svg",
  graphql: "/assets/tech-logos/graphql.svg",
  nginx: "/assets/tech-logos/nginx.svg"
};

/**
 * Resolves the real logo SVG URL for any tech object or name string
 */
export function getTechLogoUrl(tech) {
  if (!tech) return null;
  if (typeof tech === "string") {
    const raw = tech.toLowerCase().trim();
    for (const [key, url] of Object.entries(TECH_LOGO_MAP)) {
      if (raw.includes(key)) return url;
    }
    return null;
  }

  // Explicit custom logo/icon URL
  if (tech.logo_url) return tech.logo_url;
  if (tech.icon_url) return tech.icon_url;
  if (tech.iconUrl) return tech.iconUrl;

  const id = String(tech.id != null ? tech.id : "").toLowerCase().trim();
  const name = String(tech.name != null ? tech.name : "").toLowerCase().trim();

  // Match by ID first
  if (id && TECH_LOGO_MAP[id]) return TECH_LOGO_MAP[id];

  // Match by keyword in name or id
  for (const [key, url] of Object.entries(TECH_LOGO_MAP)) {
    if ((name && name.includes(key)) || (id && id.includes(key))) {
      return url;
    }
  }

  // Also check technologies array if present (legacy format)
  if (Array.isArray(tech.technologies)) {
    for (const sub of tech.technologies) {
      const subKey = String(sub).toLowerCase();
      for (const [key, url] of Object.entries(TECH_LOGO_MAP)) {
        if (subKey.includes(key)) return url;
      }
    }
  }

  return null;
}

export const TechLogo = ({ tech, className = "w-9 h-9", alt }) => {
  const [hasError, setHasError] = useState(false);
  const logoUrl = getTechLogoUrl(tech);
  const displayName = typeof tech === "string" ? tech : tech?.name || "Technology";

  if (logoUrl && !hasError) {
    return (
      <img
        src={logoUrl}
        alt={alt || `${displayName} official logo`}
        className={`${className} object-contain select-none`}
        referrerPolicy="no-referrer"
        loading="eager"
        onError={() => setHasError(true)}
      />
    );
  }

  // If tech has an explicit iconSvg element passed
  if (tech?.iconSvg) {
    return <div className={`${className} flex items-center justify-center`}>{tech.iconSvg}</div>;
  }

  // Fallback to stylized Lucide icon
  return (
    <div className={`${className} flex items-center justify-center text-[#083785]`}>
      <Cpu className="w-full h-full" />
    </div>
  );
};

export default TechLogo;
