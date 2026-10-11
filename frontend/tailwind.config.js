/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'da-teal': 'var(--da-teal)',
        'da-teal-dark': 'var(--da-teal-dark)',
        'da-teal-light': 'var(--da-teal-light)',
        'da-bg': 'var(--da-bg)',
        'da-surface': 'var(--da-surface)',
        'da-border': 'var(--da-border)',
        'da-text': 'var(--da-text)',
        'da-text-muted': 'var(--da-text-muted)',
        'da-text-faint': 'var(--da-text-faint)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
