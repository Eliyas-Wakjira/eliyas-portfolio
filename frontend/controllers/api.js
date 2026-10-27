const API_BASE_URL = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");
const API_REQUEST_TIMEOUT_MS = 8_000;

const apiUrl = (path) => {
  if (/^https?:\/\//i.test(path)) return path;
  if (path.startsWith("/frontend/assets/uploads/")) return `${API_BASE_URL}${path}`;
  return path;
};

const apiFetch = async (path, options = {}) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_REQUEST_TIMEOUT_MS);
  const abortRequest = () => controller.abort(options.signal.reason);

  if (options.signal?.aborted) {
    abortRequest();
  } else {
    options.signal?.addEventListener("abort", abortRequest, { once: true });
  }

  try {
    return await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      credentials: "include",
      signal: controller.signal
    });
  } finally {
    clearTimeout(timeout);
    options.signal?.removeEventListener("abort", abortRequest);
  }
};

export { apiFetch, apiUrl };
