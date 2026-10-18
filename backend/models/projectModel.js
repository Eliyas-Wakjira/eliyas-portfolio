/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Backend Model: ProjectModel (M in MVC)
 */
import { db } from "../config/db.js";

class ProjectModel {
  static async getAll(filter) {
    let results = await db.list("projects");
    if (filter?.layer && filter.layer !== "All") {
      const layer = filter.layer.toLowerCase();
      if (layer === "frontend") results = results.filter((project) => project.layer === "Frontend");
      else if (layer === "backend") results = results.filter((project) => project.layer === "Backend");
      else if (layer === "full-stack") {
        results = results.filter((project) => ["Frontend + Backend", "Full-Stack"].includes(project.layer));
      } else if (layer === "live") {
        results = results.filter((project) => /live|published/i.test(project.status || ""));
      } else if (layer === "future") {
        results = results.filter((project) => /future|pipeline/i.test(project.status || ""));
      }
    }
    if (filter?.search) {
      const query = filter.search.toLowerCase().trim();
      results = results.filter((project) =>
        [project.title, project.overview, project.category, project.frontend_stack, project.backend_stack]
          .some((value) => value?.toLowerCase().includes(query))
      );
    }
    return results.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  }

  static getById(id) {
    return db.get("projects", id);
  }

  static async getBySlug(slug) {
    return (await db.list("projects")).find((project) => project.slug === slug) || null;
  }

  static create(data) {
    return db.insert("projects", { ...data, sort_order: data.sort_order || 0 });
  }

  static async update(id, data) {
    const current = await db.get("projects", id);
    if (!current) return null;
    const updated = { ...current, ...data, id };
    if (!(await db.update("projects", id, updated))) return null;
    return updated;
  }

  static delete(id) {
    return db.remove("projects", id);
  }

  static async count() {
    return (await db.list("projects")).length;
  }
}

export { ProjectModel };
