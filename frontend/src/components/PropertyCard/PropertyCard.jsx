import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Bed, Bath, Maximize2, MapPin, Zap, Camera, Star } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSave } from '../../store/savedSlice';
import { formatPrice } from '../../utils/formatters';

export default function PropertyCard({ property, index = 0 }) {
  const dispatch = useDispatch();
  const { saved } = useSelector(s => s.saved);
  const isSaved = saved.includes(property.id);
  const [imgErr, setImgErr] = useState(false);

  const typeLabel = { SALE: 'For Sale', RENT: 'To Rent', NEW_BUILD: 'New Build' };
  const typeBg    = { SALE: 'bg-blue-100 text-blue-800', RENT: 'bg-green-100 text-green-800', NEW_BUILD: 'bg-purple-100 text-purple-800' };

  return (
    <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay: index * 0.06 }} className="property-card group">
      <Link to={`/property/${property.id}`}>
        <div className="relative h-52 overflow-hidden">
          <img
            src={imgErr || !property.imageUrls?.[0] ? `https://picsum.photos/seed/${property.id}/600/400` : property.imageUrls[0]}
            alt={property.title}
            onError={() => setImgErr(true)}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          <div className="absolute top-3 left-3 flex gap-2">
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${typeBg[property.type]}`}>
              {typeLabel[property.type]}
            </span>
            {property.featured && <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1"><Star className="w-3 h-3"/>Featured</span>}
          </div>
          <button onClick={(e) => { e.preventDefault(); dispatch(toggleSave(property.id)); }}
            className={`absolute top-3 right-3 p-2 rounded-full transition-all ${isSaved ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-500 hover:bg-white'}`}>
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
          {property.virtualTourUrl && (
            <span className="absolute bottom-3 left-3 bg-blue-600 text-white text-xs px-2 py-1 rounded-lg">3D Tour</span>
          )}
          {property.imageUrls?.length > 1 && (
            <span className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-lg flex items-center gap-1">
              <Camera className="w-3 h-3"/>{property.imageUrls.length}
            </span>
          )}
        </div>
        <div className="p-4">
          <p className="text-xl font-bold font-heading text-blue-900">{formatPrice(property.price, property.type)}</p>
          <h3 className="font-semibold text-gray-800 mt-1 line-clamp-1">{property.title}</h3>
          <p className="text-gray-400 text-sm flex items-center gap-1 mt-1">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0"/>
            <span className="line-clamp-1">{property.address?.city}, {property.address?.postcode}</span>
          </p>
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100 text-sm text-gray-600">
            <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5 text-blue-500"/>{property.details?.bedrooms} bed</span>
            <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5 text-blue-500"/>{property.details?.bathrooms} bath</span>
            {property.details?.squareFootage && <span className="flex items-center gap-1"><Maximize2 className="w-3.5 h-3.5 text-blue-500"/>{property.details.squareFootage.toLocaleString()} sq ft</span>}
            {property.epcRating && <span className="ml-auto text-xs font-bold px-1.5 py-0.5 rounded bg-green-500 text-white">EPC {property.epcRating}</span>}
          </div>
          {property.aiHighlights?.[0] && (
            <div className="mt-2 text-xs text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 flex-shrink-0"/><span className="line-clamp-1">{property.aiHighlights[0]}</span>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
