/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Backend Model: CertificateModel (M in MVC)
 */
import { db } from "../config/db.js";

const BACKEND_CERTIFICATE_CATEGORIES = [
  { id: "Technology", number: 1, name: "Technology", label: "1. Technology", subtitle: "Cloud Architecture, Full-Stack, Databases & Linux" },
  { id: "Education", number: 2, name: "Education", label: "2. Education", subtitle: "Collegiate Instruction, Pedagogy & Computing Curriculum" },
  { id: "Humanitarian", number: 3, name: "Humanitarian", label: "3. Humanitarian", subtitle: "Youth Empowerment, Digital Literacy & Civic Impact" },
  { id: "Others", number: 4, name: "Others", label: "4. Others", subtitle: "Institutional Leadership, Uptime Citations & Agile Delivery" }
];

class CertificateModel {
  static async getAll(filter) {
    let results = await db.list("certificates");
    if (filter?.category && filter.category !== "All") {
      results = results.filter((certificate) =>
        certificate.category?.toLowerCase() === filter.category.toLowerCase()
      );
    }
    if (filter?.search) {
      const query = filter.search.toLowerCase().trim();
      results = results.filter((certificate) =>
        [
          certificate.title,
          certificate.issuer,
          certificate.credential_id,
          certificate.description,
          ...(certificate.skills_acquired || [])
        ].some((value) => value?.toLowerCase().includes(query))
      );
    }
    return results;
  }

  static getById(id) {
    return db.get("certificates", id);
  }

  static async getCategories() {
    const certificates = await db.list("certificates");
    return BACKEND_CERTIFICATE_CATEGORIES.map((category) => ({
      ...category,
      count: certificates.filter((certificate) => certificate.category === category.id).length
    }));
  }

  static create(data) {
    const skills = Array.isArray(data.skills_acquired)
      ? data.skills_acquired
      : data.skills_acquired
        ? data.skills_acquired.split(",").map((skill) => skill.trim())
        : [];
    return db.insert("certificates", { ...data, skills_acquired: skills });
  }

  static async update(id, data) {
    const current = await db.get("certificates", id);
    if (!current) return null;
    const skills = Array.isArray(data.skills_acquired)
      ? data.skills_acquired
      : data.skills_acquired
        ? data.skills_acquired.split(",").map((skill) => skill.trim())
        : current.skills_acquired;
    const updated = { ...current, ...data, id, skills_acquired: skills };
    if (!(await db.update("certificates", id, updated))) return null;
    return updated;
  }

  static delete(id) {
    return db.remove("certificates", id);
  }

  static async count() {
    return (await db.list("certificates")).length;
  }
}

export { BACKEND_CERTIFICATE_CATEGORIES, CertificateModel };
