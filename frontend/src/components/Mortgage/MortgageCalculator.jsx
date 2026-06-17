import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendingDown } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function MortgageCalculator() {
  const [price,    setPrice]    = useState(350000);
  const [deposit,  setDeposit]  = useState(70000);
  const [rate,     setRate]     = useState(4.5);
  const [term,     setTerm]     = useState(25);
  const [type,     setType]     = useState('repayment');

  const r = useMemo(() => {
    const loan = price - deposit;
    const mr = rate / 100 / 12;
    const np = term * 12;
    const ltv = ((loan / price) * 100).toFixed(1);
    const monthly = type === 'repayment'
      ? mr === 0 ? loan/np : (loan * mr * Math.pow(1+mr,np)) / (Math.pow(1+mr,np)-1)
      : loan * mr;
    const totalRep = type === 'repayment' ? monthly*np : monthly*np + loan;
    const chartData = [];
    let bal = loan;
    for (let y = 1; y <= term; y++) {
      for (let m = 0; m < 12; m++) { const ip = bal*mr; if (type==='repayment') bal -= (monthly-ip); }
      chartData.push({ year:`Yr ${y}`, balance: Math.max(0, Math.round(bal)) });
    }
    return { monthly, totalRep, totalInterest: totalRep-loan, loan, ltv, chartData };
  }, [price, deposit, rate, term, type]);

  const fmt = v => new Intl.NumberFormat('en-GB', { style:'currency', currency:'GBP', minimumFractionDigits:0 }).format(v);

  const Slider = ({ label, value, set, min, max, step, prefix='', suffix='' }) => (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <span className="text-blue-900 font-bold text-sm">{prefix}{value.toLocaleString()}{suffix}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => set(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-blue-700"/>
    </div>
  );

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center"><Calculator className="w-5 h-5 text-blue-700"/></div>
        <div><h2 className="text-xl font-heading font-bold text-blue-900">Mortgage Calculator</h2><p className="text-gray-500 text-sm">Instant estimate — not advice</p></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
            {['repayment','interest-only'].map(t => (
              <button key={t} onClick={() => setType(t)}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg capitalize transition-all ${type===t ? 'bg-white shadow text-blue-800' : 'text-gray-500'}`}>{t.replace('-',' ')}</button>
            ))}
          </div>
          <Slider label="Property price" value={price} set={setPrice} min={50000} max={5000000} step={5000} prefix="GBP "/>
          <Slider label="Deposit" value={deposit} set={setDeposit} min={5000} max={1000000} step={5000} prefix="GBP "/>
          <Slider label="Interest rate" value={rate} set={setRate} min={0.5} max={15} step={0.05} suffix="%"/>
          <Slider label="Mortgage term" value={term} set={setTerm} min={5} max={40} step={1} suffix=" yrs"/>
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Loan to Value (LTV)</span>
              <span className={`font-bold ${Number(r.ltv)>90?'text-red-600':Number(r.ltv)>75?'text-amber-600':'text-green-600'}`}>{r.ltv}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-500 ${Number(r.ltv)>90?'bg-red-500':Number(r.ltv)>75?'bg-amber-500':'bg-green-500'}`} style={{width:`${Math.min(r.ltv,100)}%`}}/>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <motion.div key={r.monthly} initial={{scale:0.95}} animate={{scale:1}}
            className="bg-gradient-to-br from-blue-900 to-blue-700 rounded-2xl p-6 text-white text-center">
            <p className="text-white/70 text-sm mb-1">Monthly payment</p>
            <p className="text-4xl font-heading font-bold">{fmt(r.monthly)}</p>
          </motion.div>

          <div className="grid grid-cols-2 gap-3">
            {[
              ['Loan amount',     fmt(r.loan),          'text-blue-700', 'bg-blue-50'],
              ['Total interest',  fmt(r.totalInterest), 'text-red-600',  'bg-red-50'],
              ['Total repayable', fmt(r.totalRep),      'text-gray-800', 'bg-gray-50'],
              ['Term',            `${term} years`,      'text-teal-600', 'bg-teal-50'],
            ].map(([label,val,tc,bg]) => (
              <div key={label} className={`${bg} rounded-xl p-3 text-center`}>
                <p className={`text-base font-bold font-heading ${tc}`}>{val}</p>
                <p className="text-gray-500 text-xs mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-1.5"><TrendingDown className="w-4 h-4 text-blue-500"/>Balance over time</p>
            <ResponsiveContainer width="100%" height={130}>
              <AreaChart data={r.chartData} margin={{top:5,right:5,bottom:0,left:0}}>
                <defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1d4ed8" stopOpacity={0.3}/><stop offset="100%" stopColor="#1d4ed8" stopOpacity={0}/></linearGradient></defs>
                <XAxis dataKey="year" tick={{fontSize:10,fill:'#9ca3af'}} tickLine={false} axisLine={false} interval={Math.floor(term/5)}/>
                <YAxis hide/>
                <Tooltip formatter={v => [fmt(v),'Balance']} contentStyle={{fontSize:12,borderRadius:8,border:'none',boxShadow:'0 4px 16px rgba(0,0,0,0.12)'}}/>
                <Area type="monotone" dataKey="balance" stroke="#1d4ed8" strokeWidth={2} fill="url(#bg)"/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <p className="text-xs text-gray-400 text-center mt-6">For illustrative purposes only. Consult a qualified mortgage adviser. PropAI is not FCA authorised for mortgage advice.</p>
    </div>
  );
}
