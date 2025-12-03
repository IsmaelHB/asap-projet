import { Link } from 'react-router-dom';
import { Star, MapPin, Euro } from 'lucide-react';
import { ArtisanSearchResult, PriceLevel } from '@/types';
import Card from '../common/Card';

interface ArtisanCardProps {
  artisan: ArtisanSearchResult;
}

function getPriceLevelDisplay(level: PriceLevel): string {
  switch (level) {
    case PriceLevel.LOW:
      return '€';
    case PriceLevel.MEDIUM:
      return '€€';
    case PriceLevel.HIGH:
      return '€€€';
    default:
      return '€€';
  }
}

export default function ArtisanCard({ artisan }: ArtisanCardProps) {
  return (
    <Link to={`/artisan/${artisan.slug}`}>
      <Card hover>
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{artisan.name}</h3>
              <p className="text-sm text-gray-600 capitalize">{artisan.category}</p>
            </div>
            <div className="flex items-center text-amber-500">
              <Star className="h-5 w-5 fill-current" />
              <span className="ml-1 font-semibold">{artisan.rating.toFixed(1)}</span>
              <span className="ml-1 text-gray-500 text-sm">({artisan.reviewCount})</span>
            </div>
          </div>

          <div className="flex items-center text-gray-600 mb-3">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm capitalize">
              {artisan.city} ({artisan.zipcode})
            </span>
          </div>

          {artisan.description && (
            <p className="text-gray-700 text-sm mb-3 line-clamp-2">
              {artisan.description}
            </p>
          )}

          <div className="flex items-center text-gray-600 mb-3">
            <Euro className="h-4 w-4 mr-1" />
            <span className="text-sm font-medium">
              {getPriceLevelDisplay(artisan.priceLevel)}
            </span>
          </div>

          {artisan.availabilityBadges.length > 0 && (
            <div className="mt-auto pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-2">Disponibilités :</p>
              <div className="flex flex-wrap gap-2">
                {artisan.availabilityBadges.map((badge: string, index: number) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
}
