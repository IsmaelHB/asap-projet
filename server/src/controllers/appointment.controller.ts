// server/src/controllers/appointment.controller.ts

import { Request, Response, NextFunction } from "express";
import prisma from "../config/database";

// ================== VALIDATIONS ==================

export const createAppointmentValidation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const body = req.body || {};

  const artisanId = body.artisanId ?? body.artisan_id;
  const serviceId = body.serviceId ?? body.service_id;

  const customerName = body.customerName ?? body.customer_name;
  const customerEmail = body.customerEmail ?? body.customer_email;
  const customerPhone = body.customerPhone ?? body.customer_phone;

  const start = body.slotStart ?? body.slot_start ?? body.startTime;
  const end = body.slotEnd ?? body.slot_end ?? body.endTime;

  if (
    !artisanId ||
    !serviceId ||
    !customerName ||
    !customerEmail ||
    !customerPhone ||
    !start ||
    !end
  ) {
    return res
      .status(400)
      .json({ message: "Champs obligatoires manquants pour le rendez-vous." });
  }

  return next();
};

export const listAppointmentsValidation = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const { from, to } = req.query;

  if (
    (from && isNaN(Date.parse(from as string))) ||
    (to && isNaN(Date.parse(to as string)))
  ) {
    return next(new Error("Paramètres de date invalides (from / to)."));
  }

  return next();
};

export const updateStatusValidation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { status } = req.body || {};
  const allowed = ["PENDING", "CONFIRMED", "CANCELLED", "NO_SHOW"];

  if (!status || !allowed.includes(status)) {
    return res.status(400).json({ message: "Statut invalide." });
  }

  return next();
};

// ================== CREATE APPOINTMENT ==================

export const createAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("🆕 Nouveau RDV reçu:", req.body);

    // Accepte snake_case & camelCase
    const artisanId = req.body.artisanId ?? req.body.artisan_id;
    const serviceId = req.body.serviceId ?? req.body.service_id;

    const customerName = req.body.customerName ?? req.body.customer_name;
    const customerEmail = req.body.customerEmail ?? req.body.customer_email;
    const customerPhone = req.body.customerPhone ?? req.body.customer_phone;
    const customerNotes = req.body.customerNotes ?? req.body.customer_notes;

    const rawStart =
      req.body.slotStart ?? req.body.slot_start ?? req.body.startTime;
    const rawEnd =
      req.body.slotEnd ?? req.body.slot_end ?? req.body.endTime;

    const slotStart = new Date(rawStart);
    const slotEnd = new Date(rawEnd);

    if (isNaN(slotStart.getTime()) || isNaN(slotEnd.getTime())) {
      return res.status(400).json({ message: "Dates invalides." });
    }

    // 1) Création en BDD
    const appointment = await prisma.appointment.create({
      data: {
        artisanId,
        serviceId,
        customerName,
        customerEmail,
        customerPhone,
        customerNotes,
        slotStart,
        slotEnd,
      } as any,
    });

    // 2) Webhook N8N (async, non bloquant)
    const webhookUrl = process.env.N8N_APPOINTMENT_WEBHOOK_URL;

    if (webhookUrl) {
      (async () => {
        try {
          await fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              appointmentId: appointment.id,
              artisanId: appointment.artisanId,
              serviceId: appointment.serviceId,
              slotStart: (appointment as any).slotStart.toISOString(),
              slotEnd: (appointment as any).slotEnd.toISOString(),
              customerName: appointment.customerName,
              customerPhone: appointment.customerPhone,
              customerEmail: appointment.customerEmail,
              customerNotes: appointment.customerNotes,
              status: appointment.status,
              cancellationFeeCents: appointment.cancellationFeeCents,
              source: "ASAP",
            }),
          });
        } catch (err) {
          console.error("Erreur webhook N8N:", err);
        }
      })();
    }

    // 3) Réponse au client (on donne id ET appointment)
    console.log("✅ RDV créé :", appointment);

    return res.status(201).json({
      id: appointment.id,
      appointment,
    });
  } catch (err: any) {
    console.error("❌ Erreur createAppointment:", err);
    return res.status(500).json({
      message: "Erreur serveur lors de la création du rendez-vous.",
      error: err?.message ?? String(err),
    });
  }
};

// ================== OTHER CONTROLLERS ==================

export const getAppointment = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id: req.params.id },
    });

    if (!appointment) {
      return res.status(404).json({ message: "Rendez-vous introuvable." });
    }

    return res.json(appointment);
  } catch (err: any) {
    console.error("❌ Erreur getAppointment:", err);
    return res.status(500).json({
      message: "Erreur serveur lors de la récupération du rendez-vous.",
      error: err?.message ?? String(err),
    });
  }
};

export const listAppointments = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  try {
    const where: any = {};

    if (req.query.status) where.status = req.query.status;
    if (req.query.from)
      where.slotStart = { gte: new Date(req.query.from as string) };
    if (req.query.to)
      where.slotEnd = { lte: new Date(req.query.to as string) };

    const appointments = await prisma.appointment.findMany({
      where,
      orderBy: { slotStart: "asc" } as any,
    });

    return res.json(appointments);
  } catch (err: any) {
    console.error("❌ Erreur listAppointments:", err);
    return res.status(500).json({
      message: "Erreur serveur lors de la récupération des rendez-vous.",
      error: err?.message ?? String(err),
    });
  }
};

export const cancelAppointment = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  try {
    const appointment = await prisma.appointment.update({
      where: { id: req.params.id },
      data: { status: "CANCELLED" },
    });

    return res.json(appointment);
  } catch (err: any) {
    console.error("❌ Erreur cancelAppointment:", err);
    return res.status(500).json({
      message: "Erreur serveur lors de l'annulation du rendez-vous.",
      error: err?.message ?? String(err),
    });
  }
};

export const updateAppointmentStatus = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  try {
    const appointment = await prisma.appointment.update({
      where: { id: req.params.id },
      data: { status: req.body.status },
    });

    return res.json(appointment);
  } catch (err: any) {
    console.error("❌ Erreur updateAppointmentStatus:", err);
    return res.status(500).json({
      message: "Erreur serveur lors de la mise à jour du statut.",
      error: err?.message ?? String(err),
    });
  }
};

export const markNoShow = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  try {
    const appointment = await prisma.appointment.update({
      where: { id: req.params.id },
      data: { status: "NO_SHOW" },
    });

    return res.json(appointment);
  } catch (err: any) {
    console.error("❌ Erreur markNoShow:", err);
    return res.status(500).json({
      message: "Erreur serveur lors du marquage en no-show.",
      error: err?.message ?? String(err),
    });
  }
};

