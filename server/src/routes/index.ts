// server/src/routes/index.ts
import { Router } from "express";
import artisanPrivateRoutes from "./artisan.routes";
import appointmentRoutes from "./appointment.routes";
import prisma from "../config/database";

const router = Router();

// ========= ROUTES PUBLIQUES =========

// GET /api/artisans?city=lyon&search=plombier&categoryId=...&page=...
router.get("/artisans", async (req, res, next) => {
  try {
    const { city, search, categoryId } = req.query;

    const where: any = {
      // tu peux adapter ce filtre si tu as un champ isActive ou autre
      // isActive: true,
    };

    if (city) {
      // ex : "Lyon" -> "lyon"
      where.city = String(city);
      // ou where.citySlug = String(city).toLowerCase();
    }

    if (categoryId) {
      where.categoryId = String(categoryId);
    }

    if (search) {
      where.name = {
        contains: String(search),
        mode: "insensitive",
      };
    }

    const artisans = await prisma.artisan.findMany({
      where,
      include: {
        services: true, // si tu veux renvoyer les services
      },
    });

    return res.json(artisans);
  } catch (err) {
    return next(err);
  }
});

// ========= ROUTES PRIVÉES ARTISAN (dashboard) =========

router.use("/artisan", artisanPrivateRoutes);

// ========= RENDEZ-VOUS =========

router.use("/appointments", appointmentRoutes);

export default router;
