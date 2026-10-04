/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgPrimary: '#0B0A08',
        bgSecondary: '#15130F',
        bgPanel: '#1D1A15',
        bgElevated: '#252118',
        cream: '#E8E0D0',
        textPrimary: '#F5F1E8',
        textSecondary: '#A8A093',
        textMuted: '#7A746A',
        gold: '#C6A56B',
        goldHover: '#D4B57D',
        bronze: '#806643',
        museumLine: 'rgba(232, 224, 208, 0.10)',
        lineStrong: 'rgba(232, 224, 208, 0.18)',
        glass: 'rgba(255, 255, 255, 0.04)',
        glassStrong: 'rgba(255, 255, 255, 0.08)',
        danger: '#B66A62',
        success: '#8EA88C',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"DM Mono"', '"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        museum: '0.15em',
        wide: '0.18em',
        widest: '0.25em',
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      },
    },
  },
  plugins: [],
}
