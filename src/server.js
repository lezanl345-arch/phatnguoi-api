import express from "express";
import { callAPI } from "./apiCaller.js";

const app = express();
const PORT = process.env.PORT || 3000;

/**
 * Render health check
 */
app.get("/", (req, res) => {
  res.status(200).send("OK - phatnguoi api running");
});

/**
 * Log tất cả request (DEBUG)
 */
app.use((req, res, next) => {
  console.log("➡️ Incoming:", req.method, req.originalUrl);
  next();
});

/**
 * API tra phạt nguội
 */
app.get("/api/phatnguoi", async (req, res) => {
  const bienso = req.query.bienso || req.query.licensePlate;

  if (!bienso) {
    return res.status(400).json({
      status: "error",
      message: "Thiếu tham số bienso",
    });
  }

  try {
    const violations = await callAPI(bienso);

    return res.json({
      status: "success",
      data: {
        bienSo: bienso,
        ketQua:
          !violations || violations.length === 0
            ? "Không phát hiện vi phạm"
            : "Có vi phạm",
        danhSach: violations || [],
        lastUpdate: new Date().toISOString(),
      },
    });
  } catch (err) {
    console.error("❌ Error:", err);
    return res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
});

/**
 * Catch-all (để Render không nuốt request)
 */
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
    path: req.originalUrl,
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
