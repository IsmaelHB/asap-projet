import { Request, Response, NextFunction } from 'express';
import { getAvailabilityByDate } from '../services/availability.service';
import { getArtisanById } from '../services/search.service'; // Assurez-vous que ce service existe aussi

export const getPublicAvailability = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { from, to } = req.query;

    if (!from || !to) return res.status(400).json({ message: "Dates manquantes" });

    const availability = await getAvailabilityByDate(
      id,
      new Date(from as string),
      new Date(to as string)
    );

    res.json({ success: true, data: { availability } });
  } catch (error) {
    next(error);
  }
};
// Ajoutez ceci si nécessaire pour éviter les erreurs de validation manquantes
export const publicAvailabilityValidation = [];