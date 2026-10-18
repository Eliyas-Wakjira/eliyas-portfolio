/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Backend View: JsonView (V in MVC)
 * Formats model entities into standard RESTful JSON representations
 */
class JsonView {
  static renderSuccess(res, data, meta, statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      data,
      meta: {
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        ...meta
      }
    });
  }
  static renderError(res, message, statusCode = 400, details) {
    return res.status(statusCode).json({
      success: false,
      error: {
        message,
        statusCode,
        details,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      }
    });
  }
  static renderSqlResult(res, result) {
    return res.status(200).json({
      success: true,
      engine: "MySQL 8.0.35 (InnoDB)",
      executionTime: `${result.executionTimeMs} ms`,
      rowCount: result.rowCount,
      columns: result.columns,
      rows: result.rows,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  }
}
export {
  JsonView
};
