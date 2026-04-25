import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";

dotenv.config();

// connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// middlewares
app.use(cors({
  origin: 'https://citypluss.netlify.app',
  credentials: true
}));
app.use(express.json());


// routes
app.use("/api/users", userRoutes);
app.use("/api/reports", reportRoutes);

// default route
app.get("/", (req, res) => {
  res.send("CityPlus backend running ✅ (Users + Reports active)");
});

// start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
