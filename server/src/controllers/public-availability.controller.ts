// server/src/controllers/public-availability.controller.ts
import { Request, Response, NextFunction } from 'express';
import { param, query, validationResult } from 'express-validator';
import { getAvailabilityByDate } from '../services/availability.service';
import { getArtisanById } from '../services/search.service';
import { createError } from '../middleware/errorHandler';

/**
 * Validation rules for public availability
 */
export const publicAvailabilityValidation = [
  param('id').notEmpty().withMessage('Artisan ID is required'),
  query('from')
    .notEmpty()
    .withMessage('From date is required')
    .isISO8601()
    .withMessage('From date must be a valid ISO 8601 date'),
  query('to')
    .notEmpty()
    .withMessage('To date is required')
    .isISO8601()
    .withMessage('To date must be a valid ISO 8601 date')
];

/**
 * Get public availability for an artisan
 */
export const getPublicAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        errors: errors.array()
      });
      return;
    }

    const { id } = req.params;
    const { from, to } = req.query;

    const artisan = await getArtisanById(id);
    if (!artisan) {
      throw createError('Artisan not found', 404);
    }

    const availability = await getAvailabilityByDate(
      id,
      new Date(from as string),
      new Date(to as string)
    );

    res.json({
      success: true,
      data: {
        artisanId: id,
        artisanName: artisan.name,
        availability
      }
    });
  } catch (error) {
    next(error);
  }
};
