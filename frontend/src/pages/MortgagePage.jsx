import React from 'react';
import MortgageCalculator from '../components/Mortgage/MortgageCalculator';

export default function MortgagePage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-heading font-bold text-blue-900">Mortgage Calculator</h1>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto">Get an instant estimate of your monthly payments. Not financial advice.</p>
        </div>
        <MortgageCalculator />
      </div>
    </div>
  );
}
