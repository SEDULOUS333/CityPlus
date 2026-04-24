import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!token) {
    // 🚫 No token → redirect to login
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== "admin") {
    // 🚫 Not an admin → redirect to home
    return <Navigate to="/" replace />;
  }

  // ✅ Authenticated → allow access
  return children;
}
