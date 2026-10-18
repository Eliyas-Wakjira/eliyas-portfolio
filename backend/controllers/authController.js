/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Backend Controller: AuthController (C in MVC)
 */
import { UserModel } from '../models/userModel.js';
import { JsonView } from '../views/jsonView.js';
import { createSessionToken, TOKEN_LIFETIME_SECONDS } from "../utils/sessionToken.js";

const SESSION_COOKIE = "portfolio_session";

class AuthController {
  static login(req, res) {
    const { email, password } = req.body || {};
    if (typeof email !== "string" || typeof password !== "string" || !email.trim() || !password) {
      return JsonView.renderError(res, "Email and password are required", 400);
    }

    if (!UserModel.isConfigured()) {
      return JsonView.renderError(res, "Administrator authentication is not configured", 503);
    }

    const user = UserModel.verifyCredentials(email, password);
    if (!user) return JsonView.renderError(res, "Invalid email or password", 401);

    let token;
    try {
      token = createSessionToken(user);
    } catch {
      return JsonView.renderError(res, "Administrator authentication is not configured", 503);
    }

    res.cookie(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: TOKEN_LIFETIME_SECONDS * 1000,
      path: "/"
    });
    return JsonView.renderSuccess(res, user);
  }

  static getMe(req, res) {
    return JsonView.renderSuccess(res, req.authUser);
  }

  static logout(_req, res) {
    res.clearCookie(SESSION_COOKIE, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/"
    });
    return JsonView.renderSuccess(res, { loggedOut: true });
  }
}
export {
  AuthController
};
