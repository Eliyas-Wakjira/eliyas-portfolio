/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Backend Controller: SqlController (C in MVC)
 * Handles SQL Console query executions for Admin Studio
 */
import { db } from '../config/db.js';
import { JsonView } from '../views/jsonView.js';
class SqlController {
  static async execute(req, res) {
    try {
      const { query } = req.body;
      if (!query || typeof query !== "string") {
        return JsonView.renderError(res, "SQL query statement is required", 400);
      }
      const result = await db.query(query);
      return JsonView.renderSqlResult(res, result);
    } catch (err) {
      return JsonView.renderError(res, err.message || "SQL execution failed", 500);
    }
  }
}
export {
  SqlController
};
