// server/src/controllers/availability.controller.ts
import { Response, NextFunction } from 'express';
import { body, query, validationResult } from 'express-validator';
import { RequestWithUser } from '../types';
import * as availabilityService from '../services/availability.service';

/**
 * Validation rules for creating availability
 */
export const createAvailabilityValidation = [
  body('startTs')
    .isISO8601()
    .withMessage('Start time must be a valid ISO 8601 date'),
  body('endTs')
    .isISO8601()
    .withMessage('End time must be a valid ISO 8601 date')
];

/**
 * Validation rules for listing availability
 */
export const listAvailabilityValidation = [
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
 * Create availability slots
 */
export const createAvailability = async (
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

    const slot = await availabilityService.createAvailability({
      artisanId: req.user.userId,
      startTs: new Date(req.body.startTs),
      endTs: new Date(req.body.endTs)
    });

    res.status(201).json({
      success: true,
      data: slot
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete an availability slot
 */
export const deleteAvailability = async (
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
    await availabilityService.deleteAvailability(id, req.user.userId);

    res.json({
      success: true,
      message: 'Availability slot deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * List availability slots for the authenticated artisan
 */
export const listAvailability = async (
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

    const from = req.query.from ? new Date(req.query.from as string) : undefined;
    const to = req.query.to ? new Date(req.query.to as string) : undefined;

    const slots = await availabilityService.listAvailability(
      req.user.userId,
      from,
      to
    );

    res.json({
      success: true,
      data: slots
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get availability by date with morning/afternoon flags
 */
export const getAvailabilityByDate = async (
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

    const from = new Date(req.query.from as string);
    const to = new Date(req.query.to as string);

    const availability = await availabilityService.getAvailabilityByDate(
      req.user.userId,
      from,
      to
    );

    res.json({
      success: true,
      data: availability
    });
  } catch (error) {
    next(error);
  }
};
