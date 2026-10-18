/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Backend Middleware: ErrorHandler
 */
import { JsonView } from '../views/jsonView.js';
function errorHandler(err, _req, res, _next) {
  const status = Number(err.status || err.statusCode) || 500;
  const message = status >= 400 && status < 500
    ? err.message || "Bad Request"
    : "Internal Server Error";
  if (status >= 500) {
    console.error("Unhandled Server Error:", err.message);
  }
  return JsonView.renderError(res, message, status);
}
export {
  errorHandler
};
