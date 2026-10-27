/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Frontend Controller: PortfolioController (C in MVC)
 * Complete Full-Stack State Engine:
 * - Manages Projects, Certificates, Tech Stack & Skills, Career Experiences, and Profile
 * - Syncs with localStorage and /api backend endpoints
 * - Broadcasts instant reactive updates to all views via 'portfolio_data_updated' event
 */
import {
  INITIAL_PROJECTS,
  INITIAL_CERTIFICATES,
  INITIAL_EXPERIENCES
} from "../models/localDataFallback";
import { apiFetch as fetch } from "./api";

const fetchApiData = async (path) => {
  const response = await fetch(path);
  const payload = await response.json();
  if (!response.ok || !payload.success) {
    throw new Error(payload.error?.message || `API request failed with status ${response.status}`);
  }
  return payload.data;
};

const useFallbackData = (resource, error, fallback) => {
  console.warn(`Unable to load ${resource} from the API; using local portfolio data.`, error);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("portfolio_api_status", {
      detail: { available: false, resource }
    }));
  }
  return fallback();
};

const reportApiAvailable = (resource) => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("portfolio_api_status", {
      detail: { available: true, resource }
    }));
  }
};

const filterFallbackProjects = (projects, layer) => {
  if (layer === "All") return projects;
  if (layer === "Live") {
    return projects.filter((project) => /live|published/i.test(project.status || ""));
  }
  if (layer === "Future") {
    return projects.filter((project) => /future|pipeline/i.test(project.status || ""));
  }
  if (layer === "Frontend") {
    return projects.filter((project) => project.layer === "Frontend");
  }
  if (layer === "Full-Stack") {
    return projects.filter((project) => ["Frontend + Backend", "Full-Stack"].includes(project.layer));
  }
  return projects;
};

