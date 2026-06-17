import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

export default function SavedPage() {
  const { saved } = useSelector(s => s.saved);
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-heading font-bold text-blue-900 mb-8">Saved Properties</h1>
        {saved.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="w-16 h-16 text-gray-200 mx-auto mb-4"/>
            <h2 className="text-xl font-semibold text-gray-500">No saved properties yet</h2>
            <p className="text-gray-400 mt-2">Click the heart icon on any property to save it here.</p>
            <Link to="/buy" className="btn-primary inline-block mt-6">Browse properties</Link>
          </div>
        ) : (
          <p className="text-gray-600">{saved.length} saved {saved.length === 1 ? 'property' : 'properties'}. Visit each property page to view details.</p>
        )}
      </div>
    </div>
  );
}
