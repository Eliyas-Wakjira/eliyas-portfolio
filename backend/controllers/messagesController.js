/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Backend Controller: MessagesController (C in MVC)
 */
import { MessageModel } from '../models/messageModel.js';
import { JsonView } from '../views/jsonView.js';
class MessagesController {
  static async submit(req, res) {
    try {
      const { name, email, subject, message } = req.body;
      if (!name || typeof name !== "string" || !name.trim()) {
        return JsonView.renderError(res, "Name is required.", 422);
      }
      if (!email || typeof email !== "string" || !email.includes("@")) {
        return JsonView.renderError(res, "A valid email address is required.", 422);
      }
      if (!message || typeof message !== "string" || !message.trim()) {
        return JsonView.renderError(res, "Message text cannot be empty.", 422);
      }
      const created = await MessageModel.create({ name, email, subject, message });
      return JsonView.renderSuccess(
        res,
        created,
        {
          acknowledgement: "Thank you! Eliyas Wakjira has received your message and will respond shortly."
        },
        201
      );
    } catch (err) {
      return JsonView.renderError(res, err.message || "Error processing contact inquiry", 500);
    }
  }
  static async getAll(_req, res) {
    try {
      const messages = await MessageModel.getAll();
      return JsonView.renderSuccess(res, messages, { total: messages.length });
    } catch (err) {
      return JsonView.renderError(res, err.message || "Error fetching messages", 500);
    }
  }
  static async delete(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return JsonView.renderError(res, "Invalid message ID", 400);
      }
      const success = await MessageModel.delete(id);
      if (!success) {
        return JsonView.renderError(res, "Message not found", 404);
      }
      return JsonView.renderSuccess(res, { deletedId: id });
    } catch (err) {
      return JsonView.renderError(res, err.message || "Error deleting message", 500);
    }
  }
}
export {
  MessagesController
};
