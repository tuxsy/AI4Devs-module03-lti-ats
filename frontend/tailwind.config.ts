import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e8f5e9',
          100: '#c8e6c9',
          500: '#4caf50',
          700: '#388e3c',
          900: '#1b5e20',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
