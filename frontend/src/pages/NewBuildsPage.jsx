import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, Map, Grid, List } from 'lucide-react';
import PropertyCard from '../components/PropertyCard/PropertyCard';
import { propertyApi } from '../utils/api';

const MOCK = [
  { id:'s1', title:'3 Bed Semi-Detached House', type:'NEW_BUILD', price:380000, address:{city:'Manchester',postcode:'M21 9JQ'}, details:{bedrooms:3,bathrooms:2}, epcRating:'B' },
  { id:'s2', title:'Modern 2 Bed Apartment',    type:'NEW_BUILD', price:320000, address:{city:'Leeds',postcode:'LS1 4DW'},       details:{bedrooms:2,bathrooms:1}, epcRating:'C' },
  { id:'s3', title:'4 Bed Detached House',      type:'NEW_BUILD', price:540000, address:{city:'Bristol',postcode:'BS9 1LS'},     details:{bedrooms:4,bathrooms:3}, epcRating:'A', featured:true },
  { id:'s4', title:'1 Bed Studio Flat',         type:'NEW_BUILD', price:210000, address:{city:'London',postcode:'E1 6RF'},       details:{bedrooms:1,bathrooms:1}, epcRating:'C' },
];

export default function NewBuildsPage({ type = 'NEW_BUILD' }) {
  const [properties, setProperties] = useState(MOCK);
  const [loading,    setLoading]    = useState(false);
  const [query,      setQuery]      = useState('');

  useEffect(() => {
    setLoading(true);
    propertyApi.search({ type, size:20 })
      .then(r => { if (r.data?.content?.length) setProperties(r.data.content); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [type]);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="bg-white border-b border-gray-200 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <div className="flex-1 flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-2.5">
            <Search className="w-5 h-5 text-gray-400"/>
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search new build properties..."
              className="flex-1 bg-transparent text-gray-800 outline-none"/>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-gray-700 hover:border-blue-400 transition-colors font-medium text-sm">
            <SlidersHorizontal className="w-4 h-4"/> Filters
          </button>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-gray-500 text-sm mb-6">{properties.length} properties found</p>
        {loading ? (
          <div className="flex items-center justify-center py-20"><div className="w-10 h-10 border-4 border-blue-700 border-t-transparent rounded-full animate-spin"/></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((p, i) => <PropertyCard key={p.id} property={p} index={i}/>)}
          </div>
        )}
      </div>
    </div>
  );
}
