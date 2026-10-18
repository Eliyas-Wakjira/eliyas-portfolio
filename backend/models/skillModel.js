/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Backend Model: SkillModel (M in MVC)
 */
import { db } from "../config/db.js";

class SkillModel {
  static getAll() {
    return db.list("skills");
  }

  static async getByCategory(category) {
    return (await db.list("skills")).filter((skill) => skill.category === category);
  }

  static async create(data) {
    const id = data.id || (data.name
      ? data.name.toLowerCase().replace(/[^a-z0-9]/g, "")
      : `tech-${Date.now()}`);
    if (await db.get("skills", id)) throw new Error("A skill with this ID already exists.");
    return db.insert("skills", { ...data, id });
  }

  static async update(id, data) {
    const current = await db.get("skills", id);
    if (!current) return null;
    const updated = { ...current, ...data, id: current.id };
    if (!(await db.update("skills", id, updated))) return null;
    return updated;
  }

  static delete(id) {
    return db.remove("skills", id);
  }
}

export { SkillModel };
