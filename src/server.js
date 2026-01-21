import express from "express";
import { callAPI } from "./apiCaller.js";

const app = express();

// ✅ BẮT BUỘC dùng PORT của Render
const PORT = process.env.PORT || 3000;

/**
 * Health check (Render gọi route này)
 */
app.get("/", (req, res) => {
  res.send("phatnguoi-api is running");
});

/**
 * API tra phạt nguội
 * Ví dụ:
 * /api/phatnguoi?bienso=50H71829&loaixe=oto
 */
app.get("/api/phatnguoi", async (req, res) => {
  const { bienso } = req.query;

  if (!bienso) {
    return res.status(400).json({
      status: "error",
      message: "Thiếu tham số bienso",
    });
  }

  try {
    const violations = await callAPI(bienso);

    if (!violations || violations.length === 0) {
      return res.json({
        status: "success",
        data: {
          bienSo: bienso,
          ketQua: "Không phát hiện vi phạm",
          danhSach: [],
          lastUpdate: new Date().toISOString(),
        },
      });
    }

    return res.json({
      status: "success",
      data: {
        bienSo: bienso,
        ketQua: "Có vi phạm",
        danhSach: violations,
        lastUpdate: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

/**
 * Start server
 */
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
