// server/src/controllers/search.controller.ts
import { Request, Response, NextFunction } from 'express';
import { query, validationResult } from 'express-validator';
import { searchArtisans } from '../services/search.service';

/**
 * Validation rules for search
 */
export const searchValidation = [
  query('city').notEmpty().withMessage('City is required'),
  query('category')
    .optional()
    .isString()
    .withMessage('Category must be a string'),
  query('from')
    .optional()
    .isISO8601()
    .withMessage('From date must be a valid ISO 8601 date'),
  query('to')
    .optional()
    .isISO8601()
    .withMessage('To date must be a valid ISO 8601 date')
];

/**
 * Search for artisans
 */
export const search = async (
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

    const { city, category, from, to } = req.query;

    const results = await searchArtisans({
      city: city as string,
      category: (category as string) || undefined,
      from: from ? new Date(from as string) : undefined,
      to: to ? new Date(to as string) : undefined
    });

    res.json({
      success: true,
      data: {
        count: results.length,
        artisans: results
      }
    });
  } catch (error) {
    next(error);
  }
};
