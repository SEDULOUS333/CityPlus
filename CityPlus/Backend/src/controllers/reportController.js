// src/controllers/reportController.js

import fs from "fs";
import axios from "axios";
import FormData from "form-data";
import Report from "../models/Report.js";

import upload from "../middleware/uploadMiddleware.js";



// ---------------------------------------------------
// CREATE REPORT WITH AI INTEGRATION
// ---------------------------------------------------
export const createReport = async (req, res) => {
  try {
    const { description, type, lat, lng, address } = req.body;

    if (!description || !lat || !lng) {
      return res
        .status(400)
        .json({ message: "Description and coordinates are required" });
    }

    // Cloudinary gives full URL in req.file.path
    const imageUrl = req.file ? req.file.path : "";

    // -----------------------
    // AI TEXT PREDICTION
    // -----------------------
    let aiTextResult = { predicted: type, confidence: 0.55 };

    try {
      const textRes = await axios.post("http://localhost:8000/predict/text", {
        text: description,
      });
      aiTextResult = textRes.data;
    } catch (err) {
      console.log("AI TEXT ERROR:", err.message);
    }

    // -----------------------
    // AI IMAGE PREDICTION
    // -----------------------
    let aiImageResult = { predicted: type, confidence: 0.40 };

    try {
      if (req.file && imageUrl) {
        // Download image from Cloudinary URL
        const response = await axios.get(imageUrl, { responseType: "stream" });
        const formData = new FormData();
        formData.append("file", response.data, {
          filename: "image.jpg",
        });

        const imgRes = await axios.post(
          "http://localhost:8000/predict/image",
          formData,
          { headers: formData.getHeaders() }
        );
        aiImageResult = imgRes.data;
      }
    } catch (err) {
      console.log("AI IMAGE ERROR:", err.message);
    }

    // -------------------------------
    // FINAL AI DECISION
    // -------------------------------
    let finalAIType = type;

    if (aiImageResult.confidence >= 0.70) {
      finalAIType = aiImageResult.predicted;
    } else if (aiTextResult.confidence >= 0.70) {
      finalAIType = aiTextResult.predicted;
    }

    const finalConfidence = Math.max(
      aiImageResult.confidence,
      aiTextResult.confidence
    );

    // ---------------------------------------------------
    // SAVE REPORT
    // ---------------------------------------------------
    const newReport = await Report.create({
      userId: req.user ? req.user.id : null,
      description,
      type,
      imageUrl,
      address: address || "",
      location: {
        type: "Point",
        coordinates: [parseFloat(lng), parseFloat(lat)],
      },
      aiImageType: aiImageResult.predicted,
      aiTextType: aiTextResult.predicted,
      aiFinalType: finalAIType,
      aiConfidence: finalConfidence,
      status: "open",
    });

    return res.status(201).json({
      message: "Report created successfully",
      report: newReport,
    });
  } catch (err) {
    console.error("Error creating report:", err.message);
    res.status(500).json({ message: "Error creating report" });
  }
};

// ---------------------------------------------------
// GET ALL REPORTS
// ---------------------------------------------------
export const getReports = async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.status(200).json(reports);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching reports" });
  }
};

// ---------------------------------------------------
// GET LOGGED-IN USER REPORTS
// ---------------------------------------------------
export const getMyReports = async (req, res) => {
  try {
    const userId = req.user.id;
    const myReports = await Report.find({ userId }).sort({ createdAt: -1 });
    return res.status(200).json(myReports);
  } catch (err) {
    console.error("Error fetching user's reports:", err.message);
    res.status(500).json({ message: "Error fetching your reports" });
  }
};

// ---------------------------------------------------
// UPDATE REPORT STATUS (ADMIN ONLY)
// ---------------------------------------------------
export const updateReportStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedReport = await Report.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedReport) {
      return res.status(404).json({ message: "Report not found" });
    }

    return res.status(200).json({
      message: "Status updated",
      report: updatedReport,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating report" });
  }
};

// ---------------------------------------------------
// DELETE REPORT (OWNER ONLY)
// ---------------------------------------------------
export const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;

    const report = await Report.findById(id);
    if (!report) return res.status(404).json({ message: "Report not found" });

    if (report.userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this report" });
    }

    // No local file deletion needed for Cloudinary images

    await report.deleteOne();

    return res.status(200).json({ message: "Report deleted successfully" });
  } catch (err) {
    console.error("Delete Error:", err.message);
    res.status(500).json({ message: "Error deleting report" });
  }
};

// ---------------------------------------------------
// FINAL EXPORT BLOCK (IMPORTANT!)
// ---------------------------------------------------
