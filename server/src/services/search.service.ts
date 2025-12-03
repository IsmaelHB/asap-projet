// server/src/services/search.service.ts
import prisma from '../config/database';
import { getAvailabilityByDate } from './availability.service';
import { PriceLevel } from '@prisma/client'; 

export interface SearchParams {
  city: string;
  category?: string;
  from?: Date;
  to?: Date;
}

export interface ArtisanSearchResult {
  id: string;
  slug: string;
  name: string;
  category: string;
  city: string;
  zipcode: string;
  rating: number;
  reviewCount: number;
  priceLevel: PriceLevel | null;
  description: string | null;
  availabilityBadges: string[];
}

/**
 * Search for artisans by city and category
 */
export const searchArtisans = async (
  params: SearchParams
): Promise<ArtisanSearchResult[]> => {
  const { city, category, from, to } = params;

  const where: any = {
    city: city.toLowerCase(),
    isActive: true
  };

  if (category) {
    where.category = category.toLowerCase();
  }

  const artisans = await prisma.artisan.findMany({
    where,
    orderBy: [{ rating: 'desc' }, { reviewCount: 'desc' }],
    take: 50
  });

  const results: ArtisanSearchResult[] = [];

  for (const artisan of artisans) {
    const availabilityBadges: string[] = [];

    if (from && to) {
      const availability = await getAvailabilityByDate(
        artisan.id,
        from,
        to
      );

      const availableDays = availability
        .filter((day) => day.morningAvailable || day.afternoonAvailable)
        .slice(0, 3);

      availableDays.forEach((day) => {
        const date = new Date(day.date);
        const dayName = date.toLocaleDateString('fr-FR', {
          weekday: 'short'
        });

        if (day.morningAvailable && day.afternoonAvailable) {
          availabilityBadges.push(`${dayName} toute la journée`);
        } else if (day.morningAvailable) {
          availabilityBadges.push(`${dayName} matin`);
        } else if (day.afternoonAvailable) {
          availabilityBadges.push(`${dayName} après-midi`);
        }
      });
    }

    results.push({
      id: artisan.id,
      slug: artisan.slug,
      name: artisan.name,
      category: artisan.category,
      city: artisan.city,
      zipcode: artisan.zipcode,
      rating: Number(artisan.rating),
      reviewCount: artisan.reviewCount,
      priceLevel: artisan.priceLevel,
      description: artisan.description,
      availabilityBadges
    });
  }

  return results;
};

/**
 * Get artisan profile by slug with services
 */
export const getArtisanBySlug = async (slug: string) => {
  const artisan = await prisma.artisan.findUnique({
    where: { slug },
    include: {
      services: {
        where: { isActive: true },
        orderBy: { complexity: 'asc' }
      }
    }
  });

  return artisan;
};

/**
 * Get artisan profile by ID with services
 */
export const getArtisanById = async (id: string) => {
  const artisan = await prisma.artisan.findUnique({
    where: { id },
    include: {
      services: {
        where: { isActive: true },
        orderBy: { complexity: 'asc' }
      }
    }
  });

  return artisan;
};
