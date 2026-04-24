// src/services/localStore.js
const KEY = "cityplus_reports_v1";

export function loadReports() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveReports(reports) {
  localStorage.setItem(KEY, JSON.stringify(reports));
}

export function addReport(report) {
  const data = loadReports();
  data.unshift(report);
  saveReports(data);
}

export function updateReport(id, updates) {
  const data = loadReports().map((r) =>
    r._id === id ? { ...r, ...updates } : r
  );
  saveReports(data);
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
