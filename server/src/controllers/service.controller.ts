// server/src/controllers/service.controller.ts
import { Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { Complexity } from '@prisma/client';
import { RequestWithUser } from '../types';
import * as serviceService from '../services/service.service';

/**
 * Validation rules for creating a service
 */
export const createServiceValidation = [
  body('name').notEmpty().withMessage('Service name is required'),
  body('priceMinCents')
    .isInt({ min: 0 })
    .withMessage('Minimum price must be a positive integer'),
  body('priceMaxCents')
    .isInt({ min: 0 })
    .withMessage('Maximum price must be a positive integer'),
  body('estimatedDurationMin')
    .isInt({ min: 1 })
    .withMessage('Estimated duration must be at least 1 minute'),
  body('complexity')
    .isIn(['SIMPLE', 'MEDIUM', 'COMPLEX'])
    .withMessage('Complexity must be SIMPLE, MEDIUM, or COMPLEX')
];

/**
 * Validation rules for updating a service
 */
export const updateServiceValidation = [
  body('name').optional().notEmpty().withMessage('Service name cannot be empty'),
  body('priceMinCents')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Minimum price must be a positive integer'),
  body('priceMaxCents')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Maximum price must be a positive integer'),
  body('estimatedDurationMin')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Estimated duration must be at least 1 minute'),
  body('complexity')
    .optional()
    .isIn(['SIMPLE', 'MEDIUM', 'COMPLEX'])
    .withMessage('Complexity must be SIMPLE, MEDIUM, or COMPLEX'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean')
];

/**
 * Create a new service
 */
export const createService = async (
  req: RequestWithUser,
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

    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const service = await serviceService.createService({
      artisanId: req.user.userId,
      name: req.body.name,
      description: req.body.description,
      priceMinCents: req.body.priceMinCents,
      priceMaxCents: req.body.priceMaxCents,
      estimatedDurationMin: req.body.estimatedDurationMin,
      complexity: req.body.complexity as Complexity
    });

    res.status(201).json({
      success: true,
      data: service
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a service
 */
export const updateService = async (
  req: RequestWithUser,
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

    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const service = await serviceService.updateService(
      id,
      req.user.userId,
      req.body
    );

    res.json({
      success: true,
      data: service
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a service
 */
export const deleteService = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    await serviceService.deleteService(id, req.user.userId);

    res.json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * List all services for the authenticated artisan
 */
export const listServices = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const includeInactive = req.query.includeInactive === 'true';
    const services = await serviceService.listServices(
      req.user.userId,
      includeInactive
    );

    res.json({
      success: true,
      data: services
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single service by ID
 */
export const getService = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const service = await serviceService.getServiceById(id);

    res.json({
      success: true,
      data: service
    });
  } catch (error) {
    next(error);
  }
};
