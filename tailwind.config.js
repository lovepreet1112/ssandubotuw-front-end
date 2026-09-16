/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          sage: '#CCD5AE',       // Soft primary areas
          cream: '#E9EDC9',      // Secondary background
          warm: '#FAEDCD',       // Warm/light sections
          accent: '#D4A373',     // Buttons, highlights, borders, luxury accents
          dark: '#2A2923',       // Primary text tone
          muted: '#686558',      // Subtitle / muted text tone
          border: '#DDCBA4',     // Elegant borders
          surface: '#FDFBF7',    // Clean luxury background
          surfaceAlt: '#F7F4EA', // Alternate soft background
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'warm-sm': '0 2px 8px -2px rgba(212, 163, 115, 0.15)',
        'warm-md': '0 8px 24px -4px rgba(212, 163, 115, 0.18)',
        'warm-lg': '0 16px 36px -6px rgba(212, 163, 115, 0.22)',
      }
    },
  },
  plugins: [],
}
