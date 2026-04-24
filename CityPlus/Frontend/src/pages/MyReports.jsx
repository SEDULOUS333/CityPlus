// src/pages/MyReports.jsx
import { useEffect, useState } from "react";
import { getMyReports, deleteReport } from "../services/api";

export default function MyReports() {
  const [reports, setReports] = useState([]);
  const [msg, setMsg] = useState("");

  const load = async () => {
    const res = await getMyReports();
    setReports(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (report) => {
    // ⭐ STATUS CHECK AFTER CLICK
    if (report.status !== "open") {
      alert(
        `You cannot delete this report because its status is "${report.status}".`
      );
      return;
    }

    if (!window.confirm("Delete this report?")) return;

    try {
      await deleteReport(report._id);
      setReports((prev) => prev.filter((r) => r._id !== report._id));
      setMsg("Report deleted successfully!");
    } catch (err) {
      console.error("Delete failed:", err);
      setMsg("Failed to delete report.");
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-center mb-6">My Reports</h1>

      {msg && <p className="text-center text-green-600">{msg}</p>}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map((r) => (
          <div
            key={r._id}
            className="bg-white p-4 rounded shadow border relative"
          >
            <h2 className="font-bold text-lg">{r.description}</h2>

            {r.imageUrl && (
              <img
                src={`http://localhost:5000${r.imageUrl}`}
                className="w-full h-40 object-cover rounded mt-2"
                alt="issue"
              />
            )}

            <p className="text-sm mt-2">
              <strong>Type:</strong> {r.type}
            </p>

            <p className="text-sm">
              <strong>Status:</strong>{" "}
              <span
                className={
                  r.status === "open"
                    ? "text-gray-700"
                    : r.status === "in progress"
                    ? "text-yellow-400"
                    : "text-green-600"
                }
              >
                {r.status}
              </span>
            </p>

            {/* DELETE BUTTON — ALWAYS VISIBLE */}
            <button
              onClick={() => handleDelete(r)}
              className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded w-full"
            >
              Delete Report
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
