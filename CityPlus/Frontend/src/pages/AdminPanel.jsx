// src/pages/AdminPanel.jsx

import { useEffect, useState } from "react";
import { getReports, updateReportStatus, deleteReport } from "../services/api";

export default function AdminPanel() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await getReports();
        setReports(res.data);
      } catch (err) {
        console.error("❌ Error fetching reports:", err);
        setMessage("Failed to load reports.");
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  // ⭐ Update Status
  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await updateReportStatus(id, newStatus);

      setReports((prev) =>
        prev.map((r) =>
          r._id === id ? { ...r, status: res.data.report.status } : r
        )
      );

      setMessage("✅ Status updated!");
    } catch (err) {
      console.error("❌ Status update failed:", err);
      setMessage("Failed to update status.");
    }
  };

  // ⭐ Delete Report
  const handleDelete = async (id) => {
    if (!confirm("Admin: Delete this report?")) return;

    try {
      await deleteReport(id);

      setReports((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl text-gray-600">
        Loading reports...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h2 className="text-3xl font-bold text-center mb-6 text-blue-700">
        Admin Dashboard
      </h2>

      {message && (
        <p className="text-center mb-4 text-sm text-gray-700">{message}</p>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reports.map((report) => (
          <div
            key={report._id}
            className="bg-white shadow p-4 rounded-lg border border-gray-200 relative"
          >
            {/* 🗑️ Trash Icon */}
            <button
              onClick={() => handleDelete(report._id)}
              className="absolute bottom-3 right-3 text-red-600 hover:text-red-800 text-2xl"
              title="Delete Report"
            >
              🗑️
            </button>

            <h2 className="text-xl font-semibold mb-2">{report.description}</h2>

            {report.imageUrl && (
              <img
                src={`http://localhost:5000${report.imageUrl}`}
                alt="Issue"
                className="w-full h-48 object-cover rounded mb-3"
              />
            )}

            <p>
              <strong>User Selected:</strong> {report.type}
            </p>

            {report.address && (
              <p className="mt-1">
                <strong>Address:</strong>{" "}
                <span className="text-gray-700">{report.address}</span>
              </p>
            )}

            <p className="mt-1">
              <strong>AI Final Type:</strong>{" "}
              <span className="text-blue-600 font-medium">
                {report.aiFinalType || "N/A"}
              </span>
            </p>

            <p className="mt-1">
              <strong>AI Confidence:</strong>{" "}
              {report.aiConfidence
                ? (report.aiConfidence * 100).toFixed(1) + "%"
                : "N/A"}
            </p>

            <p className="mt-1">
              <strong>Status:</strong> {report.status}
            </p>

            {/* ⭐ STATUS BUTTONS */}
            <div className="mt-3 flex gap-3">
              <button
                onClick={() => handleStatusChange(report._id, "open")}
                className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
              >
                Open
              </button>

              <button
                onClick={() => handleStatusChange(report._id, "in progress")}
                className="px-3 py-1 bg-yellow-400 rounded hover:bg-yellow-500"
              >
                In Progress
              </button>

              <button
                onClick={() => handleStatusChange(report._id, "resolved")}
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Resolved
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
