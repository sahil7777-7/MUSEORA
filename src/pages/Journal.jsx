import React from 'react';
import { motion } from 'framer-motion';
import PageTransition from '../components/layout/PageTransition';
import { JOURNAL_POSTS } from '../data/museumData';
import TiltCard from '../components/ui/TiltCard';
import LazyCard from '../components/ui/LazyCard';
import { ArrowUpRight } from 'lucide-react';

export default function Journal() {
  return (
    <PageTransition>
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', paddingTop: '8rem', paddingBottom: '8rem' }}>
        <div className="museo-container">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{ borderBottom: '1px solid rgba(232, 224, 208, 0.1)', paddingBottom: '3rem', marginBottom: '4rem' }}
          >
            <span className="font-mono text-gold-pure" style={{ fontSize: '0.75rem', letterSpacing: '0.25em', textTransform: 'uppercase', display: 'block', marginBottom: '0.75rem' }}>
              EDITORIAL MAGAZINE & MONOGRAPHS
            </span>
            <h1 className="font-serif font-display-large" style={{ color: 'var(--text-primary)', textTransform: 'uppercase' }}>
              THE JOURNAL
            </h1>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', maxWidth: '640px', fontWeight: 300, marginTop: '1rem' }}>
              Curatorial essays, metallurgical research, philosophy of modern sculpture, and digital spatial architecture.
            </p>
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            {JOURNAL_POSTS.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: Math.min(index * 0.06, 0.5), ease: [0.22, 1, 0.36, 1] }}
              >
                <LazyCard placeholderHeight="420px">
                  <TiltCard dataCursor="view" style={{ padding: '2.5rem' }}>
                    <div className="museo-grid-2" style={{ alignItems: 'center', gap: '3rem' }}>
                      <div>
                        <div className="skeleton-shimmer-card" style={{ position: 'relative', height: '320px', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(232, 224, 208, 0.15)' }}>
                          <img
                            src={post.image}
                            alt={post.title}
                            onLoad={(e) => e.target.classList.add('loaded')}
                            className="lazy-image journal-card-image"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0B0A08 0%, transparent 60%)', opacity: 0.6, pointerEvents: 'none' }} />
                        </div>
                      </div>
    
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div className="font-mono text-gold-pure" style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'flex', gap: '0.75rem' }}>
                          <span>{post.category}</span>
                          <span>•</span>
                          <span>{post.date}</span>
                          <span>•</span>
                          <span>{post.readTime}</span>
                        </div>
    
                        <h2 className="font-serif" style={{ fontSize: '2.25rem', color: 'var(--text-primary)', textTransform: 'uppercase' }}>
                          {post.title}
                        </h2>
    
                        <p className="font-mono text-gold-pure" style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                          BY {post.author}
                        </p>
    
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 300, lineHeight: 1.7 }}>
                          {post.excerpt}
                        </p>
    
                        <div className="font-mono text-gold-pure" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', letterSpacing: '0.15em', marginTop: '0.5rem' }}>
                          <span>READ FULL MONOGRAPH</span>
                          <ArrowUpRight style={{ width: '16px', height: '16px' }} />
                        </div>
                      </div>
                    </div>
                  </TiltCard>
                </LazyCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
