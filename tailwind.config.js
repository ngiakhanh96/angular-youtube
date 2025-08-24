/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}', './modules/**/*.{html,ts}'],
  theme: {
    extend: {
      transitionDuration: {
        400: '400ms',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.view-transition-none': {
          'view-transition-name': 'none',
        },
      };
      addUtilities(newUtilities);
    },
  ],
};
