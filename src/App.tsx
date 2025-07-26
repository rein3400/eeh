import React, { Suspense, lazy } from 'react';
import { PageSkeleton } from './components/Skeleton';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Products from './pages/Products';
import Contact from './pages/Contact';
import ToeflItp from './pages/ToeflItp';
import ToeflIbt from './pages/ToeflIbt';
import Blog from './pages/Blog';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
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
      </div>
    </Router>
  );
}

export default App;

