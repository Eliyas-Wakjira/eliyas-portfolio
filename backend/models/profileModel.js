/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Backend Model: ProfileModel (M in MVC)
 */
import { db } from "../config/db.js";
export const DEFAULT_PROFILE = {
  name: "Eliyas Wakjira",
  hero_title: "Eliyas Wakjira",
  hero_subtitle: "Full-Stack Developer, Database Architect & Collegiate Tech Instructor specializing in building dependable React 19 / Next.js interfaces, decoupled Express MVC backends, and normalized MySQL relational databases.",
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

class ProfileModel {
  static get() {
    return db.get("profile", 1).then((record) => record || DEFAULT_PROFILE);
  }
  static async update(data) {
    const currentProfile = await this.get();
    const updated = {
      ...currentProfile,
      ...data,
      stats: data.stats || currentProfile.stats,
      about: { ...currentProfile.about, ...(data.about || {}) },
      contact: { ...currentProfile.contact, ...(data.contact || {}) }
    };
    return db.saveProfile(updated);
  }
  static reset() {
    return db.saveProfile(JSON.parse(JSON.stringify(DEFAULT_PROFILE)));
  }
}

export { ProfileModel };