export const DEFAULT_TECH_STACK = [
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

export const DEFAULT_PROFILE = {
  name: "Eliyas Wakjira",
  hero_title: "Eliyas Wakjira",
  hero_subtitle: "Full-Stack Developer, Database Architect & Collegiate Tech Instructor specializing in building dependable React 19 / Next.js interfaces, decoupled Express MVC backends, and normalized MySQL relational databases.",
  cv_url: "#",
  stats: [
    { value: "6+", label: "Production Systems", color: "text-[#ECC257]" },
    { value: "14K+", label: "Active Users Served", color: "text-[#ECC257]" },
    { value: "14", label: "4 Cert Categories", color: "text-[#ECC257]" },
    { value: "5+ Yrs", label: "Collegiate Teaching", color: "text-emerald-400" }
  ],
  about: {
    location: "Addis Ababa, Ethiopia (UTC+3)",
    headline: "Bridging frontend craft with backend database depth.",
    p1: "I combine modern reactive user interface development (React 19, Next.js 15, Tailwind CSS) with hardened backend microservices (Node.js, Express MVC) and relational database normalization (MySQL 8.0, InnoDB transactions).",
    p2: "As a collegiate technology instructor, I emphasize foundational engineering: understanding the entire HTTP cycle and database normalization rather than relying on surface abstractions.",
    degree: "B.Sc. in Computer Science & Information Technology",
    university: "Addis Ababa University (AAU)",
    pedagogy: "Collegiate curriculum design integrating real-world Git version control, Express MVC routing, Boyce-Codd database normalization, and multi-tier lab defense evaluations."
  },
  contact: {
    email: "info@eliyastech.com",
    phone: "+251 919 501 238",
    telegram: "@eliyas_wakjira",
    location: "Addis Ababa, Ethiopia",
    response_time: "Within 24 business hours",
    availability: "Immediate for Contract & Advisory Roles"
  }
};

const STORAGE_KEY_PROJECTS = "eliyas_portfolio_projects_v2";
const STORAGE_KEY_CERTS = "eliyas_portfolio_certs_v2";
const STORAGE_KEY_TECHS = "eliyas_portfolio_techs_v2";
const STORAGE_KEY_EXPS = "eliyas_portfolio_exps_v2";
const STORAGE_KEY_PROFILE = "eliyas_portfolio_profile_v2";

const normalizeProfileContact = (profile) => {
  const contact = { ...DEFAULT_PROFILE.contact, ...(profile?.contact || {}) };
  if (contact.location === "Bole Sub-City, Addis Ababa, Ethiopia") {
    contact.location = DEFAULT_PROFILE.contact.location;
  }
  if (["eliwak2626@gmail.com", "eliwak430@gmail.com"].includes(contact.email)) {
    contact.email = DEFAULT_PROFILE.contact.email;
  }
  if (contact.phone === "+251 91 100 0000") {
    contact.phone = DEFAULT_PROFILE.contact.phone;
  }
  return { ...DEFAULT_PROFILE, ...profile, contact };
};

class PortfolioController {
  static broadcastChange() {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("portfolio_data_updated"));
    }
  }

  // ================= PROFILE & ABOUT =================
  static getProfile() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_PROFILE);
      if (stored) {
        const profile = normalizeProfileContact(JSON.parse(stored));
        localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
        return profile;
      }
    } catch (e) {
      console.warn("Storage read error", e);
    }
    return DEFAULT_PROFILE;
  }

  static async fetchProfile() {
    try {
      const data = await fetchApiData("/api/profile");
      if (!data || typeof data !== "object") {
        throw new Error("The database returned an invalid profile.");
      }
      const profile = normalizeProfileContact(data);
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
      reportApiAvailable("profile");
      return profile;
    } catch (error) {
      return useFallbackData("profile", error, () => this.getProfile());
    }
  }

  static async updateProfile(data) {
    const updated = {
      ...this.getProfile(),
      ...data,
      stats: data.stats || this.getProfile().stats,
      about: { ...this.getProfile().about, ...(data.about || {}) },
      contact: { ...this.getProfile().contact, ...(data.contact || {}) }
    };
    try {
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(updated));
      await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated)
      }).catch(() => {});
    } catch (e) {
      console.error(e);
    }
    this.broadcastChange();
    return updated;
  }

  // ================= PROJECTS =================
  static getProjects() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_PROJECTS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.some((p) => p.live_url?.includes("evangadi-form.vercel.app") || p.live_url?.includes("akmonlink.edu.et"))) {
          return parsed;
        }
      }
    } catch (e) {}
    localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(INITIAL_PROJECTS));
    return INITIAL_PROJECTS;
  }

  static async fetchProjects(layer = "All") {
    try {
      const url = layer !== "All" ? `/api/projects?layer=${encodeURIComponent(layer)}` : "/api/projects";
      const projects = await fetchApiData(url);
      if (!Array.isArray(projects)) throw new Error("The database returned invalid projects.");
      if (layer === "All") localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
      reportApiAvailable("projects");
      return projects;
    } catch (error) {
      return useFallbackData("projects", error, () => filterFallbackProjects(this.getProjects(), layer));
    }
  }

  static async saveProject(project) {
    let projects = this.getProjects();
    if (project.id) {
      projects = projects.map((p) => (p.id === project.id ? { ...p, ...project } : p));
      await fetch(`/api/projects/${project.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(project)
      }).catch(() => {});
    } else {
      const newId = projects.length > 0 ? Math.max(...projects.map((p) => p.id || 0)) + 1 : 1;
      const newProj = { ...project, id: newId };
      projects.push(newProj);
      await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProj)
      }).catch(() => {});
    }
    localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
    this.broadcastChange();
    return projects;
  }

  static async deleteProject(id) {
    let projects = this.getProjects();
    projects = projects.filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
    await fetch(`/api/projects/${id}`, { method: "DELETE" }).catch(() => {});
    this.broadcastChange();
    return projects;
  }

  // ================= TECH STACK & SKILLS =================
  static getSkills() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_TECHS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // If stored contains the old 4 broad categories (id is numeric and lacks logo_url), upgrade to DEFAULT_TECH_STACK
          const isLegacy = parsed.length <= 4 && parsed.some((p) => typeof p.id === "number" && !p.logo_url);
          if (!isLegacy) {
            return parsed;
          }
        }
      }
    } catch (e) {}
    return DEFAULT_TECH_STACK;
  }

  static async fetchSkills() {
    try {
      const skills = await fetchApiData("/api/skills");
      if (!Array.isArray(skills)) throw new Error("The database returned invalid skills.");
      localStorage.setItem(STORAGE_KEY_TECHS, JSON.stringify(skills));
      reportApiAvailable("skills");
      return skills;
    } catch (error) {
      return useFallbackData("skills", error, () => this.getSkills());
    }
  }

  static async saveSkill(skill) {
    let skills = this.getSkills();
    if (skill.id) {
      const exists = skills.some((s) => s.id === skill.id);
      if (exists) {
        skills = skills.map((s) => (s.id === skill.id ? { ...s, ...skill } : s));
      } else {
        skills.push(skill);
      }
      await fetch(`/api/skills/${skill.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(skill)
      }).catch(() => {});
    } else {
      const newId = skill.name.toLowerCase().replace(/[^a-z0-9]/g, "") || `tech-${Date.now()}`;
      const newSkill = { ...skill, id: newId };
      skills.push(newSkill);
      await fetch("/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSkill)
      }).catch(() => {});
    }
    localStorage.setItem(STORAGE_KEY_TECHS, JSON.stringify(skills));
    this.broadcastChange();
    return skills;
  }

  static async deleteSkill(id) {
    let skills = this.getSkills();
    skills = skills.filter((s) => s.id !== id);
    localStorage.setItem(STORAGE_KEY_TECHS, JSON.stringify(skills));
    await fetch(`/api/skills/${id}`, { method: "DELETE" }).catch(() => {});
    this.broadcastChange();
    return skills;
  }

  // ================= CERTIFICATES =================
  static getCertificates() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CERTS);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return INITIAL_CERTIFICATES;
  }

  static async fetchCertificates(category = "All") {
    try {
      const url = category !== "All" ? `/api/certificates?category=${encodeURIComponent(category)}` : "/api/certificates";
      const certificates = await fetchApiData(url);
      if (!Array.isArray(certificates)) throw new Error("The database returned invalid certificates.");
      if (category === "All") localStorage.setItem(STORAGE_KEY_CERTS, JSON.stringify(certificates));
      reportApiAvailable("certificates");
      return certificates;
    } catch (error) {
      return useFallbackData("certificates", error, () => {
        const localCertificates = this.getCertificates();
        return category === "All"
          ? localCertificates
          : localCertificates.filter((certificate) => certificate.category === category);
      });
    }
  }

  static async saveCertificate(cert) {
    let certs = this.getCertificates();
    const skillsArray = Array.isArray(cert.skills_acquired)
      ? cert.skills_acquired
      : (cert.skills_acquired ? cert.skills_acquired.split(",").map((s) => s.trim()) : []);

    const preparedCert = { ...cert, skills_acquired: skillsArray };

    if (cert.id) {
      certs = certs.map((c) => (c.id === cert.id ? { ...c, ...preparedCert } : c));
      await fetch(`/api/certificates/${cert.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preparedCert)
      }).catch(() => {});
    } else {
      const newId = certs.length > 0 ? Math.max(...certs.map((c) => c.id || 0)) + 1 : 1;
      const newCert = { ...preparedCert, id: newId };
      certs.push(newCert);
      await fetch("/api/certificates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCert)
      }).catch(() => {});
    }
    localStorage.setItem(STORAGE_KEY_CERTS, JSON.stringify(certs));
    this.broadcastChange();
    return certs;
  }

  static async deleteCertificate(id) {
    let certs = this.getCertificates();
    certs = certs.filter((c) => c.id !== id);
    localStorage.setItem(STORAGE_KEY_CERTS, JSON.stringify(certs));
    await fetch(`/api/certificates/${id}`, { method: "DELETE" }).catch(() => {});
    this.broadcastChange();
    return certs;
  }

  // ================= EXPERIENCES =================
  static getExperiences() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_EXPS);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return INITIAL_EXPERIENCES;
  }

  static async fetchExperiences() {
    try {
      const experiences = await fetchApiData("/api/experiences");
      if (!Array.isArray(experiences)) throw new Error("The database returned invalid experiences.");
      localStorage.setItem(STORAGE_KEY_EXPS, JSON.stringify(experiences));
      reportApiAvailable("experiences");
      return experiences;
    } catch (error) {
      return useFallbackData("experiences", error, () => this.getExperiences());
    }
  }

  static async saveExperience(exp) {
    let exps = this.getExperiences();
    const achievementsArray = Array.isArray(exp.achievements)
      ? exp.achievements
      : (exp.achievements ? exp.achievements.split("\n").map((s) => s.trim()).filter(Boolean) : []);

    const preparedExp = { ...exp, achievements: achievementsArray };

    if (exp.id) {
      exps = exps.map((e) => (e.id === exp.id ? { ...e, ...preparedExp } : e));
      await fetch(`/api/experiences/${exp.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preparedExp)
      }).catch(() => {});
    } else {
      const newId = exps.length > 0 ? Math.max(...exps.map((e) => e.id || 0)) + 1 : 1;
      const newExp = { ...preparedExp, id: newId };
      exps.push(newExp);
      await fetch("/api/experiences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newExp)
      }).catch(() => {});
    }
    localStorage.setItem(STORAGE_KEY_EXPS, JSON.stringify(exps));
    this.broadcastChange();
    return exps;
  }

  static async deleteExperience(id) {
    let exps = this.getExperiences();
    exps = exps.filter((e) => e.id !== id);
    localStorage.setItem(STORAGE_KEY_EXPS, JSON.stringify(exps));
    await fetch(`/api/experiences/${id}`, { method: "DELETE" }).catch(() => {});
    this.broadcastChange();
    return exps;
  }

  // ================= SYSTEM RESET & BACKUP =================
  static resetAllToDefaults() {
    localStorage.removeItem(STORAGE_KEY_PROJECTS);
    localStorage.removeItem(STORAGE_KEY_CERTS);
    localStorage.removeItem(STORAGE_KEY_TECHS);
    localStorage.removeItem(STORAGE_KEY_EXPS);
    localStorage.removeItem(STORAGE_KEY_PROFILE);
    fetch("/api/profile/reset", { method: "POST" }).catch(() => {});
    this.broadcastChange();
  }

  static exportFullBackup() {
    return JSON.stringify({
      profile: this.getProfile(),
      projects: this.getProjects(),
      skills: this.getSkills(),
      certificates: this.getCertificates(),
      experiences: this.getExperiences(),
      exportedAt: new Date().toISOString()
    }, null, 2);
  }

  static importFullBackup(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (data.profile) localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(data.profile));
      if (data.projects) localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(data.projects));
      if (data.skills) localStorage.setItem(STORAGE_KEY_TECHS, JSON.stringify(data.skills));
      if (data.certificates) localStorage.setItem(STORAGE_KEY_CERTS, JSON.stringify(data.certificates));
      if (data.experiences) localStorage.setItem(STORAGE_KEY_EXPS, JSON.stringify(data.experiences));
      this.broadcastChange();
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
}

export { PortfolioController };
