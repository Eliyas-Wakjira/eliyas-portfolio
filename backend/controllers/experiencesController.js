/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Backend Controller: ExperiencesController (C in MVC)
 */
import { ExperienceModel } from '../models/experienceModel.js';
import { JsonView } from '../views/jsonView.js';
class ExperiencesController {
  static async getAll(_req, res) {
    try {
      const experiences = await ExperienceModel.getAll();
      return JsonView.renderSuccess(res, experiences, { total: experiences.length });
    } catch (err) {
      return JsonView.renderError(res, err.message || "Failed to fetch experiences", 500);
    }
  }
  static async create(req, res) {
    try {
      const data = req.body;
      const newExp = await ExperienceModel.create(data);
      return JsonView.renderSuccess(res, newExp, { message: "Experience created successfully" }, 201);
    } catch (err) {
      return JsonView.renderError(res, err.message || "Failed to create experience", 500);
    }
  }
  static async update(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const updated = await ExperienceModel.update(id, req.body);
      if (!updated) return JsonView.renderError(res, "Experience not found", 404);
      return JsonView.renderSuccess(res, updated, { message: "Experience updated successfully" });
    } catch (err) {
      return JsonView.renderError(res, err.message || "Failed to update experience", 500);
    }
  }
  static async delete(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const ok = await ExperienceModel.delete(id);
      if (!ok) return JsonView.renderError(res, "Experience not found", 404);
      return JsonView.renderSuccess(res, { id }, { message: "Experience deleted successfully" });
    } catch (err) {
      return JsonView.renderError(res, err.message || "Failed to delete experience", 500);
    }
  }
}
export {
  ExperiencesController
};
