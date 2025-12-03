import { Router } from "express";
import { authenticateToken } from "../middleware/auth";

import {
  createAppointment,
  getAppointment,
  listAppointments,
  cancelAppointment,
  updateAppointmentStatus,
  markNoShow,
  createAppointmentValidation,
  listAppointmentsValidation,
  updateStatusValidation,
} from "../controllers/appointment.controller";

const router = Router();

// ======== ROUTES PUBLIQUES (Client) ========

/**
 * @route POST /api/appointments
 * @desc Création d'un nouveau rendez-vous
 * @access Public
 */
router.post("/", createAppointmentValidation, createAppointment);

/**
 * @route GET /api/appointments/:id
 * @desc Détails d'un rendez-vous
 * @access Public
 */
router.get("/:id", getAppointment);

/**
 * @route POST /api/appointments/:id/cancel
 * @desc Annuler un rendez-vous (avec calcul des frais)
 * @access Public
 */
router.post("/:id/cancel", cancelAppointment);

// ======== ROUTES ARTISAN (Protégées par JWT) ========

/**
 * @route GET /api/appointments
 * @desc Liste des rendez-vous de l'artisan
 * @access Private (Artisan)
 */
router.get(
  "/",
  authenticateToken,
  listAppointmentsValidation,
  listAppointments
);

/**
 * @route PATCH /api/appointments/:id/status
 * @desc Mettre à jour le statut du RDV (CONFIRMED, CANCELLED, NO_SHOW)
 * @access Private (Artisan)
 */
router.patch(
  "/:id/status",
  authenticateToken,
  updateStatusValidation,
  updateAppointmentStatus
);

/**
 * @route POST /api/appointments/:id/no-show
 * @desc Marquer un RDV comme absent (No-Show)
 * @access Private (Artisan)
 */
router.post("/:id/no-show", authenticateToken, markNoShow);

export default router;
