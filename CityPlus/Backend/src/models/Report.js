import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    // User-selected type
    type: {
      type: String,
      enum: ["pothole", "garbage", "streetlight", "waterlogging", "other"],
      default: "other",
    },

    imageUrl: {
      type: String,
      default: "",
    },

    // Address (reverse-geocoded human-readable)
    address: {
      type: String,
      default: "",
    },

    // GeoJSON format
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },

    // ---------------------------
    // 🔥 AI PREDICTION FIELDS
    // ---------------------------

    // Prediction from IMAGE MODEL (EfficientNet)
    aiImageType: {
      type: String,
      default: "unknown",
    },

    // Prediction from TEXT MODEL (simple rule-based)
    aiTextType: {
      type: String,
      default: "unknown",
    },

    // Final AI decision after weighted fusion
    aiFinalType: {
      type: String,
      default: "other",
    },

    // Highest confidence among the AI models
    aiConfidence: {
      type: Number,
      default: 0,
    },

    // ---------------------------
    // STATUS FIELD
    // ---------------------------
    status: {
      type: String,
      enum: ["open", "in progress", "resolved"],
      default: "open",
    },
  },
  { timestamps: true }
);

reportSchema.index({ location: "2dsphere" });

export default mongoose.model("Report", reportSchema);
