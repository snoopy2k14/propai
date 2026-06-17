import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Key, Building, Calculator, TrendingUp, Menu, X, Sparkles, Heart, User } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';

const NAV = [
  { label: 'Buy',          href: '/buy',                icon: Home },
  { label: 'Rent',         href: '/rent',               icon: Key },
  { label: 'New Builds',   href: '/new-builds',         icon: Building },
  { label: 'Mortgages',    href: '/mortgage-calculator', icon: Calculator },
  { label: 'Market',       href: '/market-analytics',   icon: TrendingUp },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { user } = useSelector(s => s.auth);
  const dispatch = useDispatch();
  const isHome = pathname === '/';

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  const bg = isHome && !scrolled ? 'bg-transparent' : 'bg-white shadow-md';
  const tc = isHome && !scrolled ? 'text-white' : 'text-gray-700';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${bg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-800 to-blue-400 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className={`text-xl font-bold font-heading ${isHome && !scrolled ? 'text-white' : 'text-blue-900'}`}>
              Prop<span className="text-blue-400">AI</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {NAV.map(({ label, href, icon: Icon }) => (
              <Link key={href} to={href}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                  ${pathname === href ? 'bg-blue-700 text-white' : `${tc} hover:bg-white/10`}`}>
                <Icon className="w-4 h-4" />{label}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <>
                <Link to="/saved" className={`p-2 rounded-lg ${tc} hover:bg-white/10`}><Heart className="w-5 h-5" /></Link>
                <button onClick={() => dispatch(logout())} className={`text-sm font-medium ${tc}`}>Sign out</button>
              </>
            ) : (
              <>
                <Link to="/login" className={`text-sm font-medium ${tc} px-3 py-2`}>Sign in</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-5">Get started</Link>
              </>
            )}
            <Link to="/agent-portal" className={`text-sm border rounded-lg px-3 py-2 transition-colors ${isHome && !scrolled ? 'border-white/30 text-white' : 'border-gray-200 text-gray-600'}`}>
              List property
            </Link>
          </div>

          <button className={`lg:hidden p-2 ${tc}`} onClick={() => setOpen(!open)}>
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }}
            className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
            <div className="px-4 py-4 space-y-1">
              {NAV.map(({ label, href, icon: Icon }) => (
                <Link key={href} to={href} onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-blue-50 font-medium">
                  <Icon className="w-5 h-5" />{label}
                </Link>
              ))}
              <div className="pt-4 border-t space-y-2">
                <Link to="/login" onClick={() => setOpen(false)} className="block w-full btn-secondary text-center">Sign in</Link>
                <Link to="/register" onClick={() => setOpen(false)} className="block w-full btn-primary text-center">Get started</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
