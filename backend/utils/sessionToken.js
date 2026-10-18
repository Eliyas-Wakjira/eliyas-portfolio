import { createHmac, timingSafeEqual } from "node:crypto";

const TOKEN_LIFETIME_SECONDS = 60 * 60;

function getSigningSecret() {
  const secret = process.env.AUTH_TOKEN_SECRET;
  if (!secret || Buffer.byteLength(secret) < 32) {
    throw new Error("AUTH_TOKEN_SECRET must be configured with at least 32 bytes");
  }
  return secret;
}

function sign(value, secret) {
  return createHmac("sha256", secret).update(value).digest();
}

export function createSessionToken(user) {
  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const payload = Buffer.from(JSON.stringify({
    sub: user.id,
    email: user.email,
    role: user.role,
    iat: now,
    exp: now + TOKEN_LIFETIME_SECONDS
  })).toString("base64url");
  const unsignedToken = `${header}.${payload}`;
  const signature = sign(unsignedToken, getSigningSecret()).toString("base64url");
  return `${unsignedToken}.${signature}`;
}

export function verifySessionToken(token) {
  if (typeof token !== "string" || token.length > 2048) return null;

  const parts = token.split(".");
  if (parts.length !== 3) return null;

  try {
    const secret = getSigningSecret();
    const unsignedToken = `${parts[0]}.${parts[1]}`;
    const actualSignature = Buffer.from(parts[2], "base64url");
    const expectedSignature = sign(unsignedToken, secret);
    if (
      actualSignature.length !== expectedSignature.length ||
      !timingSafeEqual(actualSignature, expectedSignature)
    ) {
      return null;
    }

    const header = JSON.parse(Buffer.from(parts[0], "base64url").toString("utf8"));
    const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8"));
    const now = Math.floor(Date.now() / 1000);
    if (
      header.alg !== "HS256" ||
      header.typ !== "JWT" ||
      !Number.isInteger(payload.sub) ||
      typeof payload.email !== "string" ||
      !["admin", "super_admin"].includes(payload.role) ||
      !Number.isInteger(payload.exp) ||
      payload.exp <= now
    ) {
      return null;
    }

    return { id: payload.sub, email: payload.email, role: payload.role };
  } catch {
    return null;
  }
}

export { TOKEN_LIFETIME_SECONDS };
