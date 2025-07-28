import React, { Suspense, lazy, useEffect } from 'react';
import { PageSkeleton } from './components/Skeleton';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Products from './pages/Products';
import Contact from './pages/Contact';
import ToeflItp from './pages/ToeflItp';
import ToeflIbt from './pages/ToeflIbt';
import Blog from './pages/Blog';
import AdminDashboard from './pages/AdminDashboard';
import { initGA, usePageTracking, trackPerformance } from './utils/analytics';

function App() {
  // Initialize Google Analytics
  useEffect(() => {
    initGA();
    trackPerformance();
  }, []);

  return (
    <Router>
      <GoogleAnalyticsTracker />
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Routes>
          {/* Admin Route - No Header */}
          <Route path="/eeh-admin" element={<AdminDashboard />} />
          
          {/* Regular Routes - With Header */}
          <Route path="/*" element={
            <>
              <Header />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/toefl-itp" element={<ToeflItp />} />
                  <Route path="/toefl-ibt" element={<ToeflIbt />} />
                  <Route path="/blog" element={<Blog />} />
                </Routes>
              </main>
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

// Component to handle page tracking
function GoogleAnalyticsTracker() {
  usePageTracking();
  return null;
}

export default App;

