import React, { useState, Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import CustomCursor from './components/layout/CustomCursor';
import LoadingScreen from './components/layout/LoadingScreen';
import CuratorChat from './components/ui/CuratorChat';
import ErrorBoundary from './components/layout/ErrorBoundary';

const Home = lazy(() => import('./pages/Home'));
const Artworks = lazy(() => import('./pages/Artworks'));
const ArtworkDetail = lazy(() => import('./pages/ArtworkDetail'));
const Artists = lazy(() => import('./pages/Artists'));
const ArtistDetail = lazy(() => import('./pages/ArtistDetail'));
const Exhibitions = lazy(() => import('./pages/Exhibitions'));
const ExhibitionDetail = lazy(() => import('./pages/ExhibitionDetail'));
const MuseumMapPage = lazy(() => import('./pages/MuseumMapPage'));
const VirtualTour = lazy(() => import('./pages/VirtualTour'));
const Timeline = lazy(() => import('./pages/Timeline'));
const Search = lazy(() => import('./pages/Search'));
const Journal = lazy(() => import('./pages/Journal'));
const Events = lazy(() => import('./pages/Events'));
const Favorites = lazy(() => import('./pages/Favorites'));
const Profile = lazy(() => import('./pages/Profile'));
const Admin = lazy(() => import('./pages/Admin'));

import { AnimatePresence } from 'framer-motion';

function ScrollToTop() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  return null;
}

function AppContent() {
  const [curatorOpen, setCuratorOpen] = useState(false);
  const location = useLocation();

  // Hide Navbar and Footer on full-screen Virtual Tour page
  const isTour = location.pathname === '/tour';

  return (
    <div style={{ position: 'relative', minHeight: '100vh', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <ScrollToTop />
      <a href="#main-content" className="skip-to-content">Skip to content</a>
      <div className="grain-overlay" aria-hidden="true" />
      <CustomCursor />

      {!isTour && <Navbar onOpenCurator={() => setCuratorOpen(true)} />}

      <main id="main-content" style={{ position: 'relative', zIndex: 10 }}>
        <AnimatePresence mode="wait">
          <ErrorBoundary>
            <Suspense fallback={
              <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--gold)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                letterSpacing: '0.2em',
              }}>
                LOADING GALLERY...
              </div>
            }>
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Home />} />
                <Route path="/artworks" element={<Artworks />} />
                <Route path="/artworks/:id" element={<ArtworkDetail />} />
                <Route path="/artists" element={<Artists />} />
                <Route path="/artists/:id" element={<ArtistDetail />} />
                <Route path="/exhibitions" element={<Exhibitions />} />
                <Route path="/exhibitions/:id" element={<ExhibitionDetail />} />
                <Route path="/map" element={<MuseumMapPage />} />
                <Route path="/tour" element={<VirtualTour />} />
                <Route path="/timeline" element={<Timeline />} />
                <Route path="/search" element={<Search />} />
                <Route path="/journal" element={<Journal />} />
                <Route path="/events" element={<Events />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/admin" element={<Admin />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </AnimatePresence>
      </main>

      {!isTour && <Footer />}

      <CuratorChat isOpen={curatorOpen} onClose={() => setCuratorOpen(false)} />
    </div>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <LoadingScreen onFinish={() => setLoading(false)} />}
      <Router basename={import.meta.env.BASE_URL}>
        <AppContent />
      </Router>
    </>
  );
}
