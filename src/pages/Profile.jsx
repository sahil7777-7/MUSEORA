import React from 'react';
import { motion } from 'framer-motion';
import PageTransition from '../components/layout/PageTransition';
import { getViewedArtworks, getFavorites, getCompletedToursCount } from '../utils/storage';
import { Compass, Award, Bookmark, Eye, Layers } from 'lucide-react';

export default function Profile() {
  const viewedCount = getViewedArtworks().length || 4;
  const favoritesCount = getFavorites().length;
  const toursCount = getCompletedToursCount();
  const exhibitionsCount = 3;

  return (
    <PageTransition>
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', paddingTop: '8rem', paddingBottom: '8rem' }}>
        <div className="museo-container">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="museo-flex-between"
            style={{ flexWrap: 'wrap', borderBottom: '1px solid rgba(232, 224, 208, 0.1)', paddingBottom: '3rem', marginBottom: '4rem', gap: '1.5rem' }}
          >
            <div>
              <span className="font-mono text-gold-pure" style={{ fontSize: '0.75rem', letterSpacing: '0.25em', textTransform: 'uppercase', display: 'block', marginBottom: '0.75rem' }}>
                VISITOR DIGITAL PASSPORT
              </span>
              <h1 className="font-serif font-display-large" style={{ color: 'var(--text-primary)', textTransform: 'uppercase' }}>
                CURATOR PASSPORT
              </h1>
            </div>
            <div className="badge-gold">
              <Award style={{ width: '16px', height: '16px' }} />
              <span>PATRON LEVEL • GOLD MEMBER</span>
            </div>
          </motion.div>

          <div className="museo-grid-4" style={{ marginBottom: '4rem' }}>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
            >
              <div className="museo-flex-between text-gold-pure">
                <Eye style={{ width: '20px', height: '20px' }} />
                <span className="font-mono" style={{ fontSize: '0.65rem', letterSpacing: '0.15em' }}>METRIC 01</span>
              </div>
              <div className="font-serif font-hero" style={{ fontSize: '3.5rem', color: 'var(--text-primary)', fontWeight: 300, paddingTop: '0.5rem' }}>{viewedCount}</div>
              <p className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>ARTWORKS VIEWED</p>
            </motion.div>
  
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
            >
              <div className="museo-flex-between text-gold-pure">
                <Layers style={{ width: '20px', height: '20px' }} />
                <span className="font-mono" style={{ fontSize: '0.65rem', letterSpacing: '0.15em' }}>METRIC 02</span>
              </div>
              <div className="font-serif font-hero" style={{ fontSize: '3.5rem', color: 'var(--text-primary)', fontWeight: 300, paddingTop: '0.5rem' }}>{exhibitionsCount}</div>
              <p className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>EXHIBITIONS EXPLORED</p>
            </motion.div>
  
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
            >
              <div className="museo-flex-between text-gold-pure">
                <Bookmark style={{ width: '20px', height: '20px' }} />
                <span className="font-mono" style={{ fontSize: '0.65rem', letterSpacing: '0.15em' }}>METRIC 03</span>
              </div>
              <div className="font-serif font-hero" style={{ fontSize: '3.5rem', color: 'var(--text-primary)', fontWeight: 300, paddingTop: '0.5rem' }}>{favoritesCount}</div>
              <p className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>SAVED TO COLLECTION</p>
            </motion.div>
  
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
            >
              <div className="museo-flex-between text-gold-pure">
                <Compass style={{ width: '20px', height: '20px' }} />
                <span className="font-mono" style={{ fontSize: '0.65rem', letterSpacing: '0.15em' }}>METRIC 04</span>
              </div>
              <div className="font-serif font-hero" style={{ fontSize: '3.5rem', color: 'var(--text-primary)', fontWeight: 300, paddingTop: '0.5rem' }}>{toursCount}</div>
              <p className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>3D TOURS COMPLETED</p>
            </motion.div>
          </div>

          <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h3 className="font-serif" style={{ fontSize: '1.75rem', color: 'var(--text-primary)', textTransform: 'uppercase' }}>PATRON PRIVILEGES</h3>
            <div className="museo-grid-3" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 300 }}>
              <div style={{ padding: '1rem', backgroundColor: '#0B0A08', borderRadius: '8px', border: '1px solid rgba(232, 224, 208, 0.1)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <span className="font-mono text-gold-pure" style={{ fontSize: '0.75rem' }}>01 • AI CURATOR ACCESS</span>
                <p>Unlimited priority queries with Senior Curator AI system.</p>
              </div>
              <div style={{ padding: '1rem', backgroundColor: '#0B0A08', borderRadius: '8px', border: '1px solid rgba(232, 224, 208, 0.1)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <span className="font-mono text-gold-pure" style={{ fontSize: '0.75rem' }}>02 • HIGH-RES 3D INSPECTION</span>
                <p>Full 360-degree rotation and macro zoom on all cataloged masterpieces.</p>
              </div>
              <div style={{ padding: '1rem', backgroundColor: '#0B0A08', borderRadius: '8px', border: '1px solid rgba(232, 224, 208, 0.1)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <span className="font-mono text-gold-pure" style={{ fontSize: '0.75rem' }}>03 • VIRTUAL GALA PASSES</span>
                <p>Guaranteed entry passes for live curator walkthrough symposia.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
