/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Backend Controller: CertificatesController (C in MVC)
 * Serves the 4 categories: 1. Technology, 2. Education, 3. Humanitarian, 4. Others
 */
import { CertificateModel } from '../models/certificateModel.js';
import { JsonView } from '../views/jsonView.js';
class CertificatesController {
  static async getAll(req, res) {
    try {
      const category = req.query.category;
      const search = req.query.search;
      const certificates = await CertificateModel.getAll({ category, search });
      const categories = await CertificateModel.getCategories();
      return JsonView.renderSuccess(res, certificates, {
        total: certificates.length,
        categories,
        filter: { category: category || "All", search: search || "" }
      });
    } catch (err) {
      return JsonView.renderError(res, err.message || "Failed to fetch certificates", 500);
    }
  }
  static async getCategories(_req, res) {
    try {
      const categories = await CertificateModel.getCategories();
      return JsonView.renderSuccess(res, categories);
    } catch (err) {
      return JsonView.renderError(res, err.message || "Failed to fetch categories", 500);
    }
  }
  static async getById(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return JsonView.renderError(res, "Invalid certificate ID format", 400);
      }
      const cert = await CertificateModel.getById(id);
      if (!cert) {
        return JsonView.renderError(res, "Certificate not found", 404);
      }
      return JsonView.renderSuccess(res, cert);
    } catch (err) {
      return JsonView.renderError(res, err.message || "Error fetching certificate", 500);
    }
  }
  static async create(req, res) {
    try {
      const data = req.body;
      if (!data.title) {
        return JsonView.renderError(res, "Title is required", 400);
      }
      const newCert = await CertificateModel.create(data);
      return JsonView.renderSuccess(res, newCert, { message: "Certificate created successfully" }, 201);
    } catch (err) {
      return JsonView.renderError(res, err.message || "Failed to create certificate", 500);
    }
  }
  static async update(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const updated = await CertificateModel.update(id, req.body);
      if (!updated) {
        return JsonView.renderError(res, "Certificate not found", 404);
      }
      return JsonView.renderSuccess(res, updated, { message: "Certificate updated successfully" });
    } catch (err) {
      return JsonView.renderError(res, err.message || "Failed to update certificate", 500);
    }
  }
  static async delete(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const ok = await CertificateModel.delete(id);
      if (!ok) {
        return JsonView.renderError(res, "Certificate not found", 404);
      }
      return JsonView.renderSuccess(res, { id }, { message: "Certificate deleted successfully" });
    } catch (err) {
      return JsonView.renderError(res, err.message || "Failed to delete certificate", 500);
    }
  }
}
export {
  CertificatesController
};
