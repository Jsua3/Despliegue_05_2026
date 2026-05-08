/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      boxShadow: {
        soft: '0 14px 40px rgba(23, 32, 26, 0.08)'
      }
    }
  },
  plugins: []
};
