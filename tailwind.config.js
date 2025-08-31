/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ethena-bg': '#1a1a1a',
        'ethena-accent': '#6b46c1',
        'ethena-card': 'rgba(255, 255, 255, 0.05)',
        'scientific-blue': '#0d47a1', // For atheist/scientific theme
        'rational-gray': '#757575',  // Gray for logical design
        'success-green': '#22c55e',  // New: For success notifications
        'error-red': '#ef4444',      // New: For error messages
        'info-blue': '#3b82f6',      // New: For info tooltips
        'warning-yellow': '#eab308', // Added: For warnings like stale data
        'loading-gray': '#4b5563',   // Added: For loading skeletons
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-in-out',
        'spin': 'spin 0.8s linear infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scale': 'scale 0.3s ease-in-out',
        'bounce': 'bounce 1s infinite',  // New: For interactive elements
        'slide-down': 'slideDown 0.3s ease-out', // Added: For mobile menu
        'fade-out': 'fadeOut 0.5s ease-in-out',  // Added: For notifications
        'skeleton-pulse': 'skeletonPulse 1.5s ease-in-out infinite', // Added: For loading skeletons to reduce perceived blinking
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(15px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scale: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        bounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        skeletonPulse: {
          '0%': { backgroundColor: 'rgba(75, 85, 99, 0.5)' }, // loading-gray with opacity
          '50%': { backgroundColor: 'rgba(75, 85, 99, 0.3)' },
          '100%': { backgroundColor: 'rgba(75, 85, 99, 0.5)' },
        },
      },
    },
  },
  plugins: [],
};