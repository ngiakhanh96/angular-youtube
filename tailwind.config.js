/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}', './modules/**/*.{html,ts}'],
  theme: {
    extend: {},
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.view-transition-none': {
          'view-transition-name': 'none',
        },
        '.view-transition-disabled': {
          'view-transition-name': 'disabled',
        },
        '.view-transition-auto': {
          'view-transition-name': 'auto',
        },
      };
      addUtilities(newUtilities);
    },
  ],
};
