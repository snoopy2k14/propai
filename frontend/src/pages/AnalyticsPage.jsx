import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid, Legend } from 'recharts';
import { analyticsApi } from '../utils/api';

const TREND_DATA = [
  { month:'Jan', avgPrice:420000, rentPcm:1850 }, { month:'Feb', avgPrice:425000, rentPcm:1870 },
  { month:'Mar', avgPrice:432000, rentPcm:1880 }, { month:'Apr', avgPrice:428000, rentPcm:1895 },
  { month:'May', avgPrice:441000, rentPcm:1910 }, { month:'Jun', avgPrice:450000, rentPcm:1950 },
  { month:'Jul', avgPrice:455000, rentPcm:1980 }, { month:'Aug', avgPrice:460000, rentPcm:2000 },
  { month:'Sep', avgPrice:470000, rentPcm:2020 }, { month:'Oct', avgPrice:465000, rentPcm:2010 },
  { month:'Nov', avgPrice:475000, rentPcm:2040 }, { month:'Dec', avgPrice:485000, rentPcm:2100 },
];

export default function AnalyticsPage() {
  const [area, setArea] = useState('London');
  const [data, setData] = useState(null);
  useEffect(() => { analyticsApi.market(area).then(r => setData(r.data)).catch(() => {}); }, [area]);

  const fmt = v => new Intl.NumberFormat('en-GB', { style:'currency', currency:'GBP', minimumFractionDigits:0 }).format(v);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-4xl font-heading font-bold text-blue-900">Market Analytics</h1>
          <p className="text-gray-500 mt-2">Live UK property market data and trends</p>
        </div>

        <div className="mb-8 flex gap-3 flex-wrap">
          {['London','Manchester','Birmingham','Bristol','Leeds','Edinburgh'].map(c => (
            <button key={c} onClick={() => setArea(c)} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${area===c ? 'bg-blue-700 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-400'}`}>{c}</button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            ['Avg sale price', data ? fmt(data.avgSalePrice) : fmt(485000), '+2.8%', 'green'],
            ['Avg rent pcm',   data ? fmt(data.avgRentPcm)  : fmt(2100),   '+4.1%', 'blue'],
            ['Demand index',   data ? data.demandIndex      : 87,           'High',  'purple'],
            ['Days on market', data ? data.daysOnMarket     : 28,           '-3',    'amber'],
          ].map(([label,val,change,color]) => (
            <div key={label} className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="text-gray-500 text-sm">{label}</p>
              <p className="text-2xl font-heading font-bold text-gray-900 mt-1">{val}</p>
              <p className={`text-sm mt-1 font-medium text-${color}-600`}>{change}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="font-heading font-semibold text-gray-900 mb-4">Average sale price trend</h3>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={TREND_DATA}>
                <defs><linearGradient id="pg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#1d4ed8" stopOpacity={0.3}/><stop offset="95%" stopColor="#1d4ed8" stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                <XAxis dataKey="month" tick={{fontSize:12,fill:'#9ca3af'}} axisLine={false} tickLine={false}/>
                <YAxis tickFormatter={v => `${(v/1000).toFixed(0)}k`} tick={{fontSize:12,fill:'#9ca3af'}} axisLine={false} tickLine={false}/>
                <Tooltip formatter={v => [fmt(v),'Avg Price']}/>
                <Area type="monotone" dataKey="avgPrice" stroke="#1d4ed8" strokeWidth={2} fill="url(#pg)"/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="font-heading font-semibold text-gray-900 mb-4">Average rent per month</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={TREND_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                <XAxis dataKey="month" tick={{fontSize:12,fill:'#9ca3af'}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fontSize:12,fill:'#9ca3af'}} axisLine={false} tickLine={false}/>
                <Tooltip formatter={v => [fmt(v),'Avg Rent']}/>
                <Bar dataKey="rentPcm" fill="#0EA5E9" radius={[4,4,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
