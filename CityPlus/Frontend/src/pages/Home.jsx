import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowRight, Zap, Map, Settings, User } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();

  const [loggedIn, setLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    setLoggedIn(!!token);
    setIsAdmin(role === "admin");
  }, []);

  return (
    <main className="max-w-7xl mx-auto px-6 py-16">
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4 max-w-xl">
            CityPlus lets citizens quickly report civic problems and track
            fixes.
          </h1>

          <p className="text-gray-600 mb-8 max-w-xl font-medium">
            Transparent reporting, quick triage, and public visibility built for
            civic impact
          </p>

          <div className="flex gap-4">
            <button
              onClick={() => navigate("/report")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Report an Issue
            </button>

            <button
              onClick={() => navigate("/map")}
              className="bg-white text-blue-600 border-2 border-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors font-semibold"
            >
              View City Map
            </button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Report Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow border border-gray-100">
            <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Report an Issue
            </h3>
            <p className="text-gray-600 mb-6 font-medium">
              Upload photo, pick location and submit
            </p>
            <button
              onClick={() => navigate("/report")}
              className="text-blue-600 hover:text-blue-700 flex items-center gap-2 transition-colors font-semibold"
            >
              <ArrowRight className="w-4 h-4" />
              Start Reporting
            </button>
          </div>

          {/* Map Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow border border-gray-100">
            <div className="w-14 h-14 bg-cyan-500 rounded-xl flex items-center justify-center mb-6">
              <Map className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">View Map</h3>
            <p className="text-gray-600 mb-6 font-medium">
              See all reported issues with filters and status
            </p>
            <button
              onClick={() => navigate("/map")}
              className="text-blue-600 hover:text-blue-700 flex items-center gap-2 transition-colors font-semibold"
            >
              <ArrowRight className="w-4 h-4" />
              Open Map
            </button>
          </div>

          {/* THIRD CARD — ADMIN or MY REPORTS */}
          {isAdmin ? (
            /* ADMIN CARD */
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
                <Settings className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Admin Dashboard
              </h3>
              <p className="text-gray-600 mb-6 font-medium">
                Manage reports, update status, remove fake issues
              </p>
              <button
                onClick={() => navigate("/admin")}
                className="text-blue-600 hover:text-blue-700 flex items-center gap-2 transition-colors font-semibold"
              >
                <ArrowRight className="w-4 h-4" />
                <span>Open Admin</span>
              </button>
            </div>
          ) : (
            /* MY REPORTS CARD */
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-14 h-14 bg-green-600 rounded-xl flex items-center justify-center mb-6">
                <User className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                My Reports
              </h3>
              <p className="text-gray-600 mb-6 font-medium">
                Track issues you reported and manage them
              </p>
              <button
                onClick={() =>
                  loggedIn ? navigate("/my-reports") : navigate("/login")
                }
                className="text-blue-600 hover:text-blue-700 flex items-center gap-2 transition-colors font-semibold"
              >
                <ArrowRight className="w-4 h-4" />
                <span>View My Reports</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
