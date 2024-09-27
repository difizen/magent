/** @type {import('tailwindcss').Config} */
import antdColors from './src/themes/antd-color-card.js';

export default {
  content: [
    './src/pages/**/*.tsx',
    './src/components/**/*.tsx',
    './src/layouts/**/*.tsx',
  ],
  theme: {
    extend: {
      colors: {
        // ...antdColors,
      },
    },
  },
  plugins: [],
};
