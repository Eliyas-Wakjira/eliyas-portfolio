/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Backend Model: ExperienceModel (M in MVC)
 */
import { db } from "../config/db.js";

class ExperienceModel {
  static getAll() {
    return db.list("experiences");
  }

  static getById(id) {
    return db.get("experiences", id);
  }

  static create(data) {
    const achievements = Array.isArray(data.achievements)
      ? data.achievements
      : data.achievements
        ? data.achievements.split("\n").filter(Boolean)
        : [];
    return db.insert("experiences", { ...data, achievements });
  }

  static async update(id, data) {
    const current = await db.get("experiences", id);
    if (!current) return null;
    const achievements = Array.isArray(data.achievements)
      ? data.achievements
      : data.achievements
        ? data.achievements.split("\n").filter(Boolean)
        : current.achievements;
    const updated = { ...current, ...data, id, achievements };
    if (!(await db.update("experiences", id, updated))) return null;
    return updated;
  }

  static delete(id) {
    return db.remove("experiences", id);
  }
}

export { ExperienceModel };
