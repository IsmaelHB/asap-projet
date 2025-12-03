// server/src/routes/artisan.routes.ts
import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  createService,
  updateService,
  deleteService,
  listServices,
  getService,
  createServiceValidation,
  updateServiceValidation
} from '../controllers/service.controller';
import {
  createAvailability,
  deleteAvailability,
  listAvailability,
  getAvailabilityByDate,
  createAvailabilityValidation,
  listAvailabilityValidation
} from '../controllers/availability.controller';

const router = Router();

// Toutes les routes artisan sont protégées par JWT
router.use(authenticateToken);

// ============ SERVICE ROUTES ============

/**
 * @route   POST /api/artisan/services
 * @desc    Create a new service
 * @access  Private (Artisan)
 */
router.post('/services', createServiceValidation, createService);

/**
 * @route   GET /api/artisan/services
 * @desc    List all services for the authenticated artisan
 * @access  Private (Artisan)
 */
router.get('/services', listServices);

/**
 * @route   GET /api/artisan/services/:id
 * @desc    Get a single service by ID
 * @access  Private (Artisan)
 */
router.get('/services/:id', getService);

/**
 * @route   PUT /api/artisan/services/:id
 * @desc    Update a service
 * @access  Private (Artisan)
 */
router.put('/services/:id', updateServiceValidation, updateService);

/**
 * @route   DELETE /api/artisan/services/:id
 * @desc    Delete (soft) a service
 * @access  Private (Artisan)
 */
router.delete('/services/:id', deleteService);

// ============ AVAILABILITY ROUTES ============

/**
 * @route   POST /api/artisan/availability
 * @desc    Create an availability slot
 * @access  Private (Artisan)
 */
router.post('/availability', createAvailabilityValidation, createAvailability);

/**
 * @route   GET /api/artisan/availability
 * @desc    List availability slots with optional date range
 * @access  Private (Artisan)
 */
router.get('/availability', listAvailabilityValidation, listAvailability);

/**
 * @route   GET /api/artisan/availability/by-date
 * @desc    Get availability grouped by date with morning/afternoon flags
 * @access  Private (Artisan)
 */
router.get(
  '/availability/by-date',
  listAvailabilityValidation,
  getAvailabilityByDate
);

/**
 * @route   DELETE /api/artisan/availability/:id
 * @desc    Delete an availability slot
 * @access  Private (Artisan)
 */
router.delete('/availability/:id', deleteAvailability);

export default router;
