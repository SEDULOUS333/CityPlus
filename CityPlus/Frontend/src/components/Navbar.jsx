import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [loggedIn, setLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    setLoggedIn(!!token);
    setIsAdmin(role === "admin");
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.clear();
    setLoggedIn(false);
    setIsAdmin(false);
    navigate("/login");
  };

  const linkClass = (path) =>
    location.pathname === path
      ? "text-blue-600 border-b-2 border-blue-600 pb-1 font-semibold"
      : "text-gray-600 hover:text-gray-900 font-semibold";

  return (
    <header className="bg-white shadow-lg hover:shadow-xl transition-shadow border border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div
          className="text-blue-600 text-2xl font-bold cursor-pointer"
          onClick={() => navigate("/")}
        >
          CityPlus
        </div>

        {/* Nav Links */}
        <nav className="flex items-center gap-8">
          <Link to="/" className={linkClass("/")}>
            Home
          </Link>
          <Link to="/report" className={linkClass("/report")}>
            Report Issue
          </Link>
          <Link to="/map" className={linkClass("/map")}>
            Map
          </Link>

          {loggedIn && !isAdmin && (
            <Link to="/my-reports" className={linkClass("/my-reports")}>
              My Reports
            </Link>
          )}

          {loggedIn && isAdmin && (
            <Link to="/admin" className={linkClass("/admin")}>
              Admin
            </Link>
          )}
        </nav>

        {/* Auth Button */}
        {!loggedIn ? (
          <Link
            to="/login"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Login
          </Link>
        ) : (
          <button
            onClick={handleLogout}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Logout
          </button>
        )}
      </div>
    </header>
  );
}
