import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#23AABF',
        'primary-deep': '#007882',
        accent: '#FAFA6E',
        mint: '#86D780',
        forest: '#2A6858',
        secondary: '#0F172A'
      }
    },
  },
  plugins: [],
};

export default config;
