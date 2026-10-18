/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Frontend View: TechnologyExpertiseView (V in MVC)
 * Features:
 * 1. Background image backdrop (tech network & data node matrix)
 * 2. Vertical columns (oliif gadi) moving in opposite directions (odd up, even down)
 * 3. REAL OFFICIAL BRAND LOGOS for all stack items (Next.js, React, Node.js, Express, MySQL, Docker, AWS, Ubuntu, Git, etc.)
 * 4. Minimized bloat text for maximum visual clarity & performance
 * 5. Interactive selection inspector & marquee pause/play control
 */
import { useState, useEffect } from "react";
import { PortfolioController } from "../controllers/portfolioController";
import { TechLogo } from "../components/TechLogo";
import { ArrowRight, Cloud, Cpu, Database, Layers3, Server } from "lucide-react";

const TECHNOLOGY_ITEMS = [
  {
    id: "nextjs",
    name: "Next.js 15",
    category: "frontend",
    categoryLabel: "Frontend & SSR",
    role: "Server Components, App Router & Static Generation",
    color: "#000000",
    logo_url: "/assets/tech-logos/nextjs.svg"
  },
  {
    id: "react",
    name: "React 19",
    category: "frontend",
    categoryLabel: "Frontend UI",
    role: "Concurrent Mode, Custom Hooks & Reactive State",
    color: "#61DAFB",
    logo_url: "/assets/tech-logos/react.svg"
  },
  {
    id: "javascript",
    name: "JavaScript",
    category: "frontend",
    categoryLabel: "Core Language",
    role: "Modern ESNext, Async Event Loop & Functional Architecture",
    color: "#F7DF1E",
    logo_url: "/assets/tech-logos/javascript.svg"
  },
  {
    id: "typescript",
    name: "TypeScript",
    category: "frontend",
    categoryLabel: "Type Safety",
    role: "Generics, Strict Type Contracts & Compiler Tooling",
    color: "#3178C6",
    logo_url: "/assets/tech-logos/typescript.svg"
  },
  {
    id: "tailwindcss",
    name: "Tailwind CSS",
    category: "frontend",
    categoryLabel: "Styling System",
    role: "Utility-First Tokens, Responsive Viewports & Modern Grid",
    color: "#38BDF8",
    logo_url: "/assets/tech-logos/tailwindcss.svg"
  },
  {
    id: "nodejs",
    name: "Node.js",
    category: "backend",
    categoryLabel: "Backend Runtime",
    role: "V8 Async Non-blocking I/O, Streams & Core Microservices",
    color: "#339933",
    logo_url: "/assets/tech-logos/nodejs.svg"
  },
  {
    id: "express",
    name: "Express.js",
    category: "backend",
    categoryLabel: "Backend Framework",
    role: "Decoupled MVC Routing, JWT Authentication & REST APIs",
    color: "#083785",
    logo_url: "/assets/tech-logos/express.svg"
  },
  {
    id: "mysql",
    name: "MySQL 8.0",
    category: "database",
    categoryLabel: "Relational DB",
    role: "ACID Transactions, B-Tree Indexes & BCNF Normalization",
    color: "#4479A1",
    logo_url: "/assets/tech-logos/mysql.svg"
  },
  {
    id: "docker",
    name: "Docker",
    category: "devops",
    categoryLabel: "Containers",
    role: "Multi-stage Builds, Compose Orchestration & Production Images",
    color: "#2496ED",
    logo_url: "/assets/tech-logos/docker.svg"
  },
  {
    id: "aws",
    name: "AWS Cloud",
    category: "devops",
    categoryLabel: "Cloud Platform",
    role: "EC2 Compute, S3 Storage, RDS Databases & CloudFront CDN",
    color: "#FF9900",
    logo_url: "/assets/tech-logos/aws.svg"
  },
  {
    id: "linux",
    name: "Linux / Ubuntu",
    category: "devops",
    categoryLabel: "Server OS",
    role: "Bash Automation, Systemd Services, SSH & NGINX Tuning",
    color: "#E95420",
    logo_url: "/assets/tech-logos/ubuntu.svg"
  },
  {
    id: "git",
    name: "Git & GitHub",
    category: "devops",
    categoryLabel: "Version Control",
    role: "Trunk-based Branching, Code Reviews & Automated Actions",
    color: "#F05032",
    logo_url: "/assets/tech-logos/git.svg"
  }
];

