/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        gold: '#F0B429',
        'gold-dark': '#D4990A',
        dark: '#0a0a0a',
        'dark-card': '#141414',
        'dark-border': '#2a2a2a',
      },
    },
  },
  plugins: [],
};
