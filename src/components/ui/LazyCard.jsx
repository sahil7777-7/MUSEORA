import React, { useRef, useState, useEffect } from 'react';

export default function LazyCard({ children, placeholderHeight = '360px', className = '' }) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '150px', // start loading before the card reaches viewport for smooth UX
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (observer) observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`${className} ${!isIntersecting ? 'skeleton-shimmer-card' : ''}`}
      style={{
        minHeight: isIntersecting ? 'auto' : placeholderHeight,
        width: '100%',
      }}
    >
      {isIntersecting ? children : null}
    </div>
  );
}
