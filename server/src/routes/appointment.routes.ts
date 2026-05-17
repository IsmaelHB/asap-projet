import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { authenticateToken } from "../middleware/auth";
import {
  createAppointment,
  getAppointment,
  listAppointments,
  cancelAppointment,
  updateAppointmentStatus,
  markNoShow,
} from "../controllers/appointment.controller";

const router = Router();

// Config Multer
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Routes
// C'est cette ligne qui plantait si createAppointment était undefined
router.post("/", upload.array("photos", 2), createAppointment);

router.get("/:id", getAppointment);
router.post("/:id/cancel", cancelAppointment);

router.get("/", authenticateToken, listAppointments);
router.patch("/:id/status", authenticateToken, updateAppointmentStatus);
router.post("/:id/no-show", authenticateToken, markNoShow);

export default router;