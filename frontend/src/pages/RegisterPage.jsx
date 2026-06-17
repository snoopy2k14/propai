import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../store/authSlice';
import { Sparkles } from 'lucide-react';

export default function RegisterPage() {
  const [form, setForm] = useState({ firstName:'', lastName:'', email:'', password:'', role:'BUYER' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector(s => s.auth);

  const update = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    const r = await dispatch(register(form));
    if (!r.error) navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-800 to-blue-400 rounded-xl flex items-center justify-center mx-auto mb-4"><Sparkles className="w-6 h-6 text-white"/></div>
          <h1 className="text-2xl font-heading font-bold text-blue-900">Create your account</h1>
          <p className="text-gray-500 mt-1">Join 2M+ people on PropAI</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First name</label>
              <input value={form.firstName} onChange={update('firstName')} required placeholder="Jane"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-blue-400"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last name</label>
              <input value={form.lastName} onChange={update('lastName')} required placeholder="Smith"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-blue-400"/>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={form.email} onChange={update('email')} required placeholder="jane@email.com"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-blue-400"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" value={form.password} onChange={update('password')} required placeholder="Min 8 characters"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-blue-400"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">I am a...</label>
            <select value={form.role} onChange={update('role')} className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-blue-400">
              <option value="BUYER">Home buyer</option>
              <option value="RENTER">Renter</option>
              <option value="INVESTOR">Investor</option>
              <option value="AGENT">Estate agent</option>
              <option value="LANDLORD">Landlord</option>
            </select>
          </div>
          <button type="submit" disabled={loading} className="w-full btn-primary disabled:opacity-50">
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account? <Link to="/login" className="text-blue-700 font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
