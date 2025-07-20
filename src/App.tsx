import React, { Suspense, lazy } from 'react';
import { PageSkeleton } from './components/Skeleton';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
const Contact = lazy(() => import('./pages/Contact'));
const ToeflItp = lazy(() => import('./pages/ToeflItp'));
const ToeflIbt = lazy(() => import('./pages/ToeflIbt'));
const Blog = lazy(() => import('./pages/Blog'));

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={
              <Suspense fallback={<PageSkeleton />}>
                <Home />
              </Suspense>
            } />
            <Route path="/products" element={
              <Suspense fallback={<PageSkeleton />}>
                <Products />
              </Suspense>
            } />
            <Route path="/contact" element={
              <Suspense fallback={<PageSkeleton />}>
                <Contact />
              </Suspense>
            } />
            <Route path="/toefl-itp" element={
              <Suspense fallback={<PageSkeleton />}>
                <ToeflItp />
              </Suspense>
            } />
            <Route path="/toefl-ibt" element={
              <Suspense fallback={<PageSkeleton />}>
                <ToeflIbt />
              </Suspense>
            } />
            <Route path="/blog" element={
              <Suspense fallback={<PageSkeleton />}>
                <Blog />
              </Suspense>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

