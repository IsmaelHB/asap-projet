import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import Button from '../common/Button';

const CATEGORIES = [
  { value: '', label: 'Tous les métiers' },
  { value: 'plombier', label: 'Plombier' },
  { value: 'electricien', label: 'Électricien' },
  { value: 'peintre', label: 'Peintre' },
  { value: 'serrurier', label: 'Serrurier' },
  { value: 'menuisier', label: 'Menuisier' },
  { value: 'chauffagiste', label: 'Chauffagiste' },
];

export default function SearchBar() {
  const navigate = useNavigate();
  const [city, setCity] = useState('');
  const [category, setCategory] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!city.trim()) return;

    const params = new URLSearchParams();
    params.append('city', city.toLowerCase());
    if (category) params.append('category', category);

    navigate(`/search?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row gap-4 bg-white p-6 rounded-2xl shadow-xl">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="city">
            Ville
          </label>
          <input
            id="city"
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Paris, Lyon, Marseille..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-doctolib-blue focus:border-transparent"
            required
          />
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="category">
            Métier
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-doctolib-blue focus:border-transparent"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <Button type="submit" size="lg" className="w-full md:w-auto">
            <Search className="h-5 w-5 mr-2 inline" />
            Rechercher
          </Button>
        </div>
      </div>
    </form>
  );
}
