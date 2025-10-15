import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

export function createFormData(data) {
  const fd = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      fd.append(key, value);
    }
  });
  return fd;
}

export function getMediaUrl(pathOrUrl) {
  if (!pathOrUrl) return "";
  if (typeof pathOrUrl === "string" && (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://"))) {
    return pathOrUrl;
  }
  // Para FileSystemStorage local que devuelve rutas relativas
  return `${API_BASE_URL}${pathOrUrl}`;
}


