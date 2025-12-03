// server/src/controllers/artisan.controller.ts
import { Request, Response, NextFunction } from 'express';
import { param, validationResult } from 'express-validator';
import { getArtisanBySlug } from '../services/search.service';
import { createError } from '../middleware/errorHandler';

/**
 * Validation rules for slug
 */
export const slugValidation = [
  param('slug').notEmpty().withMessage('Slug is required')
];

/**
 * Get artisan profile by slug (public)
 */
export const getArtisanProfileBySlug = async (
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

    const { slug } = req.params;
    const artisan = await getArtisanBySlug(slug);

    if (!artisan) {
      throw createError('Artisan not found', 404);
    }

    res.json({
      success: true,
      data: {
        artisan: {
          id: artisan.id,
          slug: artisan.slug,
          name: artisan.name,
          category: artisan.category,
          city: artisan.city,
          zipcode: artisan.zipcode,
          address: artisan.address,
          phone: artisan.phone,
          description: artisan.description,
          rating: Number(artisan.rating),
          reviewCount: artisan.reviewCount,
          priceLevel: artisan.priceLevel
        },
        services: artisan.services.map((service) => ({
          id: service.id,
          name: service.name,
          description: service.description,
          priceMinCents: service.priceMinCents,
          priceMaxCents: service.priceMaxCents,
          estimatedDurationMin: service.estimatedDurationMin,
          complexity: service.complexity
        }))
      }
    });
  } catch (error) {
    next(error);
  }
};
