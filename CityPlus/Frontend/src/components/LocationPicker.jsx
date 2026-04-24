import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Check if location is inside INDIA
function isInsideIndia(lat, lng) {
  return lat >= 6.0 && lat <= 37.5 && lng >= 68.0 && lng <= 97.5;
}

// Get address using OpenStreetMap
async function getAddress(lat, lng) {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
  );
  const data = await res.json();
  return data.display_name || "Unknown location";
}

function LocationMarker({ setPosition }) {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;

      if (!isInsideIndia(lat, lng)) {
        alert("❌ Selected location is outside India!");
        return;
      }

      const address = await getAddress(lat, lng);

      setPosition({ lat, lng, address });
    },
  });

  return null;
}

export default function LocationPicker({ setLocation }) {
  const [position, setPosition] = useState(null);

  // Auto-fetch GPS
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      if (!isInsideIndia(lat, lng)) {
        alert("❌ Your GPS location is outside India! Please select manually.");
        return;
      }

      const address = await getAddress(lat, lng);

      const newPos = { lat, lng, address };
      setPosition(newPos);
      setLocation(newPos);
    });
  }, []);

  return (
    <div>
      <h3 className="font-semibold mt-3 mb-1">Your Location:</h3>

      <p className="text-sm text-gray-600 mb-2">
        {position ? position.address : "Fetching location..."}
      </p>

      <div className="w-full h-[300px] rounded-lg overflow-hidden border">
        <MapContainer
          center={position ? [position.lat, position.lng] : [20.5937, 78.9629]} // center of India
          zoom={position ? 15 : 5}
          className="w-full h-full"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          <LocationMarker
            setPosition={(pos) => {
              setPosition(pos);
              setLocation(pos);
            }}
          />

          {position && <Marker position={[position.lat, position.lng]} />}
        </MapContainer>
      </div>
    </div>
  );
}
