import prisma from '../config/database';
import { createError } from '../middleware/errorHandler';

export interface CreateAvailabilityData {
  artisanId: string;
  startTs: Date;
  endTs: Date;
}

export interface AvailabilityByDate {
  date: string;
  morningAvailable: boolean;
  afternoonAvailable: boolean;
}

/**
 * Create availability slots
 */
export const createAvailability = async (data: CreateAvailabilityData) => {
  // Validate time range
  if (data.startTs >= data.endTs) {
    throw createError('Start time must be before end time', 400);
  }

  // Check if slot already exists for this time period
  const existingSlot = await prisma.availability.findFirst({
    where: {
      artisanId: data.artisanId,
      OR: [
        {
          AND: [
            { startTs: { lte: data.startTs } },
            { endTs: { gt: data.startTs } }
          ]
        },
        {
          AND: [
            { startTs: { lt: data.endTs } },
            { endTs: { gte: data.endTs } }
          ]
        },
        {
          AND: [
            { startTs: { gte: data.startTs } },
            { endTs: { lte: data.endTs } }
          ]
        }
      ]
    }
  });

  if (existingSlot) {
    throw createError('A slot already exists in this time range', 400);
  }

  return prisma.availability.create({
    data: {
      artisanId: data.artisanId,
      startTs: data.startTs,
      endTs: data.endTs
    }
  });
};

/**
 * Delete an availability slot
 */
export const deleteAvailability = async (slotId: string, artisanId: string) => {
  const slot = await prisma.availability.findUnique({
    where: { id: slotId }
  });

  if (!slot) {
    throw createError('Availability slot not found', 404);
  }

  if (slot.artisanId !== artisanId) {
    throw createError('Forbidden: You do not own this slot', 403);
  }

  if (slot.isBooked) {
    throw createError('Cannot delete a booked slot', 400);
  }

  return prisma.availability.delete({
    where: { id: slotId }
  });
};

/**
 * List availability slots for an artisan
 */
export const listAvailability = async (
  artisanId: string,
  from?: Date,
  to?: Date
) => {
  const where: any = { artisanId };

  if (from || to) {
    where.AND = [];
    if (from) {
      where.AND.push({ endTs: { gte: from } });
    }
    if (to) {
      where.AND.push({ startTs: { lte: to } });
    }
  }

  return prisma.availability.findMany({
    where,
    orderBy: { startTs: 'asc' }
  });
};

/**
 * Get availability by date with morning/afternoon flags
 */
export const getAvailabilityByDate = async (
  artisanId: string,
  from: Date,
  to: Date
): Promise<AvailabilityByDate[]> => {
  const slots = await prisma.availability.findMany({
    where: {
      artisanId,
      isBooked: false,
      startTs: { gte: from },
      endTs: { lte: to }
    },
    orderBy: { startTs: 'asc' }
  });

  // Group by date and check morning (6h-13h) and afternoon (13h-20h) availability
  const availabilityMap = new Map<string, { morning: boolean; afternoon: boolean }>();

  slots.forEach(slot => {
    const date = slot.startTs.toISOString().split('T')[0];
    const startHour = slot.startTs.getHours();
    const endHour = slot.endTs.getHours();

    if (!availabilityMap.has(date)) {
      availabilityMap.set(date, { morning: false, afternoon: false });
    }

    const dayAvailability = availabilityMap.get(date)!;

    // Morning slot: any overlap with 6h-13h
    if (startHour < 13 && endHour > 6) {
      dayAvailability.morning = true;
    }

    // Afternoon slot: any overlap with 13h-20h
    if (startHour < 20 && endHour > 13) {
      dayAvailability.afternoon = true;
    }
  });

  // Convert to array
  const result: AvailabilityByDate[] = [];
  const currentDate = new Date(from);
  const endDate = new Date(to);

  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().split('T')[0];
    const availability = availabilityMap.get(dateStr);

    result.push({
      date: dateStr,
      morningAvailable: availability?.morning || false,
      afternoonAvailable: availability?.afternoon || false
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return result;
};
