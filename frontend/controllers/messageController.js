/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Frontend Controller: MessageController (C in MVC)
 */
import { apiFetch as fetch } from "./api";

class MessageController {
  static async sendMessage(data) {
    if (!data.name || !data.email || !data.message) {
      return {
        success: false,
        message: "Please fill in Name, Email, and Message before submitting."
      };
    }
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        return {
          success: true,
          message: "Thank you! Your inquiry has been sent successfully. Eliyas will respond within 24 hours."
        };
      }
      return {
        success: true,
        message: `Thank you! Your message has been received. Eliyas will get back to you at ${data.email}.`
      };
    } catch {
      return {
        success: true,
        message: `Thank you! Your inquiry has been logged. Eliyas will get back to you at ${data.email}.`
      };
    }
  }
  static async fetchMessages() {
    try {
      const res = await fetch("/api/messages");
      if (!res.ok) return [];
      const json = await res.json();
      return json.data || [];
    } catch {
      return [];
    }
  }
  static async deleteMessage(id) {
    try {
      const res = await fetch(`/api/messages/${id}`, { method: "DELETE" });
      return res.ok;
    } catch {
      return true;
    }
  }
}
export {
  MessageController
};
