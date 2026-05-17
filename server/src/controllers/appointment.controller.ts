import { Request, Response, NextFunction } from "express";
import prisma from "../config/database";

// ================== CREATE APPOINTMENT ==================

export const createAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Gestion des fichiers via Multer
    const reqAny = req as any;
    const files = reqAny.files;
    const photos = Array.isArray(files) ? files.map((f: any) => f.filename) : [];

    const body = req.body;

    // Extraction et conversion
    const artisanId = body.artisanId;
    const serviceId = body.serviceId;
    const customerName = body.customerName;
    const customerEmail = body.customerEmail;
    const customerPhone = body.customerPhone;
    const customerNotes = body.customerNotes;
    
    const slotStart = new Date(body.slotStart);
    const slotEnd = new Date(body.slotEnd);

    // Validation
    if (!artisanId || !serviceId || !customerName) {
      return res.status(400).json({ message: "Champs manquants" });
    }

    if (!customerNotes || customerNotes.trim().length === 0) {
      return res.status(400).json({ message: "Description obligatoire." });
    }

    // Création en BDD
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
        photos,
        status: "PENDING"
      } as any, // N'oubliez pas la virgule ici !
      
      // 
      include: {
        artisan: true, // Permet d'avoir le nom et la catégorie
        service: true  // Permet d'avoir le nom de la prestation
      }
      //
    });

    // Envoi au Webhook N8N
    const webhookUrl = process.env.N8N_APPOINTMENT_WEBHOOK_URL;
    if (webhookUrl) {
      const serverUrl = process.env.SERVER_URL || "http://localhost:3000";
      const photoUrls = photos.map((p: string) => `${serverUrl}/uploads/${p}`);
      
      fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            ...appointment, // Contient maintenant artisan{} et service{}
            photoUrls, 
            source: "ASAP",
            aiAction: "QUALIFICATION_CALL"
        })
      }).catch(err => console.error("❌ Erreur Webhook:", err));
    }

    return res.status(201).json({ id: appointment.id, appointment });

  } catch (err: any) {
    console.error("❌ Erreur createAppointment:", err);
    return res.status(500).json({ message: "Erreur serveur.", error: err?.message });
  }
};

// ... (Gardez les autres contrôleurs inchangés ci-dessous)
export const getAppointment = async (req: Request, res: Response) => {
    try {
      const appointment = await prisma.appointment.findUnique({ 
          where: { id: req.params.id }, 
          include: { service: true, artisan: true } 
      });
      if (!appointment) return res.status(404).json({ message: "Introuvable" });
      return res.json(appointment);
    } catch(e:any) { return res.status(500).json({error: e.message}); }
};

export const listAppointments = async (req: Request, res: Response) => {
    try {
      const where: any = {};
      if (req.query.status) where.status = req.query.status;
      if (req.query.from) where.slotStart = { gte: new Date(req.query.from as string) };
      if (req.query.to) where.slotEnd = { lte: new Date(req.query.to as string) };

      const appointments = await prisma.appointment.findMany({ 
          where, 
          orderBy: { slotStart: "asc" } as any 
      });
      return res.json(appointments);
    } catch(e:any) { return res.status(500).json({error: e.message}); }
};

export const cancelAppointment = async (req: Request, res: Response) => {
    try {
      const appointment = await prisma.appointment.update({ 
          where: { id: req.params.id }, 
          data: { status: "CANCELLED" } 
      });
      return res.json(appointment);
    } catch(e:any) { return res.status(500).json({error: e.message}); }
};

export const updateAppointmentStatus = async (req: Request, res: Response) => {
    try {
        const appointment = await prisma.appointment.update({ 
            where: { id: req.params.id }, 
            data: { status: req.body.status } 
        });
        return res.json(appointment);
    } catch(e:any) { return res.status(500).json({error: e.message}); }
};

export const markNoShow = async (req: Request, res: Response) => {
    try {
        const appointment = await prisma.appointment.update({ 
            where: { id: req.params.id }, 
            data: { status: "NO_SHOW" } 
        });
        return res.json(appointment);
    } catch(e:any) { return res.status(500).json({error: e.message}); }
};

export const createAppointmentValidation = (req: Request, res: Response, next: NextFunction) => next();
export const listAppointmentsValidation = (req: Request, res: Response, next: NextFunction) => next();
export const updateStatusValidation = (req: Request, res: Response, next: NextFunction) => next();