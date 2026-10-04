import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Bookmark, Volume2, VolumeX, Sparkles, Menu, X } from 'lucide-react';
import { museumAudio } from '../../utils/audio';
import { getFavorites } from '../../utils/storage';

export default function Navbar({ onOpenCurator }) {
  const [scrolled, setScrolled] = useState(false);
  const [soundActive, setSoundActive] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setFavoritesCount(getFavorites().length);
    setMobileMenuOpen(false);
  }, [location]);

  const toggleSound = () => {
    const isEnabled = museumAudio.toggleSound();
    setSoundActive(isEnabled);
  };

  const navItems = [
    { label: 'Explore', path: '/artworks' },
    { label: 'Exhibitions', path: '/exhibitions' },
    { label: 'Artists', path: '/artists' },
    { label: 'Timeline', path: '/timeline' },
    { label: 'Virtual Tour', path: '/tour' },
    { label: 'Map', path: '/map' },
  ];

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9980,
        paddingTop: scrolled ? '0.6rem' : '1.25rem',
        paddingBottom: scrolled ? '0.6rem' : '1.25rem',
        backgroundColor: scrolled ? 'rgba(11, 10, 8, 0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(232, 224, 208, 0.12)' : 'none',
        transition: 'all var(--duration-normal) var(--ease-out)',
        boxShadow: scrolled ? '0 8px 24px rgba(0,0,0,0.6)' : 'none',
      }}
    >
      <div className="museo-container museo-flex-between">
        {/* Brand Logo */}
        <Link
          to="/"
          className="museo-entrance-nav museo-delay-1"
          onMouseEnter={() => museumAudio.playHoverSound()}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', flexShrink: 0 }}
          data-cursor="click"
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: '1px solid rgba(198, 165, 107, 0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: 'var(--gold)',
                animation: 'breatheScale 3s ease-in-out infinite',
              }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              className="font-serif"
              style={{
                fontSize: '1.25rem',
                letterSpacing: '0.22em',
                color: 'var(--text-primary)',
                fontWeight: 300,
                textTransform: 'uppercase',
                lineHeight: 1,
              }}
            >
              MUSEORA
            </span>
            <span
              className="font-mono"
              style={{
                fontSize: '0.55rem',
                letterSpacing: '0.2em',
                color: 'var(--gold)',
                marginTop: '2px',
              }}
            >
              VIRTUAL MUSEUM
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav
          className="desktop-nav font-sans museo-entrance-nav museo-delay-2"
          style={{
            fontSize: '0.75rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--text-secondary)',
          }}
        >
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onMouseEnter={() => museumAudio.playHoverSound()}
                onClick={() => museumAudio.playClickSound()}
                aria-current={isActive ? 'page' : undefined}
                style={{
                  position: 'relative',
                  paddingTop: '0.25rem',
                  paddingBottom: '0.35rem',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontWeight: isActive ? 500 : 400,
                  textDecoration: 'none',
                  transition: 'color var(--duration-normal) var(--ease-out)',
                  whiteSpace: 'nowrap',
                }}
                data-cursor="click"
              >
                {item.label}
                {isActive && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '1.5px',
                      backgroundColor: 'var(--gold)',
                      borderRadius: '1px',
                    }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Items */}
        <div className="museo-entrance-nav museo-delay-3" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
          {/* Sound Synthesizer Equalizer Toggle */}
          <button
            onClick={toggleSound}
            onMouseEnter={() => museumAudio.playHoverSound()}
            className="nav-desktop-only"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.35rem 0.75rem',
              borderRadius: '9999px',
              border: soundActive ? '1px solid var(--gold)' : '1px solid rgba(232, 224, 208, 0.15)',
              color: soundActive ? 'var(--gold)' : 'var(--text-secondary)',
              backgroundColor: soundActive ? 'rgba(198, 165, 107, 0.1)' : 'transparent',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              letterSpacing: '0.1em',
              cursor: 'pointer',
              transition: 'all var(--duration-normal) var(--ease-out)',
              boxShadow: soundActive ? '0 0 15px rgba(198, 165, 107, 0.2)' : 'none',
            }}
            data-cursor="click"
          >
            {soundActive ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '2px', height: '12px' }}>
                <span className="soundwave-bar" />
                <span className="soundwave-bar" />
                <span className="soundwave-bar" />
              </div>
            ) : (
              <VolumeX style={{ width: '12px', height: '12px' }} />
            )}
            <span style={{ display: 'inline-block' }}>{soundActive ? 'SOUND ON' : 'SOUND OFF'}</span>
          </button>

          {/* Search Trigger */}
          <button
            onClick={() => {
              museumAudio.playClickSound();
              navigate('/search');
            }}
            onMouseEnter={() => museumAudio.playHoverSound()}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '0.4rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Search Collection"
            data-cursor="click"
          >
            <Search style={{ width: '18px', height: '18px' }} />
          </button>

          {/* Saved Collection Favorites */}
          <Link
            to="/favorites"
            onMouseEnter={() => museumAudio.playHoverSound()}
            onClick={() => museumAudio.playClickSound()}
            style={{
              position: 'relative',
              color: 'var(--text-secondary)',
              padding: '0.4rem',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="My Collection"
            data-cursor="click"
          >
            <Bookmark style={{ width: '18px', height: '18px' }} />
            {favoritesCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '0px',
                  right: '0px',
                  width: '15px',
                  height: '15px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--gold)',
                  color: 'var(--bg-primary)',
                  fontSize: '0.55rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {favoritesCount}
              </span>
            )}
          </Link>

          {/* AI Curator Trigger */}
          <button
            onClick={() => {
              museumAudio.playClickSound();
              onOpenCurator && onOpenCurator();
            }}
            className="badge-gold nav-desktop-only"
            style={{ cursor: 'pointer', padding: '0.35rem 0.75rem' }}
            data-cursor="click"
          >
            <Sparkles style={{ width: '12px', height: '12px', color: 'var(--gold)' }} />
            <span>CURATOR</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              padding: '0.4rem',
            }}
            className="mobile-toggle"
            data-cursor="click"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X style={{ width: '22px', height: '22px' }} /> : <Menu style={{ width: '22px', height: '22px' }} />}
          </button>
        </div>
      </div>

      {/* Mobile Glass Menu Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: 'rgba(11, 10, 8, 0.96)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(232, 224, 208, 0.15)',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.85rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            boxShadow: '0 20px 40px rgba(0,0,0,0.9)',
          }}
        >
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                color: location.pathname === item.path ? 'var(--gold)' : 'var(--text-primary)',
                textDecoration: 'none',
                paddingBottom: '0.65rem',
                borderBottom: '1px solid rgba(232, 224, 208, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span>{item.label}</span>
              <span className="font-mono text-gold-pure" style={{ fontSize: '0.65rem' }}>→</span>
            </Link>
          ))}

          {/* Mobile Only: Saved Collection Link */}
          <Link
            to="/favorites"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              color: location.pathname === '/favorites' ? 'var(--gold)' : 'var(--text-primary)',
              textDecoration: 'none',
              paddingBottom: '0.65rem',
              borderBottom: '1px solid rgba(232, 224, 208, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>My Collection</span>
            <span className="font-mono text-gold-pure" style={{ fontSize: '0.65rem' }}>{favoritesCount} SAVED</span>
          </Link>

          {/* Mobile Only: Sound Toggle Row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.65rem', borderBottom: '1px solid rgba(232, 224, 208, 0.08)' }}>
            <span style={{ color: 'var(--text-secondary)' }}>SOUND ENGINE</span>
            <button
              onClick={toggleSound}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.35rem 0.75rem',
                borderRadius: '9999px',
                border: soundActive ? '1px solid var(--gold)' : '1px solid rgba(232, 224, 208, 0.15)',
                color: soundActive ? 'var(--gold)' : 'var(--text-secondary)',
                backgroundColor: soundActive ? 'rgba(198, 165, 107, 0.1)' : 'transparent',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                letterSpacing: '0.1em',
                cursor: 'pointer',
              }}
            >
              {soundActive ? 'ON' : 'OFF'}
            </button>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.5rem' }}>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/search');
              }}
              className="btn-secondary-museo"
              style={{ flex: 1, padding: '0.6rem' }}
            >
              SEARCH ARCHIVE
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCurator && onOpenCurator();
              }}
              className="btn-primary-museo"
              style={{ flex: 1, padding: '0.6rem' }}
            >
              ASK AI CURATOR
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
