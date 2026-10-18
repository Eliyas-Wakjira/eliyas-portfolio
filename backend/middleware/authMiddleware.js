/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Backend Middleware: AuthMiddleware
 */
import { JsonView } from "../views/jsonView.js";
import { verifySessionToken } from "../utils/sessionToken.js";

const SESSION_COOKIE = "portfolio_session";

function requireAuth(req, res, next) {
  const cookie = req.headers.cookie
    ?.split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${SESSION_COOKIE}=`));
  const user = verifySessionToken(cookie?.slice(SESSION_COOKIE.length + 1));
  if (!user) return JsonView.renderError(res, "Authentication required", 401);
  req.authUser = user;
  next();
}

export { requireAuth };
