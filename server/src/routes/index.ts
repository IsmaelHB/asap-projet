import { Router } from "express";
import artisanPrivateRoutes from "./artisan.routes";
import appointmentRoutes from "./appointment.routes";
import prisma from "../config/database";
// CETTE LIGNE EST CRUCIALE
import { getArtisanProfileBySlug } from "../controllers/artisan.controller";

const router = Router();

// ========= ROUTES PUBLIQUES =========

// 1. Recherche (Liste)
router.get("/artisans", async (req, res, next) => {
  try {
    const { city, search, categoryId } = req.query;
    const where: any = {};

    if (city) where.city = String(city).toLowerCase();
    if (categoryId) where.category = String(categoryId);
    if (search) where.name = { contains: String(search), mode: "insensitive" };

    const artisans = await prisma.artisan.findMany({
      where,
      include: { services: true },
    });

    return res.json(artisans);
  } catch (err) {
    return next(err);
  }
});

// 2. LA ROUTE QUI VOUS MANQUE (Profil unique)
// C'est celle qui provoque votre erreur "Impossible de charger..."
router.get("/artisans/:slug", getArtisanProfileBySlug);

// 3. LA ROUTE DES DISPONIBILITÉS (Pour le calendrier)
import { getPublicAvailability } from "../controllers/public-availability.controller";
router.get("/artisans/:id/availability", getPublicAvailability);


// ========= ROUTES PRIVÉES ARTISAN =========
router.use("/artisan", artisanPrivateRoutes);

// ========= RENDEZ-VOUS =========
router.use("/appointments", appointmentRoutes);

export default router;