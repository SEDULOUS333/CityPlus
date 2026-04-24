// src/routes/reportRoutes.js
import express from "express";
import {
  createReport,
  getReports,
  getMyReports,
  updateReportStatus,
  deleteReport
} from "../controllers/reportController.js";

import upload from "../middleware/uploadMiddleware.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create report
router.post("/", protect, upload.single("image"), createReport);

// All reports (public)
router.get("/", getReports);

// My reports (user-specific)
router.get("/my", protect, getMyReports);

// Update status
router.put("/:id/status", protect, adminOnly, updateReportStatus);

router.delete("/:id", protect, deleteReport);

export default router;
