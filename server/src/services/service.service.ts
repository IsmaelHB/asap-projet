import prisma from '../config/database';
import { Complexity } from '@prisma/client';
import { createError } from '../middleware/errorHandler';

export interface CreateServiceData {
  artisanId: string;
  name: string;
  description?: string;
  priceMinCents: number;
  priceMaxCents: number;
  estimatedDurationMin: number;
  complexity: Complexity;
}

export interface UpdateServiceData {
  name?: string;
  description?: string;
  priceMinCents?: number;
  priceMaxCents?: number;
  estimatedDurationMin?: number;
  complexity?: Complexity;
  isActive?: boolean;
}

/**
 * Create a new service for an artisan
 */
export const createService = async (data: CreateServiceData) => {
  // Validate price range
  if (data.priceMinCents > data.priceMaxCents) {
    throw createError('Minimum price cannot be greater than maximum price', 400);
  }

  return prisma.service.create({
    data: {
      artisanId: data.artisanId,
      name: data.name,
      description: data.description,
      priceMinCents: data.priceMinCents,
      priceMaxCents: data.priceMaxCents,
      estimatedDurationMin: data.estimatedDurationMin,
      complexity: data.complexity
    }
  });
};

/**
 * Update an existing service
 */
export const updateService = async (
  serviceId: string,
  artisanId: string,
  data: UpdateServiceData
) => {
  // Check if service exists and belongs to artisan
  const service = await prisma.service.findUnique({
    where: { id: serviceId }
  });

  if (!service) {
    throw createError('Service not found', 404);
  }

  if (service.artisanId !== artisanId) {
    throw createError('Forbidden: You do not own this service', 403);
  }

  // Validate price range if both are provided
  if (data.priceMinCents !== undefined && data.priceMaxCents !== undefined) {
    if (data.priceMinCents > data.priceMaxCents) {
      throw createError('Minimum price cannot be greater than maximum price', 400);
    }
  }

  return prisma.service.update({
    where: { id: serviceId },
    data
  });
};

/**
 * Delete a service
 */
export const deleteService = async (serviceId: string, artisanId: string) => {
  // Check if service exists and belongs to artisan
  const service = await prisma.service.findUnique({
    where: { id: serviceId }
  });

  if (!service) {
    throw createError('Service not found', 404);
  }

  if (service.artisanId !== artisanId) {
    throw createError('Forbidden: You do not own this service', 403);
  }

  // Soft delete by setting isActive to false
  return prisma.service.update({
    where: { id: serviceId },
    data: { isActive: false }
  });
};

/**
 * List all services for an artisan
 */
export const listServices = async (artisanId: string, includeInactive = false) => {
  return prisma.service.findMany({
    where: {
      artisanId,
      ...(includeInactive ? {} : { isActive: true })
    },
    orderBy: { createdAt: 'desc' }
  });
};

/**
 * Get a single service by ID
 */
export const getServiceById = async (serviceId: string) => {
  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    include: {
      artisan: {
        select: {
          id: true,
          name: true,
          slug: true,
          category: true
        }
      }
    }
  });

  if (!service) {
    throw createError('Service not found', 404);
  }

  return service;
};
