import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import store from './store/store';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import ChatbotWidget from './components/Chatbot/ChatbotWidget';
import PageLoader from './components/ui/PageLoader';
import './styles/globals.css';

const HomePage        = lazy(() => import('./pages/HomePage'));
const SearchPage      = lazy(() => import('./pages/SearchPage'));
const PropertyPage    = lazy(() => import('./pages/PropertyPage'));
const RentPage        = lazy(() => import('./pages/RentPage'));
const NewBuildsPage   = lazy(() => import('./pages/NewBuildsPage'));
const MortgagePage    = lazy(() => import('./pages/MortgagePage'));
const AnalyticsPage   = lazy(() => import('./pages/AnalyticsPage'));
const AgentPortalPage = lazy(() => import('./pages/AgentPortalPage'));
const LoginPage       = lazy(() => import('./pages/LoginPage'));
const RegisterPage    = lazy(() => import('./pages/RegisterPage'));
const SavedPage       = lazy(() => import('./pages/SavedPage'));

export default function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/"                     element={<HomePage />} />
                <Route path="/buy"                  element={<SearchPage type="SALE" />} />
                <Route path="/rent"                 element={<RentPage />} />
                <Route path="/new-builds"           element={<NewBuildsPage />} />
                <Route path="/property/:id"         element={<PropertyPage />} />
                <Route path="/mortgage-calculator"  element={<MortgagePage />} />
                <Route path="/market-analytics"     element={<AnalyticsPage />} />
                <Route path="/agent-portal"         element={<AgentPortalPage />} />
                <Route path="/login"                element={<LoginPage />} />
                <Route path="/register"             element={<RegisterPage />} />
                <Route path="/saved"                element={<SavedPage />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
          <ChatbotWidget />
          <Toaster position="top-right" toastOptions={{ duration: 4000, style: { background: '#1B3B6F', color: '#fff', borderRadius: '12px' } }} />
        </div>
      </Router>
    </Provider>
  );
}
