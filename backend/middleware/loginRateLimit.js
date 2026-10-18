import { JsonView } from "../views/jsonView.js";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const attemptsByIp = new Map();

function loginRateLimit(req, res, next) {
  const now = Date.now();
  const ip = req.ip || req.socket.remoteAddress || "unknown";

  for (const [key, entry] of attemptsByIp) {
    if (entry.resetAt <= now) attemptsByIp.delete(key);
  }

  const entry = attemptsByIp.get(ip);
  if (entry && entry.attempts >= MAX_ATTEMPTS) {
    res.set("Retry-After", String(Math.ceil((entry.resetAt - now) / 1000)));
    return JsonView.renderError(res, "Too many sign-in attempts. Try again later.", 429);
  }

  res.on("finish", () => {
    if (res.statusCode === 401) {
      const current = attemptsByIp.get(ip) || { attempts: 0, resetAt: now + WINDOW_MS };
      current.attempts += 1;
      attemptsByIp.set(ip, current);
    } else if (res.statusCode < 400) {
      attemptsByIp.delete(ip);
    }
  });

  next();
}

export { loginRateLimit };
