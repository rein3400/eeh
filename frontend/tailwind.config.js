/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#e97311', // Main brand orange
        'brand-secondary': '#1a4d2e', // Complementary dark teal
        'ibt-accent': '#3b82f6', // Blue for TOEFL iBT pages
        'itp-accent': '#9333ea', // Purple for TOEFL ITP pages
        'status-success': '#38a169', // Green for success
        'status-warning': '#e6a23c', // Yellow for warning
        'status-danger': '#ef4444', // Red for error
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Custom font family
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [],
};
