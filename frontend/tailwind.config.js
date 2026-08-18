/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0c', // Dark charcoal/black
        surface: '#141419',
        surfaceHighlight: '#1f1f26',
        primary: '#f97316', // Orange for heat
        accent: '#3b82f6',  // Blue for cool contrast
        danger: '#ef4444',
        warning: '#f59e0b',
        success: '#10b981'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
}