const TechnologyExpertiseView = () => {
  const [skills, setSkills] = useState(PortfolioController.getSkills());
  const [selectedTech, setSelectedTech] = useState(skills[0] || TECHNOLOGY_ITEMS[0]);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    PortfolioController.fetchSkills().then((s) => {
      if (s && s.length > 0) {
        setSkills(s);
        setSelectedTech(s[0]);
      }
    });

    const handleUpdate = () => {
      const updated = PortfolioController.getSkills();
      setSkills(updated);
      if (updated.length > 0) setSelectedTech(updated[0]);
      setActiveCategory("all");
    };

    window.addEventListener("portfolio_data_updated", handleUpdate);
    return () => window.removeEventListener("portfolio_data_updated", handleUpdate);
  }, []);

  const currentSkills = skills.length > 0 ? skills : TECHNOLOGY_ITEMS;
  const categoryLabels = {
    frontend: "Frontend",
    backend: "Backend",
    database: "Data",
    devops: "Cloud & DevOps"
  };
  const categories = Array.from(new Map(currentSkills.map((tech) => {
    const id = String(tech.category || "other").trim().toLowerCase();
    const label = categoryLabels[id] || tech.categoryLabel || tech.category || "Other";
    return [id, { id, label }];
  })).values());
  const visibleSkills = activeCategory === "all"
    ? currentSkills
    : currentSkills.filter((tech) => String(tech.category || "other").trim().toLowerCase() === activeCategory);
  const selectCategory = (categoryId) => {
    setActiveCategory(categoryId);
    if (categoryId !== "all") {
      const firstMatch = currentSkills.find(
        (tech) => String(tech.category || "other").trim().toLowerCase() === categoryId
      );
      if (firstMatch) setSelectedTech(firstMatch);
    }
  };
  const categoryIcons = {
    frontend: Layers3,
    backend: Server,
    database: Database,
    devops: Cloud
  };
  const SelectedCategoryIcon = categoryIcons[String(selectedTech?.category || "").toLowerCase()] || Cpu;

  return (
    <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_24px_70px_-35px_rgba(8,55,133,0.45)]">
      <header className="relative isolate overflow-hidden bg-[#071f49] px-6 py-8 text-white sm:px-9 sm:py-10 lg:px-12">
        <div aria-hidden="true" className="absolute -right-20 -top-36 -z-10 h-96 w-96 rounded-full border border-cyan-200/10 bg-blue-400/10 blur-3xl" />
        <div aria-hidden="true" className="absolute bottom-0 right-0 -z-10 h-px w-2/3 bg-gradient-to-l from-cyan-300/70 to-transparent" />
        <div className="flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-[2.75rem]">
              Technical Expertise
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-blue-100/75 sm:text-base">
              The tools and technologies I use to design, build, and deliver dependable digital products.
            </p>
          </div>
          <div className="flex shrink-0 gap-3">
            <div className="min-w-28 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3">
              <div className="text-2xl font-black text-white">{currentSkills.length}</div>
              <div className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.15em] text-blue-200/70">Technologies</div>
            </div>
            <div className="min-w-28 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3">
              <div className="text-2xl font-black text-[#ECC257]">{categories.length}</div>
              <div className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.15em] text-blue-200/70">Disciplines</div>
            </div>
          </div>
        </div>
      </header>

      <div className="space-y-6 bg-slate-50/80 p-5 sm:p-8 lg:p-10">
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Explore the stack</p>
            <p className="mt-1 text-sm text-slate-600">Select a discipline to focus the technologies.</p>
          </div>
          <div className="flex flex-wrap gap-2" aria-label="Filter technologies by discipline">
            <button
              type="button"
              onClick={() => selectCategory("all")}
              aria-pressed={activeCategory === "all"}
              className={`rounded-full px-4 py-2 text-xs font-bold transition-colors ${
                activeCategory === "all"
                  ? "bg-[#083785] text-white shadow-md shadow-blue-900/15"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-[#083785]"
              }`}
            >
              All <span className="ml-1 opacity-70">{currentSkills.length}</span>
            </button>
            {categories.map((category) => (
              <button
                type="button"
                key={category.id}
                onClick={() => selectCategory(category.id)}
                aria-pressed={activeCategory === category.id}
                className={`rounded-full px-4 py-2 text-xs font-bold transition-colors ${
                  activeCategory === category.id
                    ? "bg-[#083785] text-white shadow-md shadow-blue-900/15"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-[#083785]"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {visibleSkills.map((tech) => {
            const isSelected = selectedTech?.id === tech.id;
            return (
              <button
                type="button"
                key={tech.id ?? tech.name}
                onClick={() => setSelectedTech(tech)}
                aria-pressed={isSelected}
                className={`group flex min-h-[92px] items-center gap-4 rounded-2xl border bg-white p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${
                  isSelected
                    ? "border-[#083785] ring-2 ring-[#083785]/10 shadow-md"
                    : "border-slate-200 hover:border-blue-300"
                }`}
              >
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 transition-colors group-hover:bg-blue-50">
                  <TechLogo tech={tech} className="h-9 w-9" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-extrabold text-slate-900">{tech.name}</span>
                  <span className="mt-1 block truncate text-xs font-medium text-slate-500">
                    {tech.categoryLabel || tech.category || "Technology"}
                  </span>
                </span>
                <ArrowRight className={`h-4 w-4 shrink-0 transition-all ${
                  isSelected ? "translate-x-0 text-[#083785]" : "-translate-x-1 text-slate-300 group-hover:translate-x-0 group-hover:text-[#083785]"
                }`} />
              </button>
            );
          })}
        </div>

        {selectedTech && (
          <div className="flex flex-col gap-4 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-white p-5 sm:flex-row sm:items-center sm:p-6">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#083785] text-white shadow-lg shadow-blue-900/15">
              <SelectedCategoryIcon className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-extrabold text-[#083785]">{selectedTech.name}</h3>
                <span className="rounded-full bg-[#ECC257]/25 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#735300]">
                  {selectedTech.categoryLabel || selectedTech.category || "Technology"}
                </span>
              </div>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                {selectedTech.role || "A core part of my development toolkit."}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export { TECHNOLOGY_ITEMS, TechnologyExpertiseView };
