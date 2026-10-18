/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Backend Controller: SkillsController (C in MVC)
 */
import { SkillModel } from '../models/skillModel.js';
import { JsonView } from '../views/jsonView.js';
class SkillsController {
  static async getAll(_req, res) {
    try {
      const skills = await SkillModel.getAll();
      return JsonView.renderSuccess(res, skills, { total: skills.length });
    } catch (err) {
      return JsonView.renderError(res, err.message || "Failed to fetch skills", 500);
    }
  }
  static async create(req, res) {
    try {
      const data = req.body;
      const newSkill = await SkillModel.create(data);
      return JsonView.renderSuccess(res, newSkill, { message: "Skill created successfully" }, 201);
    } catch (err) {
      return JsonView.renderError(res, err.message || "Failed to create skill", 500);
    }
  }
  static async update(req, res) {
    try {
      const id = req.params.id;
      const updated = await SkillModel.update(id, req.body);
      if (!updated) return JsonView.renderError(res, "Skill not found", 404);
      return JsonView.renderSuccess(res, updated, { message: "Skill updated successfully" });
    } catch (err) {
      return JsonView.renderError(res, err.message || "Failed to update skill", 500);
    }
  }
  static async delete(req, res) {
    try {
      const id = req.params.id;
      const ok = await SkillModel.delete(id);
      if (!ok) return JsonView.renderError(res, "Skill not found", 404);
      return JsonView.renderSuccess(res, { id }, { message: "Skill deleted successfully" });
    } catch (err) {
      return JsonView.renderError(res, err.message || "Failed to delete skill", 500);
    }
  }
}
export {
  SkillsController
};
