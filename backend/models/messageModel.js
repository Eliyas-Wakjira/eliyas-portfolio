/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Backend Model: MessageModel (M in MVC)
 */
import { db } from "../config/db.js";

class MessageModel {
  static async getAll() {
    return (await db.list("messages")).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  static getById(id) {
    return db.get("messages", id);
  }

  static create(data) {
    return db.insert("messages", {
      name: data.name.trim(),
      email: data.email.trim(),
      subject: (data.subject || "General Inquiry").trim(),
      message: data.message.trim(),
      status: "New",
      created_at: new Date().toISOString()
    });
  }

  static async updateStatus(id, status) {
    const message = await db.get("messages", id);
    if (!message) return null;
    const updated = { ...message, status };
    if (!(await db.update("messages", id, updated))) return null;
    return updated;
  }

  static delete(id) {
    return db.remove("messages", id);
  }
}

export { MessageModel };
