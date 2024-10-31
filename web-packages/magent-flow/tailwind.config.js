/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/pages/**/*.tsx',
    './src/components/**/*.tsx',
    './src/layouts/**/*.tsx',
  ],
  theme: {
    extend: {
      boxShadow: {
        card: '0 3px 8px 0 rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.08), 0 3px 8px 3px rgba(0, 0, 0, 0.05);',
        'card-lg':
          '0 1px 2px -2px rgba(0, 0, 0, 0.16), 0 3px 6px 0 rgba(0, 0, 0, 0.12), 0 5px 12px 4px rgba(0, 0, 0, 0.09);',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
