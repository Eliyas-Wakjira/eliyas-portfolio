/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Backend Controller: ProjectsController (C in MVC)
 */
import { ProjectModel } from '../models/projectModel.js';
import { JsonView } from '../views/jsonView.js';
class ProjectsController {
  static async getAll(req, res) {
    try {
      const layer = req.query.layer;
      const search = req.query.search;
      const projects = await ProjectModel.getAll({ layer, search });
      return JsonView.renderSuccess(res, projects, {
        total: projects.length,
        filter: { layer: layer || "All", search: search || "" }
      });
    } catch (err) {
      return JsonView.renderError(res, err.message || "Failed to fetch projects", 500);
    }
  }
  static async getById(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return JsonView.renderError(res, "Invalid project ID format", 400);
      }
      const project = await ProjectModel.getById(id);
      if (!project) {
        return JsonView.renderError(res, "Project not found", 404);
      }
      return JsonView.renderSuccess(res, project);
    } catch (err) {
      return JsonView.renderError(res, err.message || "Error fetching project", 500);
    }
  }
  static async create(req, res) {
    try {
      const data = req.body;
      if (!data.title) {
        return JsonView.renderError(res, "Title is required", 400);
      }
      const newProj = await ProjectModel.create(data);
      return JsonView.renderSuccess(res, newProj, { message: "Project created successfully" }, 201);
    } catch (err) {
      return JsonView.renderError(res, err.message || "Failed to create project", 500);
    }
  }
  static async update(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const updated = await ProjectModel.update(id, req.body);
      if (!updated) {
        return JsonView.renderError(res, "Project not found", 404);
      }
      return JsonView.renderSuccess(res, updated, { message: "Project updated successfully" });
    } catch (err) {
      return JsonView.renderError(res, err.message || "Failed to update project", 500);
    }
  }
  static async delete(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const ok = await ProjectModel.delete(id);
      if (!ok) {
        return JsonView.renderError(res, "Project not found", 404);
      }
      return JsonView.renderSuccess(res, { id }, { message: "Project deleted successfully" });
    } catch (err) {
      return JsonView.renderError(res, err.message || "Failed to delete project", 500);
    }
  }
}
export {
  ProjectsController
};
