import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, TrendingUp, MessageCircle, Calculator, MapPin, Star } from 'lucide-react';
import HeroSection from '../components/Hero/HeroSection';
import MortgageCalculator from '../components/Mortgage/MortgageCalculator';
import PropertyCard from '../components/PropertyCard/PropertyCard';
import { propertyApi } from '../utils/api';

const MOCK_PROPS = [
  { id:'1', title:'Modern 3 Bed Semi-Detached', type:'SALE', category:'SEMI_DETACHED', price:425000, address:{city:'Manchester',postcode:'M21 9JQ'}, details:{bedrooms:3,bathrooms:2}, epcRating:'B', featured:true, aiHighlights:['Excellent school catchment area','5 min walk to Metrolink'] },
  { id:'2', title:'Stunning 2 Bed Apartment', type:'RENT', category:'FLAT', price:1800, address:{city:'London',postcode:'E1 6RF'}, details:{bedrooms:2,bathrooms:1}, epcRating:'C', aiHighlights:['Price 8% below local average'] },
  { id:'3', title:'Spacious 4 Bed Detached', type:'SALE', category:'DETACHED', price:695000, address:{city:'Bristol',postcode:'BS9 1LS'}, details:{bedrooms:4,bathrooms:3}, epcRating:'A', featured:true },
  { id:'4', title:'New Build 2 Bed Flat', type:'NEW_BUILD', category:'FLAT', price:320000, address:{city:'Leeds',postcode:'LS1 4DW'}, details:{bedrooms:2,bathrooms:1}, epcRating:'A', aiHighlights:['Chain free, move-in ready'] },
  { id:'5', title:'Charming 3 Bed Terrace', type:'SALE', category:'TERRACED', price:285000, address:{city:'Birmingham',postcode:'B15 2TT'}, details:{bedrooms:3,bathrooms:1}, epcRating:'D' },
  { id:'6', title:'Studio Apartment City Centre', type:'RENT', category:'STUDIO', price:1200, address:{city:'Edinburgh',postcode:'EH1 1RH'}, details:{bedrooms:0,bathrooms:1}, epcRating:'C' },
];

const AI_FEATURES = [
  { icon: Sparkles, title: 'AI Property Search', desc: 'Natural language search: "3 bed house near good schools in Leeds under 350k"', color: 'bg-blue-50 text-blue-700' },
  { icon: TrendingUp, title: 'Market Intelligence', desc: 'Live price trends, rental yields and area demand heatmaps powered by real data', color: 'bg-green-50 text-green-700' },
  { icon: MessageCircle, title: 'AI Chat Assistant', desc: '24/7 property expert with seamless handover to human agents when needed', color: 'bg-purple-50 text-purple-700' },
  { icon: Calculator, title: 'Smart Mortgage Tools', desc: 'Real-time mortgage calculations with personalised rate recommendations', color: 'bg-amber-50 text-amber-700' },
];

export default function HomePage() {
  const [stats, setStats] = useState({});
  const [props, setProps] = useState(MOCK_PROPS);

  useEffect(() => {
    propertyApi.getStats().then(r => setStats(r.data)).catch(() => {});
    propertyApi.getFeatured().then(r => { if (r.data?.length) setProps(r.data); }).catch(() => {});
  }, []);

  return (
    <div className="flex flex-col">
      <section className="hero-gradient min-h-screen flex flex-col">
        <HeroSection stats={stats} />
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} className="text-center mb-12">
            <span className="text-blue-500 font-semibold text-sm uppercase tracking-wider">Why PropAI</span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-blue-900 mt-2">AI That Actually Helps</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {AI_FEATURES.map(({ icon:Icon, title, desc, color }, i) => (
              <motion.div key={title} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} transition={{delay:i*0.1}}
                className="p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${color}`}><Icon className="w-6 h-6"/></div>
                <h3 className="font-heading font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} className="text-center mb-12">
            <span className="text-blue-500 font-semibold text-sm uppercase tracking-wider">Hand-picked for you</span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-blue-900 mt-2">Featured Properties</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {props.slice(0,6).map((p, i) => <PropertyCard key={p.id} property={p} index={i}/>)}
          </div>
          <div className="text-center mt-10">
            <Link to="/buy" className="btn-primary inline-block">View all properties</Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-blue-900">Mortgage Calculator</h2>
          </motion.div>
          <MortgageCalculator />
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-blue-900 to-blue-700">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}}>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">Ready to find your perfect home?</h2>
            <p className="text-blue-200 text-lg mb-8">Join over 2 million people who trust PropAI to find their ideal property.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/buy" className="bg-white text-blue-900 font-semibold py-3 px-8 rounded-xl hover:bg-blue-50 transition-colors">Start searching</Link>
              <Link to="/register" className="border-2 border-white text-white font-semibold py-3 px-8 rounded-xl hover:bg-white/10 transition-colors">Create free account</Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
