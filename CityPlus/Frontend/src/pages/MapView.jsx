import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { getReports } from "../services/api";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icons (Vite issue)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function MapView() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await getReports();
        setReports(res.data);
      } catch (err) {
        console.error("❌ Error loading reports:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl text-gray-600">
        Loading reports...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-6 p-4">
      <div className="bg-white shadow-xl rounded-xl p-4 border border-gray-200">
        <h1 className="text-2xl font-bold mb-4 text-center">Reported Issues Map</h1>

        {/* Map Box */}
        <div className="w-full h-[450px] rounded-xl overflow-hidden">
          <MapContainer
            center={[12.9716, 77.5946]}
            zoom={13}
            className="w-full h-full"
          >
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {reports.length > 0 ? (
              reports.map((report) => (
                <Marker
                  key={report._id}
                  position={[
                    report.location.coordinates[1],
                    report.location.coordinates[0],
                  ]}
                >
                  <Popup>
                    <div className="text-sm leading-tight">
                      <p className="font-semibold uppercase">
                        USER SELECTED: {report.type}
                      </p>

                      <p className="font-semibold text-blue-600">
                        AI FINAL TYPE: {report.aiFinalType || "N/A"}
                      </p>

                      <p className="text-xs text-gray-500">
                        Confidence:{" "}
                        {report.aiConfidence
                          ? (report.aiConfidence * 100).toFixed(1) + "%"
                          : "N/A"}
                      </p>

                      <p className="mt-1">{report.description}</p>

                      {/* ADDRESS */}
                      {report.address && (
                        <p className="text-xs text-gray-600 mt-1">
                          <strong>Address:</strong> {report.address}
                        </p>
                      )}

                      <p className="text-xs text-gray-500">
                        Status: {report.status}
                      </p>

                      {report.imageUrl && (
                        <img
                          src={`http://localhost:5000${report.imageUrl}`}
                          alt="Issue"
                          className="mt-2 w-40 rounded-md"
                        />
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))
            ) : (
              <p className="absolute top-5 left-5 bg-white p-2 rounded-md shadow-md">
                No reports available
              </p>
            )}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
