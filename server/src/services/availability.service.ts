import prisma from '../config/database';
import { createError } from '../middleware/errorHandler';

export interface CreateAvailabilityData {
  artisanId: string;
  startTs: Date;
  endTs: Date;
}

export interface AvailabilityByDate {
  date: string;
  slots: string[];
}

export const createAvailability = async (data: CreateAvailabilityData) => {
  if (data.startTs >= data.endTs) {
    throw createError('Start time must be before end time', 400);
  }
  return prisma.availability.create({
    data: { artisanId: data.artisanId, startTs: data.startTs, endTs: data.endTs }
  });
};

export const deleteAvailability = async (slotId: string, artisanId: string) => {
  const slot = await prisma.availability.findUnique({ where: { id: slotId } });
  if (!slot) throw createError('Slot not found', 404);
  if (slot.artisanId !== artisanId) throw createError('Forbidden', 403);
  return prisma.availability.delete({ where: { id: slotId } });
};

export const listAvailability = async (artisanId: string, from?: Date, to?: Date) => {
  const where: any = { artisanId };
  if (from) where.startTs = { gte: from };
  if (to) where.endTs = { lte: to };
  return prisma.availability.findMany({ where, orderBy: { startTs: 'asc' } });
};

export const getAvailabilityByDate = async (
  artisanId: string,
  from: Date,
  to: Date
): Promise<AvailabilityByDate[]> => {
  // 1. Récupérer les plages brutes (utilise startTs / endTs)
  const ranges = await prisma.availability.findMany({
    where: {
      artisanId,
      isBooked: false,
      startTs: { gte: from },
      endTs: { lte: to }
    },
    orderBy: { startTs: 'asc' }
  });

  // 2. Récupérer les RDV existants (utilise slotStart / slotEnd)
  const existingAppointments = await prisma.appointment.findMany({
    where: {
      artisanId,
      status: { notIn: ['CANCELLED', 'NO_SHOW'] },
      slotStart: { gte: from },
      slotEnd: { lte: to }
    }
  });

  const availabilityMap = new Map<string, Set<string>>();

  // 3. Découpage
  ranges.forEach(range => {
    const dateStr = range.startTs.toISOString().split('T')[0];
    if (!availabilityMap.has(dateStr)) availabilityMap.set(dateStr, new Set());

    const current = new Date(range.startTs);
    
    while (current.getTime() + 30 * 60000 <= range.endTs.getTime()) {
      // Vérification conflit
      const isBooked = existingAppointments.some(app => {
        const appStart = app.slotStart.getTime();
        const appEnd = app.slotEnd.getTime();
        const currentSlotTime = current.getTime();
        return currentSlotTime >= appStart && currentSlotTime < appEnd;
      });

      if (!isBooked) {
        const timeStr = current.toLocaleTimeString('fr-FR', {
          hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Paris'
        });
        availabilityMap.get(dateStr)!.add(timeStr);
      }
      current.setMinutes(current.getMinutes() + 30);
    }
  });

  // 4. Résultat
  const result: AvailabilityByDate[] = [];
  const currentDate = new Date(from);
  while (currentDate <= to) {
    const dateStr = currentDate.toISOString().split('T')[0];
    const slots = availabilityMap.has(dateStr)
      ? Array.from(availabilityMap.get(dateStr)!).sort()
      : [];

    result.push({ date: dateStr, slots });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return result;
};