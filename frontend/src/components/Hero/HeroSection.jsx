import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Sparkles, Shield, TrendingUp } from 'lucide-react';

const PLACEHOLDERS = ['Search by city, postcode or area...','Try "Manchester 2 bed flat"...','Try "London SW1 house for sale"...','Try "Bristol under 350k"...'];
const TABS = ['Buy','Rent','New Builds'];

export default function HeroSection({ stats = {} }) {
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState(0);
  const [ph, setPh] = useState(0);
  const navigate = useNavigate();

  useEffect(() => { const t = setInterval(() => setPh(p => (p+1)%PLACEHOLDERS.length), 3000); return () => clearInterval(t); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const paths = ['/buy','/rent','/new-builds'];
    navigate(`${paths[tab]}?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 pt-24 pb-16 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-white/5 rounded-full blur-3xl"/>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"/>
      </div>

      <motion.div initial={{opacity:0,y:-20}} animate={{opacity:1,y:0}} transition={{delay:0.2}}
        className="glass rounded-full px-5 py-2 flex items-center gap-2 mb-8 border border-white/20">
        <Sparkles className="w-4 h-4 text-amber-400"/>
        <span className="text-white/90 text-sm font-medium">Powered by AI · Spring Boot 4.1 · JDK 25 · Kafka KRaft</span>
      </motion.div>

      <motion.h1 initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.3}}
        className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-white text-center leading-tight max-w-4xl">
        Find Your<span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-amber-400">Perfect Home</span>with AI
      </motion.h1>

      <motion.p initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.4}}
        className="text-white/70 text-lg mt-6 text-center max-w-2xl">
        PropAI uses artificial intelligence to match you with properties you'll love and guide you through every step.
      </motion.p>

      <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{delay:0.5}} className="w-full max-w-3xl mt-10">
        <div className="flex gap-1 mb-3">
          {TABS.map((t, i) => (
            <button key={t} onClick={() => setTab(i)}
              className={`px-6 py-2.5 rounded-t-xl font-semibold text-sm transition-all ${tab===i ? 'bg-white text-blue-900' : 'bg-white/20 text-white hover:bg-white/30'}`}>{t}</button>
          ))}
        </div>
        <form onSubmit={handleSearch} className="bg-white rounded-b-2xl rounded-tr-2xl p-3 shadow-2xl flex gap-3">
          <div className="flex-1 flex items-center gap-3 px-4 bg-gray-50 rounded-xl">
            <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0"/>
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder={PLACEHOLDERS[ph]}
              className="flex-1 bg-transparent py-3 text-gray-800 placeholder-gray-400 outline-none text-base"/>
          </div>
          <button type="submit" className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 py-3 rounded-xl transition-all">
            <Search className="w-5 h-5"/><span className="hidden sm:inline">Search</span>
          </button>
        </form>
        <p className="text-white/60 text-sm mt-3 text-center flex items-center justify-center gap-1">
          <Sparkles className="w-3.5 h-3.5"/> Try: "3 bed house near good schools in Leeds under 350k"
        </p>
      </motion.div>

      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.7}} className="flex flex-wrap justify-center gap-8 mt-14">
        {[
          ['Properties for sale',  stats.totalForSale || '142,000+'],
          ['Properties to rent',   stats.totalToRent || '68,000+'],
          ['New builds available', stats.totalNewBuilds || '12,400+'],
          ['Happy homeowners',     '2M+'],
        ].map(([label, val]) => (
          <div key={label} className="text-center">
            <div className="text-2xl md:text-3xl font-heading font-bold text-white">{val}</div>
            <div className="text-white/60 text-sm mt-1">{label}</div>
          </div>
        ))}
      </motion.div>

      <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.9}} className="flex items-center gap-6 mt-10 flex-wrap justify-center">
        {[[Shield,'FCA Authorised'],[TrendingUp,'Live market data'],[Sparkles,'AI-powered search']].map(([Icon,text]) => (
          <div key={text} className="flex items-center gap-2 text-white/70 text-sm"><Icon className="w-4 h-4 text-blue-300"/>{text}</div>
        ))}
      </motion.div>
    </div>
  );
}
