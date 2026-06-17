import React from 'react';
import { Link } from 'react-router-dom';
import { Building, BarChart2, MessageSquare, Plus } from 'lucide-react';

export default function AgentPortalPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-heading font-bold text-blue-900">Agent Portal</h1>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto">Manage your listings, track leads and grow your business with PropAI.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon:Building, title:'Manage Listings', desc:'Add, edit and promote your property listings', color:'bg-blue-50 text-blue-700', link:'/agent-portal' },
            { icon:MessageSquare, title:'Enquiry Inbox', desc:'View and respond to buyer and renter enquiries', color:'bg-green-50 text-green-700', link:'/agent-portal' },
            { icon:BarChart2, title:'Analytics', desc:'Track views, saves and enquiries across your portfolio', color:'bg-purple-50 text-purple-700', link:'/agent-portal' },
          ].map(({ icon:Icon, title, desc, color, link }) => (
            <Link key={title} to={link} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${color}`}><Icon className="w-6 h-6"/></div>
              <h3 className="font-heading font-semibold text-gray-900 mb-2">{title}</h3>
              <p className="text-gray-500 text-sm">{desc}</p>
            </Link>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link to="/register" className="btn-primary inline-flex items-center gap-2"><Plus className="w-5 h-5"/>List your first property</Link>
        </div>
      </div>
    </div>
  );
}
