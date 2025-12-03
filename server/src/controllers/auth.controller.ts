// server/src/controllers/auth.controller.ts
import { Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import prisma from '../config/database';
import {
  hashPassword,
  comparePassword,
  generateToken,
} from '../services/auth.service';
import { RequestWithUser } from '../types';
import { createError } from '../middleware/errorHandler';
import { Role } from '@prisma/client';

/**
 * Helper function to generate a slug from name and city
 */
const generateSlug = (name: string, city: string): string => {
  const combined = `${city}-${name}`.toLowerCase();
  return combined
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * ✅ Validation rules for registration
 */
export const registerValidation = [
  body('email').isEmail().withMessage('Invalid email address'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
  body('name').notEmpty().withMessage('Name is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('city').notEmpty().withMessage('City is required'),
  body('zipcode').notEmpty().withMessage('Zipcode is required'),
  body('address').notEmpty().withMessage('Address is required'),
  body('phone').notEmpty().withMessage('Phone is required'),
];

/**
 * ✅ Validation rules for login
 */
export const loginValidation = [
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').notEmpty().withMessage('Password is required'),
];

/**
 * ✅ Register a new artisan
 */
export const register = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }

    const {
      email,
      password,
      name,
      category,
      city,
      zipcode,
      address,
      phone,
      description,
      lat,
      lng,
    } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw createError('Email already registered', 400);
    }

    const passwordHash = await hashPassword(password);

    const baseSlug = generateSlug(name, city);
    let slug = baseSlug;
    let slugCounter = 1;

    while (await prisma.artisan.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${slugCounter}`;
      slugCounter++;
    }

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          passwordHash,
          role: Role.ARTISAN,
        },
      });

      const artisan = await tx.artisan.create({
        data: {
          id: user.id,
          slug,
          name,
          category: category.toLowerCase(),
          city: city.toLowerCase(),
          zipcode,
          address,
          lat: lat || 0,
          lng: lng || 0,
          phone,
          description: description || null,
        },
      });

      return { user, artisan };
    });

    const token = generateToken({
      userId: result.user.id,
      role: result.user.role,
    });

    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: result.user.id,
          email: result.user.email,
          role: result.user.role,
        },
        artisan: {
          id: result.artisan.id,
          name: result.artisan.name,
          slug: result.artisan.slug,
          category: result.artisan.category,
          city: result.artisan.city,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * ✅ Login artisan
 */
export const login = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }

    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      include: { artisan: true },
    });

    if (!user) {
      throw createError('Invalid email or password', 401);
    }

    const isPasswordValid = await comparePassword(
      password,
      user.passwordHash
    );

    if (!isPasswordValid) {
      throw createError('Invalid email or password', 401);
    }

    const token = generateToken({
      userId: user.id,
      role: user.role,
    });

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        artisan: user.artisan
          ? {
              id: user.artisan.id,
              name: user.artisan.name,
              slug: user.artisan.slug,
              category: user.artisan.category,
              city: user.artisan.city,
            }
          : null,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * ✅ Get current user + artisan profile
 */
export const me = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw createError('Unauthorized', 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      include: { artisan: true },
    });

    if (!user) {
      throw createError('User not found', 404);
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        },
        artisan: user.artisan
          ? {
              id: user.artisan.id,
              slug: user.artisan.slug,
              name: user.artisan.name,
              category: user.artisan.category,
              city: user.artisan.city,
              zipcode: user.artisan.zipcode,
              address: user.artisan.address,
              phone: user.artisan.phone,
              description: user.artisan.description,
              rating: user.artisan.rating,
              reviewCount: user.artisan.reviewCount,
              priceLevel: user.artisan.priceLevel,
              isActive: user.artisan.isActive,
            }
          : null,
      },
    });
  } catch (error) {
    next(error);
  }
};
