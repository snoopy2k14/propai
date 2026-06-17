import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-800 to-blue-400 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold font-heading">Prop<span className="text-blue-400">AI</span></span>
            </div>
            <p className="text-gray-400 text-sm">The UK's most advanced AI-powered property platform.</p>
          </div>
          {[
            { title: 'Property', links: [['Buy','/ buy'],['Rent','/rent'],['New Builds','/new-builds'],['Agent Portal','/agent-portal']] },
            { title: 'Tools', links: [['Mortgage Calculator','/mortgage-calculator'],['Market Analytics','/market-analytics'],['Saved Properties','/saved']] },
            { title: 'Company', links: [['About','#'],['Contact','#'],['Privacy','#'],['Terms','#']] },
          ].map(({ title, links }) => (
            <div key={title}>
              <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-400 mb-4">{title}</h3>
              <ul className="space-y-2">
                {links.map(([l, h]) => (
                  <li key={l}><Link to={h} className="text-gray-300 hover:text-white text-sm transition-colors">{l}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} PropAI Ltd. All rights reserved. Built with Spring Boot 4.1 · JDK 25 · Kafka 4 KRaft · React 18</p>
        </div>
      </div>
    </footer>
  );
}
