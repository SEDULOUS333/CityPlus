import { useState } from "react";
import { createReport } from "../services/api";
import LocationPicker from "../components/LocationPicker";

export default function ReportForm() {
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [location, setLocation] = useState({ lat: "", lng: "", address: "" });
  const [message, setMessage] = useState("");

  // 📸 Handle Image Upload + Preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  // 📤 Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // VALIDATIONS
    if (!description.trim()) {
      setMessage("⚠️ Description is required");
      return;
    }
    if (!type) {
      setMessage("⚠️ Please select an issue type");
      return;
    }
    if (!image) {
      setMessage("⚠️ Please upload an image");
      return;
    }
    if (!location.lat || !location.lng) {
      setMessage("⚠️ Select location on map or allow location access");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("description", description);
      formData.append("type", type);
      formData.append("lat", location.lat);
      formData.append("lng", location.lng);
      formData.append("address", location.address);

      // ❗ MUST BE "image" — backend expects upload.single("image")
      formData.append("image", image);

      const res = await createReport(formData);

      if (res.status === 201) {
        setMessage("✅ Report submitted successfully!");
        setDescription("");
        setType("");
        setImage(null);
        setPreview(null);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to submit report");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">
          Report an Issue
        </h2>

        {/* 📝 Description */}
        <textarea
          className="w-full border p-3 rounded-md mb-3"
          placeholder="Describe the issue..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        {/* 🏷 Select Type */}
        <select
          className="w-full border p-3 rounded-md mb-3"
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
        >
          <option value="">-- Select Issue Type --</option>
          <option value="pothole">Pothole</option>
          <option value="garbage">Garbage</option>
          <option value="streetlight">Streetlight</option>
          <option value="waterlogging">Waterlogging</option>
          <option value="other">Other</option>
        </select>

        {/* 📸 Image Box */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg mb-3 p-4 text-center">
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="w-full h-40 object-cover rounded-lg mb-3"
            />
          ) : (
            <p className="text-gray-500 mb-3">Upload an image (required)</p>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full"
            required
          />
        </div>

        {/* 📍 Location Picker Component */}
        <LocationPicker setLocation={setLocation} />

        {/* Submit */}
        <button
          type="submit"
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md w-full"
        >
          Submit Report
        </button>

        {message && (
          <p className="text-center mt-4 text-sm text-gray-700">{message}</p>
        )}
      </form>
    </div>
  );
}
