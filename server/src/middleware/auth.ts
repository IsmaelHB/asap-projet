// server/src/middleware/auth.ts
import { Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import { verifyToken } from '../services/auth.service';
import { RequestWithUser } from '../types';
import { createError } from './errorHandler'; // <--- IMPORTANT: ./ et pas ../

/**
 * Middleware to authenticate JWT token
 */
export const authenticateToken = (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createError('No token provided', 401);
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const decoded = verifyToken(token);

    if (!decoded) {
      throw createError('Invalid or expired token', 401);
    }

    // Attach user info to request
    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to require a specific role
 */
export const requireRole = (role: Role) => {
  return (req: RequestWithUser, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw createError('Unauthorized', 401);
      }

      if (req.user.role !== role) {
        throw createError('Forbidden: Insufficient permissions', 403);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
