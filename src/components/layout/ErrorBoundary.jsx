import React, { Component } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

/**
 * MUSEORA — React Application & Scene Error Boundary
 * Prevents full-application white-screen crashes from unexpected errors.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('MUSEORA ErrorBoundary caught an unhandled exception:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          role="alert"
          style={{
            minHeight: '60vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0B0A08',
            color: '#F5F1E8',
            padding: '3rem 1.5rem',
            textAlign: 'center',
          }}
        >
          <div
            className="glass-panel"
            style={{
              padding: '3.5rem 2rem',
              borderRadius: '16px',
              maxWidth: '600px',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1.5rem',
              border: '1px solid rgba(182, 106, 98, 0.3)',
              backgroundColor: 'rgba(21, 19, 15, 0.95)',
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'rgba(182, 106, 98, 0.15)',
                border: '1px solid var(--danger)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--danger)',
              }}
            >
              <AlertTriangle style={{ width: '28px', height: '28px' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span className="font-mono text-gold-pure" style={{ fontSize: '0.75rem', letterSpacing: '0.2em' }}>
                MUSEORA SYSTEM RECOVERY
              </span>
              <h2 className="font-serif" style={{ fontSize: '1.85rem', color: '#F5F1E8', textTransform: 'uppercase' }}>
                EXHIBITION DISPLAY PAUSED
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 300, lineHeight: 1.5 }}>
                An unexpected technical disturbance interrupted this gallery room. Your saved collections and browsing progress remain intact.
              </p>
            </div>

            {this.state.error?.message && (
              <div
                className="font-mono"
                style={{
                  fontSize: '0.7rem',
                  color: 'rgba(232, 224, 208, 0.6)',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  width: '100%',
                  textAlign: 'left',
                  overflowX: 'auto',
                }}
              >
                {this.state.error.message}
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button
                onClick={this.handleReset}
                className="btn-primary-museo"
                style={{ padding: '0.7rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                data-cursor="click"
              >
                <RotateCcw style={{ width: '15px', height: '15px' }} />
                <span>RESTORE VIEW</span>
              </button>

              <button
                onClick={() => {
                  window.location.href = '/';
                }}
                className="btn-secondary-museo"
                style={{ padding: '0.7rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                data-cursor="click"
              >
                <Home style={{ width: '15px', height: '15px' }} />
                <span>RETURN TO ENTRANCE</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
