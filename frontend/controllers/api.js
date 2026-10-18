const API_BASE_URL = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

const apiUrl = (path) => {
  if (/^https?:\/\//i.test(path)) return path;
  if (path.startsWith("/frontend/assets/uploads/")) return `${API_BASE_URL}${path}`;
  return path;
};

const apiFetch = (path, options = {}) =>
  fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: "include"
  });

export { apiFetch, apiUrl };
