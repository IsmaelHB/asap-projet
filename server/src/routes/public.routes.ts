// server/src/routes/public.routes.ts
import { Router } from 'express';
import { search, searchValidation } from '../controllers/search.controller';
import {
  getArtisanProfileBySlug,
  slugValidation
} from '../controllers/artisan.controller';
import {
  getPublicAvailability,
  publicAvailabilityValidation
} from '../controllers/public-availability.controller';

const router = Router();

/**
 * @route   GET /api/search
 * @desc    Search for artisans by city and category
 * @access  Public
 */
router.get('/search', searchValidation, search);

/**
 * @route   GET /api/artisans/:slug
 * @desc    Get artisan profile by slug with services
 * @access  Public
 */
router.get('/artisans/:slug', slugValidation, getArtisanProfileBySlug);

/**
 * @route   GET /api/artisans/:id/availability
 * @desc    Get public availability for an artisan by date range
 * @access  Public
 */
router.get(
  '/artisans/:id/availability',
  publicAvailabilityValidation,
  getPublicAvailability
);

export default router;
