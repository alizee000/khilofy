import { Link } from 'react-router-dom';
import { Star, MapPin } from 'lucide-react';
import { Toy } from '../data/types';

interface ToyCardProps {
  toy: Toy;
}

export default function ToyCard({ toy }: ToyCardProps) {
  return (
    <Link to={`/toy/${toy.id}`} className="block bg-white rounded-2xl overflow-hidden shadow-soft border border-gray-100 hover:shadow-lg transition-all duration-300">
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img 
          src={toy.images[0]} 
          alt={toy.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold text-gray-800 flex items-center gap-1">
          <Star size={12} className="text-yellow-500 fill-yellow-500" />
          {toy.rating}
        </div>
        {toy.recentRentalsCount > 10 && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-md flex items-center gap-1">
            🔥 Trending
          </div>
        )}
      </div>
      
      <div className="p-3">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-semibold text-gray-900 leading-tight line-clamp-1">{toy.name}</h3>
        </div>
        
        <div className="flex items-center text-xs text-gray-500 mb-2 gap-3">
          <span>Age {toy.ageRange}</span>
          <span className="flex items-center gap-0.5">
            <MapPin size={12} />
            {toy.location.distanceKm} km
          </span>
        </div>
        
        <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-50">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-gray-900">₹{toy.rentalRates.oneDay}<span className="text-xs font-normal text-gray-500">/day</span></span>
          </div>
          <div className="text-xs font-medium text-brand-600 bg-brand-50 px-2 py-1 rounded-md">
            Available
          </div>
        </div>
      </div>
    </Link>
  );
}
