/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Backend Model: UserModel (M in MVC)
 */
import { scryptSync, timingSafeEqual } from "node:crypto";
class UserModel {
  static isConfigured() {
    const passwordHash = process.env.ADMIN_PASSWORD_HASH || "";
    const secret = process.env.AUTH_TOKEN_SECRET || "";
    return Boolean(
      process.env.ADMIN_EMAIL &&
      /^[a-f0-9]{32}:[a-f0-9]{128}$/i.test(passwordHash) &&
      Buffer.byteLength(secret) >= 32
    );
  }

  static verifyCredentials(email, password) {
    const configuredEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const [salt, expectedHash] = (process.env.ADMIN_PASSWORD_HASH || "").split(":");
    if (
      !this.isConfigured() ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      password.length > 1024 ||
      email.trim().toLowerCase() !== configuredEmail
    ) {
      return null;
    }

    const actualHash = scryptSync(password, Buffer.from(salt, "hex"), 64);
    const expectedBuffer = Buffer.from(expectedHash, "hex");
    if (!timingSafeEqual(actualHash, expectedBuffer)) return null;

    return {
      id: 1,
      email: configuredEmail,
      full_name: "Eliyas Wakjira",
      role: "super_admin",
      title: "Full-Stack Developer & Database Architect"
    };
  }
}
export {
  UserModel
};
