/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Backend Controller: ProfileController (C in MVC)
 */
import { ProfileModel } from '../models/profileModel.js';
import { JsonView } from '../views/jsonView.js';

class ProfileController {
  static async get(_req, res) {
    try {
      const profile = await ProfileModel.get();
      return JsonView.renderSuccess(res, profile);
    } catch (err) {
      return JsonView.renderError(res, err.message || "Failed to fetch profile", 500);
    }
  }
  static async update(req, res) {
    try {
      const updated = await ProfileModel.update(req.body);
      return JsonView.renderSuccess(res, updated, { message: "Profile updated successfully" });
    } catch (err) {
      return JsonView.renderError(res, err.message || "Failed to update profile", 500);
    }
  }
  static async reset(_req, res) {
    try {
      const reset = await ProfileModel.reset();
      return JsonView.renderSuccess(res, reset, { message: "Profile reset to defaults" });
    } catch (err) {
      return JsonView.renderError(res, err.message || "Failed to reset profile", 500);
    }
  }
}

export { ProfileController };
