import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PageTransition from '../components/layout/PageTransition';
import { ARTWORKS } from '../data/museumData';
import { searchMetArtworks } from '../services/metApi';
import TiltCard from '../components/ui/TiltCard';
import LazyCard from '../components/ui/LazyCard';
import ImageWithFallback from '../components/ui/ImageWithFallback';
import { ArtworkGridSkeleton } from '../components/ui/Skeleton';
import ErrorState from '../components/ui/ErrorState';
import EmptyState from '../components/ui/EmptyState';
import { Search as SearchIcon, Globe, Loader2, Sparkles, X } from 'lucide-react';
import { museumAudio } from '../utils/audio';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const initialQuery = searchParams.get('q') || '';
  const initialSource = searchParams.get('source') === 'met' ? 'met' : 'local';

  const [query, setQuery] = useState(initialQuery);
  const [searchSource, setSearchSource] = useState(initialSource); // 'local' | 'met'
  const [metResults, setMetResults] = useState([]);
  const [isMetLoading, setIsMetLoading] = useState(false);
  const [metTotalCount, setMetTotalCount] = useState(0);
  const [metOffset, setMetOffset] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [isStaleData, setIsStaleData] = useState(false);

  const activeAbortRef = useRef(null);
  const searchRequestIdRef = useRef(0);

  // Sync query & source to URL search params
  const updateUrlParams = useCallback((newQuery, newSource) => {
    const params = new URLSearchParams();
    if (newQuery.trim()) params.set('q', newQuery.trim());
    if (newSource === 'met') params.set('source', 'met');
    setSearchParams(params, { replace: true });
  }, [setSearchParams]);

  // Execute Met API search with AbortController and race condition guard
  const executeMetSearch = useCallback(async (searchQuery, offset = 0, isAppend = false) => {
    const trimmed = searchQuery.trim();
    if (trimmed.length < 2) {
      setMetResults([]);
      setMetTotalCount(0);
      setMetOffset(0);
      setApiError(null);
      setIsStaleData(false);
      setIsMetLoading(false);
      return;
    }

    // Cancel previous in-flight search
    if (activeAbortRef.current) {
      activeAbortRef.current.abort();
    }

    const abortController = new AbortController();
    activeAbortRef.current = abortController;
    const currentRequestId = ++searchRequestIdRef.current;

    if (isAppend) {
      setIsLoadingMore(true);
    } else {
      setIsMetLoading(true);
      setApiError(null);
      setIsStaleData(false);
    }

    try {
      const { results, totalCount, nextOffset, isStale } = await searchMetArtworks(trimmed, {
        offset,
        limit: 12,
        signal: abortController.signal,
      });

      // Ignore if a newer search was triggered
      if (currentRequestId !== searchRequestIdRef.current) return;

      if (isAppend) {
        setMetResults((prev) => [...prev, ...results]);
      } else {
        setMetResults(results);
      }
      setMetTotalCount(totalCount);
      setMetOffset(nextOffset);
      setApiError(null);
      setIsStaleData(isStale || false);
    } catch (err) {
      if (err.name === 'AbortError') return; // Expected cancellation

      if (currentRequestId === searchRequestIdRef.current) {
        setApiError('Unable to connect to the Met Museum catalog. Please check your network or try again.');
        if (!isAppend) setMetResults([]);
      }
    } finally {
      if (currentRequestId === searchRequestIdRef.current) {
        setIsMetLoading(false);
        setIsLoadingMore(false);
      }
    }
  }, []);

  // 300ms Debounced search effect
  useEffect(() => {
    updateUrlParams(query, searchSource);

    if (searchSource === 'met') {
      const timer = setTimeout(() => {
        executeMetSearch(query, 0, false);
      }, 300);

      return () => {
        clearTimeout(timer);
        if (activeAbortRef.current) {
          activeAbortRef.current.abort();
        }
      };
    } else {
      setMetResults([]);
      setApiError(null);
      setIsStaleData(false);
      setIsMetLoading(false);
    }
  }, [query, searchSource, executeMetSearch, updateUrlParams]);

  // Load more pagination handler
  const loadMoreMet = () => {
    if (isLoadingMore || metResults.length >= metTotalCount) return;
    museumAudio.playClickSound();
    executeMetSearch(query, metOffset, true);
  };

  // Local archive filtering
  const matchingArtworks = ARTWORKS.filter(
    (a) =>
      !query ||
      a.title.toLowerCase().includes(query.toLowerCase()) ||
      a.artist.toLowerCase().includes(query.toLowerCase()) ||
      a.category.toLowerCase().includes(query.toLowerCase()) ||
      a.era.toLowerCase().includes(query.toLowerCase())
  );

  const displayArtworks = searchSource === 'met' ? metResults : matchingArtworks;

  return (
    <PageTransition>
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', paddingTop: '7.5rem', paddingBottom: '8rem' }}>
        <div className="museo-container">
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 4rem auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <span className="font-mono text-gold-pure" style={{ fontSize: '0.75rem', letterSpacing: '0.25em', textTransform: 'uppercase' }}>
              MUSEORA DIGITAL CATALOG & LIVE MET API
            </span>
            <h1 className="font-serif font-display-large" style={{ color: 'var(--text-primary)', textTransform: 'uppercase' }}>
              REAL MUSEUM SEARCH
            </h1>

            {/* Input with Clear Button */}
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchSource === 'met' ? 'Search 470,000+ public domain Met Museum objects (e.g. Monet, Bronze, Armor)...' : 'Search local masterworks (e.g. Da Vinci, Rodin, Nataraja, Van Gogh)...'}
                className="input-museo"
                style={{
                  padding: '1.15rem 3.25rem 1.15rem 3.25rem',
                  borderRadius: '16px',
                  fontSize: '1rem',
                  border: '2px solid rgba(198, 165, 107, 0.4)',
                  boxShadow: '0 0 30px rgba(0,0,0,0.8)',
                  width: '100%',
                }}
                autoFocus
                aria-label="Search masterworks"
              />
              <SearchIcon style={{ position: 'absolute', left: '1.15rem', top: '50%', transform: 'translateY(-50%)', width: '22px', height: '22px', color: 'var(--gold)' }} />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  style={{
                    position: 'absolute',
                    right: '1.15rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    padding: '0.25rem',
                  }}
                  aria-label="Clear search query"
                  data-cursor="click"
                >
                  <X style={{ width: '18px', height: '18px' }} />
                </button>
              )}
            </div>

            {/* Source Toggle Chips */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => {
                  museumAudio.playClickSound();
                  setSearchSource('local');
                }}
                style={{
                  padding: '0.4rem 1rem',
                  borderRadius: '9999px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  backgroundColor: searchSource === 'local' ? 'var(--gold)' : 'rgba(29, 26, 21, 0.8)',
                  color: searchSource === 'local' ? 'var(--bg-primary)' : 'var(--text-secondary)',
                  border: searchSource === 'local' ? '1px solid var(--gold)' : '1px solid rgba(232, 224, 208, 0.15)',
                  fontWeight: searchSource === 'local' ? 600 : 400,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s',
                }}
                data-cursor="click"
                aria-pressed={searchSource === 'local'}
              >
                <Sparkles style={{ width: '14px', height: '14px' }} />
                <span>MUSEORA ARCHIVE</span>
              </button>

              <button
                onClick={() => {
                  museumAudio.playClickSound();
                  setSearchSource('met');
                }}
                style={{
                  padding: '0.4rem 1rem',
                  borderRadius: '9999px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  backgroundColor: searchSource === 'met' ? 'var(--gold)' : 'rgba(29, 26, 21, 0.8)',
                  color: searchSource === 'met' ? 'var(--bg-primary)' : 'var(--text-secondary)',
                  border: searchSource === 'met' ? '1px solid var(--gold)' : '1px solid rgba(232, 224, 208, 0.15)',
                  fontWeight: searchSource === 'met' ? 600 : 400,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s',
                }}
                data-cursor="click"
                aria-pressed={searchSource === 'met'}
              >
                <Globe style={{ width: '14px', height: '14px' }} />
                <span>MET MUSEUM LIVE API (v1.1)</span>
              </button>
            </div>

            {/* Quick Suggestions */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', paddingTop: '0.5rem' }}>
              <span className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginRight: '0.5rem' }}>TRY SEARCHING:</span>
              {(searchSource === 'met' ? ['Armor', 'Monet', 'Egyptian', 'Greek', 'Jade'] : ['Leonardo', 'Rodin', 'Chola', 'Van Gogh', 'Hokusai']).map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    museumAudio.playClickSound();
                    setQuery(term);
                  }}
                  onMouseEnter={() => museumAudio.playHoverSound()}
                  className="badge-cream"
                  style={{ cursor: 'pointer', border: '1px solid rgba(232, 224, 208, 0.15)', fontSize: '0.65rem' }}
                  data-cursor="click"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          {/* Results Status Header */}
          <div className="font-mono text-gold-pure" style={{ fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', borderBottom: '1px solid rgba(232, 224, 208, 0.1)', paddingBottom: '1rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <span>
              {searchSource === 'met' ? 'MET MUSEUM LIVE OPEN ACCESS RESULTS' : 'PERMANENT ARCHIVE RESULTS'}{' '}
              {!isMetLoading && `(${displayArtworks.length}${searchSource === 'met' && metTotalCount > displayArtworks.length ? ` of ${metTotalCount.toLocaleString()}` : ''})`}
            </span>
            {isMetLoading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--gold)' }}>
                <Loader2 style={{ width: '16px', height: '16px', animation: 'spinSlow 1s linear infinite' }} />
                <span>RETRIEVING FROM MET CATALOG...</span>
              </div>
            )}
            {!isMetLoading && isStaleData && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f59e0b', backgroundColor: 'rgba(245, 158, 11, 0.1)', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
                <span>⚠️ OFFLINE CACHED RESULTS</span>
              </div>
            )}
          </div>

          {/* Error State with Retry */}
          {apiError && !isMetLoading && (
            <ErrorState
              title="MET MUSEUM ARCHIVE UNREACHABLE"
              message={apiError}
              onRetry={() => executeMetSearch(query, 0, false)}
              retryText="RETRY SEARCH"
            />
          )}

          {/* Loading Skeletons */}
          {isMetLoading && metResults.length === 0 && !apiError && (
            <ArtworkGridSkeleton count={6} />
          )}

          {/* Empty State */}
          {!isMetLoading && !apiError && displayArtworks.length === 0 && (
            <EmptyState
              title={query ? `NO MASTERWORKS FOUND FOR "${query}"` : 'NO MASTERWORKS TO DISPLAY'}
              message={
                searchSource === 'met'
                  ? 'Try searching with alternate terms like "Rembrandt", "Sculpture", "Gold", or "Japanese".'
                  : 'Try exploring with alternate keywords or switch to the Live Met Museum API catalog.'
              }
              action={query ? () => setQuery('') : null}
              actionText="CLEAR SEARCH QUERY"
            />
          )}

          {/* Results Grid with Resilient ImageWithFallback */}
          {!apiError && displayArtworks.length > 0 && (
            <div className="museo-grid-3">
              {displayArtworks.map((art, index) => (
                <motion.div
                  key={art.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.4), ease: [0.22, 1, 0.36, 1] }}
                >
                  <LazyCard placeholderHeight="340px">
                    <TiltCard
                      onClick={() => navigate(`/artworks/${art.id}`)}
                      dataCursor="view"
                    >
                      <div style={{ position: 'relative', height: '340px', overflow: 'hidden', padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div style={{ position: 'absolute', inset: 0, borderRadius: 0 }}>
                          <ImageWithFallback
                            src={art.image}
                            alt=""
                            fallbackTitle={art.title}
                            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
                          />
                        </div>
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0B0A08 0%, rgba(11, 10, 8, 0.45) 50%, transparent 100%)', pointerEvents: 'none' }} />

                        <span className="font-mono badge-cream" style={{ position: 'relative', zIndex: 10, alignSelf: 'flex-start', fontSize: '0.65rem' }}>
                          {art.category || 'Masterwork'}
                        </span>

                        <div style={{ position: 'relative', zIndex: 10, marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                          <span className="font-mono text-gold-pure" style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                            {art.year} • {art.location || 'The Met Collection'}
                          </span>
                          <h3 className="font-serif" style={{ fontSize: '1.35rem', color: 'var(--text-primary)', lineHeight: 1.2 }}>
                            {art.title}
                          </h3>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>BY {art.artist}</p>
                        </div>
                      </div>
                    </TiltCard>
                  </LazyCard>
                </motion.div>
              ))}
            </div>
          )}

          {/* Load More for Met */}
          {searchSource === 'met' && metResults.length > 0 && metResults.length < metTotalCount && !apiError && (
            <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
              <div className="font-mono text-gold-pure" style={{ fontSize: '0.75rem', letterSpacing: '0.15em', marginBottom: '1rem' }}>
                SHOWING {metResults.length} OF {metTotalCount.toLocaleString()} VERIFIED MASTERWORKS
              </div>
              <button
                onClick={loadMoreMet}
                disabled={isLoadingMore}
                className="btn-secondary-museo"
                style={{ opacity: isLoadingMore ? 0.7 : 1, cursor: isLoadingMore ? 'not-allowed' : 'pointer' }}
                data-cursor="click"
              >
                {isLoadingMore ? (
                  <>
                    <Loader2 style={{ width: '16px', height: '16px', animation: 'spinSlow 1s linear infinite' }} />
                    <span>RETRIEVING NEXT BATCH...</span>
                  </>
                ) : (
                  'LOAD MORE MASTERWORKS'
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
